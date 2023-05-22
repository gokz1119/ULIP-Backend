require("dotenv/config");
const express = require('express');
const router = express.Router();
const City = require("../models/cities");



// Define the GET route for /cities
router.get('/', async (req, res) => {

   console.log("inside GET Cities")
   await City.find({}, (err, cities) => {
        console.log("inside GET Cities")
      if (err) {
        console.error('Error retrieving cities:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.json(cities);
    });

});


module.exports = router;