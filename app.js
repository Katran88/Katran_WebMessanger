const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const login_router = require('./routers/login_router');
const main_router = require('./routers/main_router');
const reg_router = require('./routers/reg_router');
const authMiddleware = require('./middlewares/authMiddleware');
const roleMiddleware = require('./middlewares/roleMiddleware');

PORT        = process.env.PORT || 8888;
DBUSERNAME  = process.env.DBUSERNAME || 'db_user';
DBPASSWORD  = process.env.DBPASSWORD || 'Stalker2';
CLUSTER     = process.env.CLUSTER || 'webkatran';
DATABASE    = process.env.DATABASE || 'webkatran_db';

connection_uri = `mongodb+srv://${DBUSERNAME}:${DBPASSWORD}@${CLUSTER}.33drn.mongodb.net/${DATABASE}?retryWrites=true&w=majority`;

app.use(cookieParser());
app.use(express.json());

app.use('/login', login_router);
app.use('/registration', reg_router);
app.use('/', [authMiddleware, roleMiddleware(['admin'])], main_router);

app.listen(PORT, async () =>
{
    await mongoose.connect(connection_uri, {useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`Listening to http://localhost:${PORT}`);
});