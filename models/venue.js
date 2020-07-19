const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const venueSchema = new Schema({
  venue: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  guestCapacity: { type: Number, require: true},
  service: { type: String, required: true },
  location: {
    lat: { type: Number, required: true},
    lng: { type: Number, required: true}
  },
  style: { type: String, required: true },
  amenities: { type: String, required: true},
  date: { type: String, required: true},
  address: { type: String, required: true},
  //image: { type: String, required: true },
  cityId: { type: mongoose.Types.ObjectId, required: true, ref: 'City'}
  // in the venueschema, the id for the city is required in other associate particular venues to a particular city
})

module.exports = mongoose.model('Venue', venueSchema);
