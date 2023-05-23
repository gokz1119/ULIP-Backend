const mongoose = require('mongoose');

// Define a schema for the shipment collection
const shipmentRequestSchema = new mongoose.Schema({
  userId:  {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  status:{
    type:String,
    required:true
  },
  source:  {
    type: Number,
    required: true,
  },
  destination:  {
    type: Number,
    required: true,
  },
  date:  {
    type: Date,
    required: true,
  },
  shipmentType:  {
    type: String,
    required: true,
  },
  hub:  {
    latitude:  {
      type: Number,
      required: false,
    },
    longitude:  {
      type: Number,
      required: false,
    },
    _id:  {
      type: Number,
      required: false,
    },
    name:  {
      type: String,
      required: false,
    },
    typeOfCity:  {
      type: String,
      required: false,
    },
    infraIndex:  {
      type: Number,
      required: false,
    },
  },
  quantity:  {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model("ShipmentRequest", shipmentRequestSchema);