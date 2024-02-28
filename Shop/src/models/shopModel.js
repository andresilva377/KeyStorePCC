const mongoose = require("mongoose");

const Shop = mongoose.model("Shop", {
  gameId: String,
  userId: String,
  amount: Number,
  saleDate: Date,
});

module.exports = Shop;
