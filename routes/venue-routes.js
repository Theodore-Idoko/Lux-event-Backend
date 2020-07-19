const express = require('express');
const { check } = require('express-validator');
// express-validator required above is used to do the validation from the backend 

const venuesController = require('../controllers/venue-controller');
// venuescontroller is where the the main logic about the venues are, it is separeted for clarity and required here.

const router = express.Router();

router.get('/:vid', venuesController.getVenueById)

router.get('/venue/:cid', venuesController.getVenuesByCityId)

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

router.patch(
  '/:vid',
  [
    check('venue')
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
  venuesController.updateVenue);

 router.delete('/:vid', venuesController.deleteVenue);

module.exports = router;
