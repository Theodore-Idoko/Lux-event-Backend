class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); // Add a 'message' property
    this.code = errorCode; // Adds a 'code' property
  }
}

// the httpError is just a constructor function for handling errors

module.exports = HttpError;