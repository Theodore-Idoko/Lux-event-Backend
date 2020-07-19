const { validationResult } = require('express-validator');
// express-validator required above is used to do the validation from the backend 
const HttpError = require('../models/http-error');
// the httpError is just a constructor function for handling errors
const State = require('../models/states');
// stateSchema is required
const mongoose = require('mongoose');

const getState = async (req, res, next) => {

  let states;
  try {
    states = await State.find({});
    // check and find the states
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a state.',
      500
    );
    return next(error);
  }
  res.json({ states: states.map((state) => state.toObject({ getters: true}))}); // to turn state to a simple javascript object
  // the states are in the response as simple javascript object
}

const getStateById = async (req, res, next) => {
  const stateId = req.params.sid;
  

  let state;
  try {
    state = await State.findById(stateId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a state.',
      500
    );
    return next(error);
  }
  if (!state) {
    const error = new HttpError(
      'Could not find a state for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ state: state.toObject({ getters: true }) }); // to turn place to a simple javascript object
};

const createState = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs, please check your data.', 422)
    )
    // validation of the input is checked above
  }

  const { state } = req.body;
  // state is required in req.body

  const createdState = new State({
    state,
    cities: []
  })
  // createdState has state and cities array 
  try {
    await createdState.save();
    // state is saved
  } catch (err) {
    const error = new HttpError('Creating state failed, try again.', 500);
    return next(error);
  }

  res.status(201).json({state: createdState, stateId: createdState.id})
};

const updateState = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs, please check your data.', 422)
    )
  }

  const { state } = req.body;
  const stateId = req.params.sid;

  let updatedState;
  try {
    updatedState = await State.findById(stateId)
    // id of the particular state is checked
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update state.',
      500
    );
    return next(error);
  }

  updatedState.state = state;
  // state is updated

  try {
    await updatedState.save();
    // updatedstate is saved
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update state.',
      500
    );
    return next(error);
  }

  res.status(200).json({ updatedState: updatedState.toObject({getters: true})})
};

const deleteState = async (req, res, next ) => {
  const stateId = req.params.sid;

  let state;
  try {
    state = await State.findById(stateId);
    // state with the particular id is found
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete state.',
      500
    );
    return next(error);
  }

  if (!state) {
    const error = new HttpError('Could not find state for this id.', 404);
    return next(error);
  }

  try {
    await state.remove()
    // it is removed
  } catch (Err) {
    const error = new HttpError(
      'Something went wrong, could not delete state.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'State deleted.' });
}

exports.getStateById = getStateById;
exports.createState = createState;
exports.getState = getState;
exports.updateState = updateState;
exports.deleteState = deleteState;