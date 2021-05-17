const express = require('express');
const app = express();
const expressHBS = require("express-handlebars");
const mongoose = require('mongoose');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const { port, database, root_folder, db_defaults, static_files_folder } = require('./config');

const http = require('https');
const httpsOptions = {
    key: fs.readFileSync('./security/cert.key'),
    cert: fs.readFileSync('./security/cert.pem')
}
const https_server = http.createServer(httpsOptions, app);
const { Server } = require("socket.io");
const io = new Server(https_server);

const login_router = require('./routers/login_router');
const main_router = require('./routers/main_router');
const reg_router = require('./routers/reg_router');
const file_router = require('./routers/file_router');
const admin_router = require('./routers/admin_router');
const api_router = require('./routers/api_router');
const mandatoryMessage_router = require('./routers/mandatoryMessage_router');

const authMiddleware = require('./middlewares/authMiddleware');
const roleMiddleware = require('./middlewares/roleMiddleware');

connection_uri = `mongodb+srv://${database.DB_USERNAME}:${database.DB_PASSWORD}@${database.CLUSTER}.33drn.mongodb.net/${database.DATABASE}?retryWrites=true&w=majority`;

app.use(cookieParser());
app.use(express.json());
app.use(express.static(root_folder + static_files_folder));

app.engine("hbs", expressHBS(
    {
        layoutsDir: "views/layouts",
        defaultLayout: "layout",
        extname: "hbs"
    }
))
app.set('view engine', 'hbs');

app.use('/login', login_router);
app.use('/registration', reg_router);
app.use('/upload', file_router);
app.use('/api', api_router);
app.use('/', [authMiddleware], main_router);
app.use('/mandatoryMessage', mandatoryMessage_router);
app.use('/accessManagement', [roleMiddleware([db_defaults.role.admin])], admin_router);

https_server.listen(port, async () =>
{
    await mongoose.connect(connection_uri, {useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`Listening to http://localhost:${port}`);
});

//------------------------------ Socket

const chatMember_controller = require('./controllers/chat_controller');
const user_controller = require('./controllers/user_controller');
const chat_controller = require('./controllers/chat_controller');
let connected_sockets = [];

io.on('connection', (socket) =>
{
    socket.on('user-connect', async (user_id) =>
    {
        const connected_userInfo = JSON.parse(await user_controller.getInfoJSONbyID(user_id));
        if(!connected_userInfo.is_blocked)
        {
            let connected_user_chats = await chatMember_controller.getUserChats(user_id);
            for (let i = 0; i < connected_user_chats.length; i++)
            {
                let chat_id_string = connected_user_chats[i].toString();
                socket.join(chat_id_string);
            }

            for (let i = 0; i < connected_sockets.length; i++)
            {
                if(connected_sockets[i].user_id == user_id)
                {
                    connected_sockets[i].socket = socket;
                    socket.broadcast.emit('user-connected', user_id, connected_userInfo.is_blocked);
                    user_controller.setStatus(user_id, 1);
                    return;
                }
            }

            connected_sockets.push({socket: socket, user_id: user_id});
            user_controller.setStatus(user_id, 1);
            socket.broadcast.emit('user-connected', user_id);
        }
    });

    socket.on('disconnect', async () =>
    {
        for (let i = 0; i < connected_sockets.length; i++)
        {
            if(socket.id == connected_sockets[i].socket.id)
            {
                const connected_userInfo = JSON.parse(await user_controller.getInfoJSONbyID(connected_sockets[i].user_id));

                socket.broadcast.emit('user-disconnected', connected_sockets[i].user_id, connected_userInfo.is_blocked);
                user_controller.setStatus(connected_sockets[i].user_id, 0);
                connected_sockets.slice(i, 1);
                break;
            }
        }
    })

    socket.on('broadcast_message', (messageInfo) =>
    {
        socket.to(messageInfo.chat_id).emit('receive-message', messageInfo);
    });

    socket.on('broadcast_read_message', (chat_id, message_id) =>
    {
        socket.to(chat_id).emit('receive-read-message', chat_id, message_id);
    });

    socket.on('broadcast_add_contact', (other_contact_id, contactInfoForOtherContact) =>
    {
        socket.join(contactInfoForOtherContact.chat_id);

        for (let i = 0; i < connected_sockets.length; i++)
        {
            if(other_contact_id == connected_sockets[i].user_id)
            {
                connected_sockets[i].socket.join(contactInfoForOtherContact.chat_id);
                connected_sockets[i].socket.emit('receive-new-contact', contactInfoForOtherContact);
                break;
            }
        }
    });

    socket.on('broadcast_delete_contact', (chat_id, initer_id, contact_id) =>
    {
        for (let i = 0; i < connected_sockets.length; i++)
        {
            if( contact_id == connected_sockets[i].user_id ||
                contact_id == initer_id)
            {
                connected_sockets[i].socket.leave(chat_id);

                if(contact_id == connected_sockets[i].user_id)
                {
                    connected_sockets[i].socket.emit('receive-delete-contact', chat_id);
                }
                break;
            }
        }
    });

    socket.on('broadcast_add_conv', (creator_id, chat_id, chat_title, chat_avatar_path, members) =>
    {
        for (let i = 0; i < connected_sockets.length; i++)
        {
            for (let j = 0; j < members.length; j++)
            {
                if( members[j] == connected_sockets[i].user_id)
                {
                    connected_sockets[i].socket.join(chat_id);

                    if(connected_sockets[i].user_id != creator_id)
                    {
                        connected_sockets[i].socket.emit('receive-new-conv', chat_id, chat_title, chat_avatar_path, members.length);
                    }
                    break;
                }
            }
        }
    });

    socket.on('broadcast_leave_conv', async (chat_id, left_user_id) =>
    {
        for (let i = 0; i < connected_sockets.length; i++)
        {
            if(left_user_id == connected_sockets[i].user_id)
            {
                connected_sockets[i].socket.leave(chat_id);
                break;
            }
        }
        const members_amount = await chat_controller.chatMembersAmount(chat_id);
        socket.to(chat_id).emit('user_left_conv', chat_id, members_amount);
    });

    socket.on('broadcast_user_blockStatusChanged', async (user_id, new_block_status) =>
    {
        const connected_userInfo = JSON.parse(await user_controller.getInfoJSONbyID(user_id));
        socket.broadcast.emit('user_blockStatusChanged', user_id, connected_userInfo.status, new_block_status);
    });
})