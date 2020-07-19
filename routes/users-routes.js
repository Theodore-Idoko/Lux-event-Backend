const express = require('express');
const { check } = require('express-validator')
// express-validator required above is used to do the validation from the backend 

const usersController = require('../controllers/users-controller')

// userscontroller is where the the main logic about the signup and the logic is, it is separeted for clarity and required here.
const router = express.Router();

router.post(
  '/signup',
  [
    check('name')
    .not()
    .isEmpty(),
    check('email')
    .normalizeEmail()
    .isEmail(),
    check('password').isLength({ min: 8 })
  ],
  usersController.signup
);

router.post('/login', usersController.login)

module.exports = router;