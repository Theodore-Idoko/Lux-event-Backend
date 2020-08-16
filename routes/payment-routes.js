const express = require('express');
const { check } = require('express-validator');
// express-validator required above is used to do the validation from the backend

const paymentController = require('../controllers/payment-controller')
// statecontroller is where the the main logic about the states are, it is separated for clarity and required here.

const router = express.Router();

router.get('/', paymentController.getPayment);

router.get('/paystack/callback', paymentController.getPaymentFromPaystack);

router.get('/receipt/:id', paymentController.getPaymentById)

// router.get('/:sid', stateControllers.getStateById)

router.post(
  '/paystack/pay', 
  [
  
    check('full_name')
    .not()
    .isEmpty(),
    check('email')
    .normalizeEmail()
    .isEmail(),
  check('amount')
  .not()
  .isEmpty(), paymentController.makePayment]
);

// router.patch(
//   '/:sid',
//   [check('state')
//   .not()
//   .isEmpty(), stateControllers.updateState]
// );

//  router.delete('/:sid', stateControllers.deleteState);

module.exports = router