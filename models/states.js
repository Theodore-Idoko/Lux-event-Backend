const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema;

const stateSchema = new Schema({
  state: { type: String, required: true},
  cities: [{ type: mongoose.Types.ObjectId, required: true, ref: 'City'}]
  // in the stateschema, it has cities which is an array. it is meant to house the ids of different cities that are in a particular state.
}) 


module.exports = mongoose.model('State', stateSchema);