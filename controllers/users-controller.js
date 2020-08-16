const { validationResult } = require('express-validator')
// express-validator required above is used to do the validation from the backend 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
// the HttpError is just a constructor function for handling errors
const User = require('../models/users');
// the User from the userSchema is required.


const signup = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()){
    return next(
      new HttpError(
        'Invalid inputs passed, please check your data', 422
      )
    );
    // this is the validation to check whether the inputs are correct
  }

  const { name, email, password } = req.body;
  // the above is the required input to be in req.body

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email});
    // checks if there is any existing user
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User exists already, please login instead.',
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
    //password is hashed with bcrypt.hast with salting of 12
  } catch (err) {
    const error = new HttpError(
      'Could not create user, please try again.',
      500
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    bookings: []
  });

  try {
    await createdUser.save();
    // the createdUser is saved
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again.',
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId:createdUser.id, email: createdUser.email },
      'secret_dont_share',
      { expiresIn: '1h'}
    );
    // token is to expire in an hour is gotten from here
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ userId: createdUser.id, email: createdUser.email, token: token})
  // the userId, email and token is sent to response

};

const login = async (req, res, next) => {
  const{ email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
    // to check if a the user exists
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password)
    // to check if the password is correct, bcrypt.compare is used
  } catch (err) {
    const error = new HttpError(
      'Could not log you in, please check you credentials and try again.',
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403
    );
    return next(error);
  }

  let token; 
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      'secret_dont_share',
      { expiresIn: '1h' }
    );
    // token is gotten
  } catch (err) {
    const error = new HttpError('login failed, please try again.', 500);
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token
  });
// the above is sent to the response
}

exports.signup = signup;
exports.login = login;