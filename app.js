const express = require('express');
const app = express();
const expressHBS = require("express-handlebars");
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { port, database } = require('./config');

const login_router = require('./routers/login_router');
const main_router = require('./routers/main_router');
const reg_router = require('./routers/reg_router');
const authMiddleware = require('./middlewares/authMiddleware');

connection_uri = `mongodb+srv://${database.DB_USERNAME}:${database.DB_PASSWORD}@${database.CLUSTER}.33drn.mongodb.net/${database.DATABASE}?retryWrites=true&w=majority`;

app.use(cookieParser());
app.use(express.json());
app.use(express.static(__dirname + '\\static'));

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
app.use('/', [authMiddleware], main_router);

app.listen(port, async () =>
{
    await mongoose.connect(connection_uri, {useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`Listening to http://localhost:${port}`);
});