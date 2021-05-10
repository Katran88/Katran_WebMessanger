const express = require('express');
const app = express();
const expressHBS = require("express-handlebars");
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { port, database, root_folder, db_defaults, static_files_folder } = require('./config');

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

app.listen(port, async () =>
{
    await mongoose.connect(connection_uri, {useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`Listening to http://localhost:${port}`);
});