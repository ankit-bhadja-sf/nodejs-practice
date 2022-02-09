const express = require('express');
const {check, body} = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();


router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', 
        [
        body('email', 'Please Enter Valid Email Address')
            .isEmail()
            .withMessage('Please Enter Valid Email Address')
            .normalizeEmail(),
        body('password', 'Minimum Length is 5 char')
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim()
        ],
    authController.postLogin);

router.post('/signup',
 [check('email')
    .isEmail()
    .withMessage('Please Enter Valid Email')
    .custom((value, {req} ) =>  {
       return User.findOne({email: value })
            .then( userDoc => {
                if (userDoc) {
                    return Promise.reject(
                        'E-mail exists Already'
                    );
                }
            })
    })
    .normalizeEmail(),
 body('password', 'Minimum Length is 5 char')
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim(),    
body('confirmPassword')
    .custom( (value, {req} ) => {
        if (value !== req.body.password) {
            throw new Error('Pasword is not Match');
        }
        return true;
    })
], 
authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;