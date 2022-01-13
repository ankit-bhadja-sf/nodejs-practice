const path = require('path');

const express = require('express');

// const rootDir = require('../util/path');

const adminController = require('../controllers/admin.js');

const router = express.Router();
//admin/add-product
router.get('/add-product', adminController.getAddProduct);
//admin/products
router.get('/products', adminController.getProducts);

router.post('/add-product', adminController.postAddProduct);

router.get('/edit-product/:productId', adminController.getEditProduct);
<<<<<<< HEAD
=======

router.post('/edit-product', adminController.postEditProduct);
>>>>>>> 2734e963dd9719e6410a5a32dda98612c9cd642e

module.exports = router
