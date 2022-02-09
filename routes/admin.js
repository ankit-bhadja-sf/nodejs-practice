const path = require('path');

const express = require('express');

const isAuth = require('../middleware/is-auth')

// const rootDir = require('../util/path');

const adminController = require('../controllers/admin.js');

const { check, body } = require('express-validator');

const router = express.Router();

//admin/add-product

router.get('/add-product', isAuth, adminController.getAddProduct);

//admin/products

 router.get('/products', isAuth, adminController.getProducts);

 router.post('/add-product',[
    body('title', 'Your Title length is very Short')
        .isLength({ min: 3})
        .trim(),
    body('imageUrl', ' Your url is not Valid')
        .isURL(),
    body('price', 'Please Input Double Number Value')
        .isFloat(),
    body('description', ' Your Desc is very Short')
        .isLength({ min: 25, max: 200})

 ], isAuth, adminController.postAddProduct);

 router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

 router.post('/edit-product', [
    body('title', 'Your Title length is very Short')
        .isLength({ min: 3})
        .trim(),
    body('price', 'Please Input Double Number Value')
        .isFloat(),
    body('description', ' Your Desc is very Short')
        .isLength({ min: 25, max: 200})

 ], isAuth, adminController.postEditProduct);

 router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router
