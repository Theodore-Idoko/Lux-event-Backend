const fs = require('fs');
const { validationResult } = require('express-validator');
// express-validator required above is used to do the validation from the backend 
const HttpError = require('../models/http-error');
// the httpError is just a constructor function for handling errors
const getCoordsForAddress = require('../utils/location');
// the getcoordinates where the arguement from the google api for the longitude and latitude is required
const City = require('../models/cities');
const Venue = require('../models/venue');
// the City and Venueschema is required
const mongoose = require('mongoose');

const getVenueById = async (req, res, next) => {
  const venueId = req.params.vid;

  let venue;
  try {
    venue = await Venue.findById(venueId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a venue.',
      500
    );
    return next(error);
  }
  if (!venue) {
    const error = new HttpError(
      'Could not find a venue for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ venue: venue.toObject({ getters: true }) }); // to turn place to a simple javascript object
};


const getVenuesByCityId = async (req, res, next) => {
  const cityId = req.params.cid;

  let citiesHasVenue;
  try {
    citiesHasVenue = await City.findById(cityId).populate('venues');
    // the city with the particular id is found and the venues are populated
  } catch (err) {
    const error = new HttpError(
      'Fetching venues failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!citiesHasVenue || citiesHasVenue.length === 0) {
    const error = new HttpError(
      'Could not find a citiesHasVenue for the provided id.',
      404
    );
    return next(error);
  }

  res.json({
    venues: citiesHasVenue.venues.map((venue) => 
      venue.toObject({ getters: true}) // the venues as simple javascript object is returned
    ),
  })
}

const createVenue = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
    // validation of the input is checked above
  }

  const { venue, price, date, guestCapacity, service, description, style, amenities,address, cityId} = req.body;

  let coordinates;

  try {
    coordinates = await getCoordsForAddress(address);
    // address is passed into getCoordsForAddress in order to get the coordinates of the particular address
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
    // the city is found from with the help of the cityid
  } catch (err) {
    const error = new HttpError('Creating venue failed, please try again', 500);
    return next(error)
  }

  if (!city) {
    const error = new HttpError('Could not find city with the provided id', 404);
    return next(error)
  }

  try {
    // a session is started where the createdvenue will be saved and as well as pushed to venues array of the particular city whose cityId was indicated
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
};

const updateVenue = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { venue, price, date, guestCapacity, service, description, style, amenities,address, } = req.body;
  const venueId = req.params.vid;

  let venueOfCity;
  try {
    venueOfCity = await Venue.findById(venueId)
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update venue.',
      500
    );
    return next(error);
  }

  venueOfCity.venue = venue;
  venueOfCity.description = description;
  venueOfCity.price = price;
  venueOfCity.address = address;
  venueOfCity.style = style;
  venueOfCity.amenities = amenities;
  venueOfCity.guestCapacity = guestCapacity;
  venueOfCity.date = date;
  venueOfCity.service = service;
  // venueofcity is updated

  try {
    await venueOfCity.save();
    // updated venueofCity is save
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update venue.',
      500
    );
    return next(error);
  }

  res.status(200).json({venue: venueOfCity.toObject({ getters: true })}) ; // returned as simple javascript object
};

const deleteVenue = async (req, res, next ) => {
  const venueId = req.params.vid;

  let venue;
  try {
    venue = await Venue.findById(venueId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete venue.',
      500
    );
    return next(error);
  }

  if (!venue) {
    const error = new HttpError('Could not find venue for this id.', 404);
    return next(error);
  }

  try {
    await venue.remove()
  } catch (Err) {
    const error = new HttpError(
      'Something went wrong, could not delete venue.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'venue deleted.' });
}

exports.getVenueById = getVenueById;
exports.getVenuesByCityId = getVenuesByCityId;
exports.createVenue = createVenue;
exports.updateVenue = updateVenue;
exports.deleteVenue = deleteVenue;
