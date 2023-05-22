const mongoose = require('mongoose');

// Define a schema for the shipment collection
const shipmentRequestSchema = new mongoose.Schema({
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
  quantity:  {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model("ShipmentRequest", shipmentRequestSchema);