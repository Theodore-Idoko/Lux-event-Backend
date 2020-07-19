const axios = require('axios')

const HttpError = require('../models/http-error');

const API_KEY = 'AIzaSyCYLQFgFS-r3RI8GxG0530b31GCx9zET4g';

// This is built for for the address to be connected to google api in order to get the longitude and latitude but since
// i have My api key is not functioning at the moment, i hard coded the longitude and latitude

async function getCoordsForAddress(address) {
   return {
    lat: 40.7484474,
    lng: -73.9871516
  };
  // const response= await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}key=${API_KEY}`)

  // const data = response.data;

  // if(!data || data.status === 'ZERO_RESULTS') {
  //   const error = new HttpError('Could not find location for the specified address.', 422);
  //   throw error;
  // }
  // console.log(data)
  // const coordinates = data.results[0].geometry.location;

  // return coordinates;
};

module.exports = getCoordsForAddress;