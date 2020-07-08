const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const citySchema = new Schema({
  city: { type: String, required: true},
  stateId: { type: mongoose.Types.ObjectId, required: true, ref: 'State'},
  venues: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Venue'}]
}) 


module.exports = mongoose.model('City', citySchema);