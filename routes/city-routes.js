const express = require('express');
const { check } = require('express-validator');

const cityControllers = require('../controllers/city-controller')
const HttpError = require('../models/http-error');

const router = express.Router();

router.get('/', cityControllers.getCity);

router.post(
  '/', 
  [check('city')
  .not()
  .isEmpty(), cityControllers.createCity]
);

router.patch(
  '/:cid',
  [check('city')
  .not()
  .isEmpty(), cityControllers.updateCity]
);

router.delete('/:cid', cityControllers.deleteCity);

module.exports = router