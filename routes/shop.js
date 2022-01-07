const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const adminData = require('./admin');

const router = express.Router();

const productsController = require('../controllers/product');


router.get('/', productsController.addProducts);


module.exports = router