const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema;

const stateSchema = new Schema({
  state: { type: String, required: true},
  cities: [{ type: mongoose.Types.ObjectId, required: true, ref: 'City'}]
}) 


module.exports = mongoose.model('State', stateSchema);