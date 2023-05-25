const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");


app.use(cors());
app.options("*", cors());

//middleware

app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use(errorHandler);

//Routes
const usersRoutes = require("./routes/users");
const citiesRoutes = require("./routes/cities");
// const selectBestHub = require("./helpers/hubSelection");
const hubRoutes = require('./routes/shortesthub');
const adminRoutes = require('./routes/admin');

const api = process.env.API_URL;

app.use(`${api}/users`, usersRoutes);
app.use(`${api}/cities`,citiesRoutes);
app.use(`${api}/hubs`, hubRoutes);
app.use(`${api}/admin` ,adminRoutes);

//Database
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.DB_NAME,
  })
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });


//Server
app.listen(3000, () => {
  console.log("Server is running http://localhost:3000");
});
