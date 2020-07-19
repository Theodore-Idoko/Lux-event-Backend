const express = require('express');
const { check } = require('express-validator');
// express-validator required above is used to do the validation from the backend

const cityControllers = require('../controllers/city-controller')
// citycontroller is where the the main logic about the cities are, it is separated for clarity and required here.

const router = express.Router();

router.get('/', cityControllers.getCity);
router.get('/:cid', cityControllers.getCityById)
router.get('/city/:sid', cityControllers.getCityByStateId)

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