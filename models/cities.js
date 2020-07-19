const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const citySchema = new Schema({
  city: { type: String, required: true},
  stateId: { type: mongoose.Types.ObjectId, required: true, ref: 'State'},
  // in the cityschema, the id for the state is required in other associate particular cities to a particular state
  venues: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Venue'}]
  // in the cityschema, it has venues which is an array. it is meant to house the ids of different venues that are in a particular city.
}) 


module.exports = mongoose.model('City', citySchema);