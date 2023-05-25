// Require the necessary modules
const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const selectBestHub = require("../helpers/hubSelection");
const Shipment = require("../models/shipment");
const mongoose = require("mongoose");
const statuses = require("../data/constants").statuses;
const jwt = require("jsonwebtoken");
require("dotenv/config");
const City = require("../models/cities");


// Define a route for the POST request to pass hub information
router.post("/findHub", async (req, res) => {
  // Get the hub information from the request body
  console.log("insid findHub API");
  // const hubs = req.body.hubs;
  // console.log(hubs)
  let date = new Date(req.body.date);
  let spokeIds = await Shipment.find(
    { date: { $eq: date } },
    { source: 1, destination: 1, _id: 0 }
  );
  var setSpokeIds = new Set();
  var shipmentIds = [];
  spokeIds.forEach((element) => {
    setSpokeIds.add(element.source);
    setSpokeIds.add(element.destination);
    shipmentIds.push(element._id);
  });
  
  let cities =  await City.find({});
  spokeIds = Array.from(setSpokeIds);
  console.log(spokeIds);
  let hub = selectBestHub(spokeIds, cities);
  //Updates the Shipment Hub and status in MongoDB
  Shipment.updateMany(
    { date: { $eq: date } },
    { $set: { hub: hub, status: statuses.ONGOINGTOHUB } },
    (err, result) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Result after updation ${result}`);
      }
    }
  );
  res.send(`The hub with the shortest average distance is ${hub}`);
});

function userIdfromToken(token) {
  let userId;
  jwt.verify(token, process.env.secret, (err, decoded) => {
    if (err) {
      console.error("JWT verification failed:", err);
      return;
    }
    console.log("Decoded userID", decoded.userId);
    userId = decoded.userId;
  });
  // Extract the user ID from the decoded payload
  return userId;
}

router.post("/addshipment", async (req, res) => {
  let token = req.headers["authorization"].split("Bearer ")[1];
  let userId = await userIdfromToken(token);
  console.log("User ID:", userId);
  const newShipment = new Shipment({
    userId: userId,
    source: req.body.source,
    destination: req.body.destination,
    date: new Date(req.body.date),
    shipmentType: req.body.shipmentType,
    quantity: req.body.quantity,
    status: statuses.UPCOMING,
  });

  // Save the shipment document to the database
  newShipment
    .save()
    .then((shipment) => {
      console.log("Shipment saved:", shipment);

      // Generate the shipment ID
      const shipmentId = shipment._id;
      console.log("Shipment ID:", shipmentId);

      res.status(201).json({
        error: null,
        data: {
          shipmentId: `${shipmentId}`,
          message: "Request submitted successfully",
        },
        status: 201,
      });
    })
    .catch((err) => {
      console.error("Error saving shipment:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

router.get("/shipmenthistory", async (req, res) => {
  try {
    let token = req.headers["authorization"].split("Bearer ")[1];
    let userId = await userIdfromToken(token);
    console.log("userID", userId);
    const shipmentRequests = await Shipment.find({ userId: { $eq: userId } }).sort({date: 1});
    console.log(shipmentRequests);
    res.status(200).json({ shipmentDetails: shipmentRequests });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
