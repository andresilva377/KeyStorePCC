// Imports
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Models
const User = require("../models/userModel");
const { response } = require("../../app");

// Login logic
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validations
  if (!email) {
    return res.status(422).json({ msg: "Email is mandatory!" });
  }

  if (!password) {
    return res.status(422).json({ msg: "Password is mandatory!" });
  }

  // Check if user exists
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ msg: "Invalid email!" });
  }

  // Check if password match
  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(422).json({ msg: "Invalid password!" });
  }

  try {
    const secret = process.env.SECRET;

    const token = jwt.sign(
      {
        id: user._id,
      },
      secret,
      { expiresIn: "5m" }
    );

    return res.status(200).json({ msg: "Authentication completed successfully!", token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Error on the Server! Try agian later!" });
  }
};

// Register logic
exports.register = async (req, res) => {
  const { username, email, password, confirmpassword, userType, specs } = req.body;

  // Validations
  if (!username) {
    return res.status(422).json({ msg: "Username is mandatory!" });
  }

  if (!email) {
    return res.status(422).json({ msg: "Email is mandatory!" });
  }

  if (!password) {
    return res.status(422).json({ msg: "Password is mandatory!" });
  }

  if (password !== confirmpassword) {
    return res.status(422).json({ msg: "Passwords don't match!" });
  }

  if (!/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email)) {
    return res.status(422).json({ msg: "Invalid Email!" });
  }

  // Check if user exists
  const userExist = await User.findOne({ email: email });

  if (userExist) {
    return res.status(422).json({ msg: "Email already in use. Please user another email!" });
  }

  // Verify password
  if (password.length < 8) {
    return res.status(422).json({ msg: "Password is to short!" });
  } else if (!/[A-Z]/.test(password)) {
    return res.status(422).json({ msg: "Password must have a upper case character!" });
  } else if (!/[0-9]/.test(password)) {
    return res.status(422).json({ msg: "Password must have a number!" });
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return res.status(422).json({ msg: "Password must have a special character!" });
  }

  if (userType !== "client" && userType !== "admin") {
    return res.status(422).json({ msg: "Invalid User Type!" });
  }

  const games = [];

  // Create password
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  // create user
  const user = new User({
    username,
    email,
    password: passwordHash,
    userType,
    specs,
    games,
  });

  try {
    await user.save();

    return res.status(201).json({ msg: "User created with success!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Error on the Server! Try agian later!" });
  }
};

exports.getUser = async (req, res) => {
  try {
    // req.params
    let id = req.params.id;

    // Check if user exists
    const user = await User.findById(id, "-password");

    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }

    const { __v, ...newUser } = user.toObject();

    // Send response
    return res.status(200).send(newUser);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(404).json({ message: "No Results" });
    }

    const modifiedUsers = users.map((user) => {
      const { password, __v, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword;
    });

    res.status(200).json(modifiedUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.verifyUserByEmail = async (req, res) => {
  try {
    // req.params
    let email = req.params.email;

    // Check if user exists
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).send({ success: 0 });
    }

    // Send response
    return res.status(200).send({ success: 1 });
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.addGame = async (req, res) => {
  const { userId, gameId, name, key, saleId } = req.body;

  const user = await User.findOne({ _id: userId });

  if (!user) {
    return res.status(422).json({ msg: "User not found!" });
  }

  const newGame = {
    gameId: gameId,
    name: name,
    key: key,
    saleId: saleId,
  };

  try {
    user.games.push(newGame);
    user.save();

    return res.status(201).json({ msg: "Game added with success!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Error on the Server! Try agian later!" });
  }
};
