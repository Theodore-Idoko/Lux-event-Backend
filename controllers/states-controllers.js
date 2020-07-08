const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const State = require('../models/states');
const mongoose = require('mongoose');

const getState = async (req, res, next) => {

  let states;
  try {
    states = await State.find({});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a state.',
      500
    );
    return next(error);
  }
  res.json({ states: states.map((state) => state.toObject({ getters: true}))}); // to turn state to a simple javascript object
}

const createState = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs, please check your data.', 422)
    )
  }

  const { state } = req.body;

  const createdState = new State({
    state,
    cities: []
  })
  try {
    await createdState.save();
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
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update state.',
      500
    );
    return next(error);
  }

  updatedState.state = state;

  try {
    await updatedState.save();
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
  } catch (Err) {
    const error = new HttpError(
      'Something went wrong, could not delete state.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'State deleted.' });
}

exports.createState = createState;
exports.getState = getState;
exports.updateState = updateState;
exports.deleteState = deleteState;