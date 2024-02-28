const mongoose = require("mongoose");

const User = mongoose.model("User", {
  username: String,
  email: String,
  password: String,
  userType: String,
  specs: { os: String, cpu: String, gpu: String, ram: Number },
  games: [{ gameId: String, name: String, key: String, saleId: String }],
});

module.exports = User;
