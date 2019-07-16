const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser")
mongoose.connect("mongodb://127.0.0.1/books", { useNewUrlParser: true, useFindAndModify: true });

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: '3F4AC6457727284A092C4A49AF568775',
    resave: false,
    saveUninitialized: true
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users.route');
const authenRouter = require('./routes/authen.route');
const bookRouter = require('./routes/books.route');
app.use('/', indexRouter);
app.use('/authen', authenRouter);
app.use('/users', usersRouter);
app.use('/books', bookRouter);


module.exports = app;
