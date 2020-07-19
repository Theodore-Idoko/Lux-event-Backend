const express = require('express');
const { check } = require('express-validator');
// express-validator required above is used to do the validation from the backend

const stateControllers = require('../controllers/states-controllers')
// statecontroller is where the the main logic about the states are, it is separated for clarity and required here.

const router = express.Router();

router.get('/', stateControllers.getState);

router.get('/:sid', stateControllers.getStateById)

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