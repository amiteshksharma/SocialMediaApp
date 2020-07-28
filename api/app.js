const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
const admin = require('firebase-admin');
require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert({
    "client_email": process.env.CLIENT_EMAIL,
    "private_key": process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    "project_id": process.env.PROJECT_ID,
    "private_key_id": process.env.PRIVATE_KEY_ID,
    "client_id": process.env.CLIENT_ID,
    "type": process.env.TYPE    
  }),
  databaseURL: "https://fir-api-9a206..firebaseio.com"
});

const usersRouter = require('./routes/users');
const backendRouter = require('./routes/backend');
const profileRouter = require('./routes/profile');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes for user data
app.use("/", usersRouter);
app.use("/users", usersRouter);

// Routes for liking and loading posts
app.use("/backend", backendRouter);
app.use("/backend/create", backendRouter);

//Routes for the user's profile settings
app.use("/settings", profileRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
