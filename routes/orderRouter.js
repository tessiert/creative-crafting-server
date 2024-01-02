const express = require('express');
const Order = require('../models/order');
const authenticate = require('../authenticate');
const cors = require('./cors');

const orderRouter = express.Router();

orderRouter
  .route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Order.find()
      .then((orders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(orders);
      })
      .catch((err) => next(err));
  }
  )
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Order.create(req.body)
      .then((order) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(order);
      })
      .catch((err) => {
        console.log(req.body);
        next(err)
      });
  });

module.exports = orderRouter;