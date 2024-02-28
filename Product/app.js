const express = require("express");
const app = express();
const requireDir = require("require-dir");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

process.setMaxListeners(0);

app.use(bodyParser.json());

mongoose
  .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.elzyrqf.mongodb.net/Product_DB`)
  .then(() => {
    console.log("Connected to Database!");
  })
  .catch((err) => console.log(err));

const routes = requireDir("./src/routes");
for (let i in routes) app.use("/", routes[i]);

module.exports = app;
