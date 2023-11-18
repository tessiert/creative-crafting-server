const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');
const cors = require('./cors');

const userRouter = express.Router();

userRouter.options('*', cors.corsWithOptions, (req, res) => {
  res.sendStatus(200);
});

userRouter.post('/signup', cors.corsWithOptions, (req, res) => {
  User.register(
    new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      username: req.body.username
    }),
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err)
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err });
      } else {
        user.save((err) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({ err: err });
            return;
          }
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({
              success: true,
              status: 'Registration Successful!'
            });
          });
        });
      }
    }
  );
});

userRouter.post('/login', cors.corsWithOptions, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({
        success: false,
        status: 'Login Unsuccessful',
        err: info
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        return res.json({
          success: false,
          status: 'Login Unsuccessful',
          err: 'Could not log in user'
        });
      }
      const token = authenticate.getToken({ _id: user._id });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({
        success: true,
        token: token,
        id: req.user._id,
        firstname: req.user.firstname,
        status: 'You are successfully logged in'
      });
    });
  })(req, res, next);
});

userRouter.get(
  '/logout',
  cors.cors,
  authenticate.verifyUser,
  (req, res, next) => {
    authenticate.getToken({ _id: req.user._id }, 0);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({
      success: true,
      status: 'You have successfully logged out'
    });
  }
);

userRouter.get('/checkJWTtoken', cors.cors, (req, res) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    if (!user) {
      return res.json({ status: 'JWT invalid', success: false, err: info });
    } else {
      return res.json({ status: 'JWT valid', success: true, user: user });
    }
  })(req, res);
});

module.exports = userRouter;