const express = require("express");
const payment_route = express.Router();

const bodyParser = require('body-parser');
payment_route.use(bodyParser.json());
payment_route.use(bodyParser.urlencoded({ extended:false }));

const paymentController = require('../../controllers/shop/paymentController');

payment_route.post('/payment', paymentController.paymentProcess);
payment_route.post('/verify', paymentController.paymentVerify);
payment_route.post('/create-order', paymentController.createOrder)

module.exports = payment_route;