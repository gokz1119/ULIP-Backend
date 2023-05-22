// Require the necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const selectBestHub = require('../helpers/hubSelection');
const Shipment = require("../models/shipment");

// Define a route for the POST request to pass hub information
router.post('/findHub', async (req, res) => {
  // Get the hub information from the request body
  console.log("insiddddddd")
  const hubs = req.body.hubs;
  console.log(hubs)
  let hub = await selectBestHub(hubs)
  res.send(`The hub with the shortest average distance is ${hub}`);
});

router.post('/addshipment', async (req, res) => {

  const newShipment = new Shipment({
    source: req.body.source,
    destination:req.body.destination,
    date: new Date(req.body.date),
    shipmentType: req.body.shipmentType,
    quantity: req.body.quantity
  });

  // Save the shipment document to the database
  newShipment.save()
    .then((shipment) => {
      console.log('Shipment saved:', shipment);

      // Generate the shipment ID
      const shipmentId = shipment._id;
      console.log('Shipment ID:', shipmentId);

      res.status(201).json({
        error: null,
			data: {
				shipmentId: `${shipmentId}`,
				message: "Request submitted successfully"
			},
			status: 201

      })
    })
    .catch((err) => {
      console.error('Error saving shipment:', err);
    });

});

module.exports =router;

