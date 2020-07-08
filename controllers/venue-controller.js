const fs = require('fs');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../utils/location');
const City = require('../models/cities');
const Venue = require('../models/venue');
const mongoose = require('mongoose');

const createVenue = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { venue, price, date, guestCapacity, service, description, style, amenities,address, cityId} = req.body;

  let coordinates;

  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdVenue = new Venue({
    venue,
    price,
    date,
    address,
    location: coordinates,
    // image: req.file.path,
    guestCapacity,
    service,
    description,
    style,
    amenities,
    cityId
  })

  let city;

  try {
    city = await City.findById(cityId)
  } catch (err) {
    const error = new HttpError('Creating venue failed, please try again', 500);
    return next(error)
  }

  if (!city) {
    const error = new HttpError('Could not find city with the provided id', 404);
    return next(error)
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdVenue.save({ session: sess });
    city.venues.push(createdVenue);
    await city.save({ session: sess })
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Creating venue failed, please try again.',
      500
    );
    return next(error)
  }
  res.status(201).json({ venue: createdVenue });
}

exports.createVenue = createVenue;