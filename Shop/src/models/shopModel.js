const mongoose = require("mongoose");

const Shop = mongoose.model("Shop", {
  gameid: String,
  userEmail: String,
  data: Date,
  game_key: String,
});

module.exports = Shop;
