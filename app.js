const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");
const CitySchema = require("./models/cities");

app.use(cors());
app.options("*", cors());

//middleware

app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use(errorHandler);

//Routes
const usersRoutes = require("./routes/users");
const selectBestHub = require("./helpers/hubSelection");
// const hubRoutes = require('./routes/shortesthub');

const api = process.env.API_URL;

app.use(`${api}/users`, usersRoutes);
// app.use(`${api}/hubs`, hubRoutes);

//Database
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "ulip",
  })
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

// async function getBestHub() {
//   try {
//     const cities = [
//       {
//         _id: 0,
//         name: "Mumbai",
//         latitude: 19.07283,
//         longitude: 72.88261,
//         typeOfCity: "hub",
//         infraIndex: 80,
//       },
//       {
//         _id: 1,
//         name: "New Delhi",
//         latitude: 28.65195,
//         longitude: 77.23149,
//         typeOfCity: "hub",
//         infraIndex: 70,
//       },
//       {
//         _id: 2,
//         name: "Bengaluru",
//         latitude: 12.97194,
//         longitude: 77.59369,
//         typeOfCity: "hub",
//         infraIndex: 70,
//       },
//       {
//         _id: 3,
//         name: "Chennai",
//         latitude: 13.08784,
//         longitude: 80.27847,
//         typeOfCity: "spoke",
//       },
//       {
//         _id: 4,
//         name: "Ahemedabad",
//         latitude: 23.02579,
//         longitude: 72.5872,
//         typeOfCity: "spoke",
//       },
//       {
//         _id: 5,
//         name: "Hyderabad",
//         latitude: 17.38405,
//         longitude: 78.45636,
//         typeOfCity: "spoke",
//       },
//       {
//         _id: 6,
//         name: "Pune",
//         latitude: 18.51957,
//         longitude: 73.85535,
//         typeOfCity: "spoke",
//       },
//       {
//         _id: 7,
//         name: "Surat",
//         latitude: 21.19594,
//         longitude: 72.83023,
//         typeOfCity: "hub",
//         infraIndex: 50,
//       },
//       {
//         _id: 8,
//         name: "Kanpur",
//         latitude: 26.46523,
//         longitude: 80.34975,
//         typeOfCity: "spoke",
//       },
//       {
//         _id: 9,
//         name: "Jaipur",
//         latitude: 26.91962,
//         longitude: 75.78781,
//         typeOfCity: "spoke",
//       },
//       {
//         _id: 10,
//         name: "Lucknow",
//         latitude: 26.83928,
//         longitude: 80.92313,
//         typeOfCity: "spoke",
//       },
//       {
//         _id: 11,
//         name: "Kolkata",
//         latitude: 22.56263,
//         longitude: 88.36304,
//         typeOfCity: "hub",
//         infraIndex: 75,
//       },
//       {
//         _id: 12,
//         name: "Indore",
//         latitude: 22.71792,
//         longitude: 75.8333,
//         typeOfCity: "hub",
//         infraIndex: 40,
//       },
//       {
//         _id: 13,
//         name: "Kochi",
//         latitude: 9.9312,
//         longitude: 76.2673,
//         typeOfCity: "spoke",
//       },
//     ];
//     const spokeIds = [0, 2, 3, 5, 6, 13];
//     var bestHub = selectBestHub(spokeIds, cities);
//     console.log(bestHub);
//   } catch (err) {
//     throw err;
//   }
// }

// getBestHub();

//Server
app.listen(3000, () => {
  console.log("Server is running http://localhost:3000");
});
