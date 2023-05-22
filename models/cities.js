const mongoose = require("mongoose");

const CitySchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  typeOfCity: {
    type: String,
    required: true,
  },
  infraIndex: {
    type: Number,
  },
});

module.exports = mongoose.model("Cities", CitySchema);