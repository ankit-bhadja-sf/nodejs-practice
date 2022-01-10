const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const adminData = require('./admin');

const router = express.Router();

const shopController = require('../controllers/shop.js');


router.get('/', shopController.getIndex);

router.get('/products', shopController.addProducts);

router.get('/products/:productId', shopController.getProducts);

router.get('/cart', shopController.getCart);

router.get('/orders', shopController.getOrders);

router.get('/checkout', shopController.getCheckout);


module.exports = router