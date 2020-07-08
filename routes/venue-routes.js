const express = require('express');
const { check } = require('express-validator');

const venuesController = require('../controllers/venue-controller');
const HttpError = require('../models/http-error');

const router = express.Router();

router.post(
  '/',
  [
    check('venue')
    .not()
    .isEmpty(),
    check('price')
    .not()
    .isEmpty(),
    check('description')
    .isLength({min: 10}),
    check('address')
    .isLength({ min: 10}),
    check('date')
    .not()
    .isEmpty(),
    check('style')
    .not()
    .isEmpty(),
    check('amenities')
    .isLength({ min: 10}),
    check('guestCapacity')
    .not()
    .isEmpty(),
    check('service')
    .not()
    .isEmpty(),
  ],
  venuesController.createVenue
)

// router.patch(
//   '/:vid',
//   [
//     check('venue')
//     .not()
//     .isEmpty(),
//     check('decription')
//     .isLength({min: 10}),
//     check('address')
//     .isLength({ min: 10}),
//     check('date')
//     .not()
//     .isEmpty(),
//     check('style')
//     .not()
//     .isEmpty(),
//     check('amenities')
//     .isLength({ min: 10}),
//     check('guestCapacity')
//     .not()
//     .isEmpty(),
//     check('service')
//     .not()
//     .isEmpty(),
//   ],
//   venuesController.updateVenue);

// router.delete('/:vid', venuesController.deleteVenue);

module.exports = router;
