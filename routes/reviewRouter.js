const express = require('express');
const Review = require('../models/review');
const authenticate = require('../authenticate');
const cors = require('./cors');

const reviewRouter = express.Router();

reviewRouter
  .route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Review.find()
      .then((reviews) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(reviews);
      })
      .catch((err) => next(err));
  }
  )
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Review.create(req.body)
      .then((review) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(review);
      })
      .catch((err) => next(err));
  });

module.exports = reviewRouter;