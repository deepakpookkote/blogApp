const express = require('express');

const router = express.Router();

const { check, body } = require('express-validator');
const User = require('../models/user');

const isAuth = require('../middleware/is-auth');

const authController = require('../controllers/auth');

router.put('/signup', [
    body('email')
        .isEmail().withMessage('Please enter a valid email')
        .custom((value, { req }) => {
            return User.findOne({ email: value }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject('Email already exist');
                }
            });
        })
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 5 }),
    body('name')
        .trim()
        .not()
        .isEmpty()
], authController.signUp);

router.post('/login', authController.signIn);

router.get('/status', isAuth, authController.getUserStatus);

router.put('/status', [
    body('status')
     .trim()
     .not()
     .isEmpty()
], isAuth, authController.updateUserStatus);


module.exports = router;