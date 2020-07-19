const jwt = require('jsonwebtoken')

const HttpError = require("../models/http-error");

// check-auth is mainly for authorisation, it checks if a certain user can gain access to certain routes. this can only happen if the user is logged in

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    if(!token) {
      throw new Error('Authentication failed!')
    }
    const decodedToken = jwt.verify(token, 'supersecret_dont_share');
    req.userData = {userId : decodedToken.userId}
    next();
  } catch (err) {
    const error = new HttpError(
      'Authentication failed!',
      403
    )
    return next(error)
  }
}