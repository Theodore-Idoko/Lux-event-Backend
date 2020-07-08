const express = require('express');
const { check } = require('express-validator');

const stateControllers = require('../controllers/states-controllers')
const HttpError = require('../models/http-error');

const router = express.Router();

router.get('/', stateControllers.getState);

router.post(
  '/', 
  [check('state')
  .not()
  .isEmpty(), stateControllers.createState]
);

router.patch(
  '/:sid',
  [check('state')
  .not()
  .isEmpty(), stateControllers.updateState]
);

 router.delete('/:sid', stateControllers.deleteState);

module.exports = router