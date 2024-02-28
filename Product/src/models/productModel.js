const mongoose = require("mongoose");

const Game = mongoose.model("Game", {
  name: String,
  price: Number,
  category: String,
  specs: [{ os: String, cpu: String, gpu: String, ram: Number }],
  stock: Number,
});

module.exports = Game;
