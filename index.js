const createError = require('http-errors');
const express = require('express');
const path = require('path');
// const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');

const indexRouter = require('./routes/indexRouter');
const userRouter = require('./routes/userRouter');
const reviewRouter = require('./routes/reviewRouter');
const orderRouter = require('./routes/orderRouter');

const config = require('./config');

const url = config.mongoConnectionString;

const connect = async () => {
  await mongoose.connect(url, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

connect().catch((err) => functions.logger.log(err));

const app = express();

//http to https redirects
// app.enable('trust proxy');
// app.use((req, res, next) => {
//   if (req.secure) {
//     next();
//   } else {
//     res.redirect('https://creativecrafting.dreamhosters.com' + req.url);
//   }
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/reviews', reviewRouter);
app.use('/orders', orderRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

exports.creativeCraftingServer = app;