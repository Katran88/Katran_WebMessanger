const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { port, database } = require('./config');

const login_router = require('./routers/login_router');
const main_router = require('./routers/main_router');
const reg_router = require('./routers/reg_router');
const authMiddleware = require('./middlewares/authMiddleware');
const roleMiddleware = require('./middlewares/roleMiddleware');

connection_uri = `mongodb+srv://${database.DB_USERNAME}:${database.DB_PASSWORD}@${database.CLUSTER}.33drn.mongodb.net/${database.DATABASE}?retryWrites=true&w=majority`;

app.use(cookieParser());
app.use(express.json());

app.use('/login', login_router);
app.use('/registration', reg_router);
app.use('/', [authMiddleware, roleMiddleware(['admin'])], main_router);

app.listen(port, async () =>
{
    await mongoose.connect(connection_uri, {useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`Listening to http://localhost:${port}`);
});