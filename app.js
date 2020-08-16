const express = require('express');
const mongoose = require('mongoose');
const pug = require('pug');
const path = require('path')
const _ = require('lodash')
require('dotenv').config();

const NAME= process.env.MONGODB_NAME_PASSWORD

const paymentRoutes = require('./routes/payment-routes')
const venueRoutes= require('./routes/venue-routes')
const cityRoutes = require('./routes/city-routes')
const stateRoutes = require('./routes/state-routes')
const usersRoutes = require('./routes/users-routes')
const bookingRoutes = require('./routes/booking-routes')
const HttpError = require('./models/http-error')

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  next();
});

app.use(express.static(path.join(__dirname, 'public/')));
app.set('view engine', pug)

app.use('', paymentRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/venues', venueRoutes)
app.use('/api/cities', cityRoutes)
app.use('/api/states', stateRoutes)
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

mongoose
  .connect(
    'mongodb+srv://${NAME}@cluster0-panjd.mongodb.net/lux-app?retryWrites=true&w=majority'
  )
  .then(() => {
    app.listen(4000);
  })
  .catch((err) => {
    console.log(err);
  });

