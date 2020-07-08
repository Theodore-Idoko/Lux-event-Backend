const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const City = require('../models/cities');
const State = require('../models/states')
const mongoose = require('mongoose');

const getCity = async (req, res, next) => {

  let states;
  try {
    cities = await City.find({});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a state.',
      500
    );
    return next(error);
  }
  res.json({ cities: cities.map((city) => city.toObject({ getters: true}))}); // to turn state to a simple javascript object
}

const getCityById = async (req, res, next) => {
  const cityId = req.params.cid;

  let city;
  try {
    city = await city.findById(cityId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a city.',
      500
    );
    return next(error);
  }
  if (!city) {
    const error = new HttpError(
      'Could not find a city for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ city: city.toObject({ getters: true }) }); // to turn place to a simple javascript object
};

const getCityByStateId = async (req, res, next) => {
  const stateId = req.params.sid;

  let stateHasCities;
  try {
    stateHasCities = await State.findById(stateId).populate('cities');
  } catch (err) {
    const error = new HttpError(
      'Fetching cities failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!stateHasCities || stateHasCities.length === 0) {
    const error = new HttpError(
      'Could not find a stateHasCities for the provided id.',
      404
    );
    return next(error);
  }

  res.json({
    cities: stateHasCities.cities.map((city) => 
      city.toObject({ getters: true})
    ),
  })
}

const createCity = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs, please check your data.', 422)
    )
  }

  const { city, stateId } = req.body;

  const createdCity = new City({
    city,
    stateId,
    venues: []
  });

  let state;
  try {
    state = await State.findById(stateId)
  } catch (err) {
    const error = new HttpError('Creating city failed, please try again', 500);
    return next(error);
  }

  if (!state) {
    const error = new HttpError('Could not find state for the provided id', 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdCity.save({ session: sess})
    state.cities.push(createdCity);
    await state.save({ session: sess});
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError('Creating state failed, try again.', 500);
    return next(error);
  }

  res.status(201).json({city: createdCity})
};

const updateCity = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs, please check your data.', 422)
    )
  }

  const { city } = req.body;
  const cityId = req.params.cid;

  let updatedCity;
  try {
    updatedCity = await City.findById(cityId)
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update state.',
      500
    );
    return next(error);
  }

  updatedCity.city = city;

  try {
    await updatedCity.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update state.',
      500
    );
    return next(error);
  }

  res.status(200).json({ updatedCity: updatedCity.toObject({getters: true})})
};

const deleteCity = async (req, res, next ) => {
  const cityId = req.params.cid;

  let city;
  try {
    city = await City.findById(cityId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete city.',
      500
    );
    return next(error);
  }

  if (!city) {
    const error = new HttpError('Could not find city for this id.', 404);
    return next(error);
  }

  try {
    await city.remove()
  } catch (Err) {
    const error = new HttpError(
      'Something went wrong, could not delete city.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'city deleted.' });
}

exports.getCityById = getCityById;
exports.createCity = createCity;
exports.getCity = getCity;
exports.updateCity = updateCity;
exports.deleteCity = deleteCity;
exports.getCityByStateId = getCityByStateId;