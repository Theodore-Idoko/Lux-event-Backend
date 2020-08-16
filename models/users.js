const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
// mongoose-unique-validator is a plugin which adds pre-save validation for unique fields within a Mongoose schema. here we see that the email is unique.

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8 },
  bookings: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Booking'}]
})

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema)