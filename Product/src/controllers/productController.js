// Imports
require("dotenv").config();
const mongoose = require("mongoose");

// Models
const Game = require("../models/productModel");

// Create a game
exports.createGame = async (req, res) => {
  const { title, price, genre, stock, ram, cpuModel, gpuModel, ostype } = req.body;

  // Validations
  if (!title) {
    return res.status(422).json({ msg: "Title is mandatory!" });
  }
  if (!price) {
    return res.status(422).json({ msg: "Price is mandatory!" });
  }
  if (!genre) {
    return res.status(422).json({ msg: "Genre is mandatory!" });
  }
  if (!stock) {
    stock = 0;
  }
  if (!ram) {
    return res.status(422).json({ msg: "Ram is mandatory!" });
  }
  if (!cpuModel) {
    return res.status(422).json({ msg: "Cpu Model is mandatory!" });
  }
  if (!gpuModel) {
    return res.status(422).json({ msg: "Gpu Model is mandatory!" });
  }
  if (!ostype) {
    return res.status(422).json({ msg: "OS Type is mandatory!" });
  }

  // Check if Game already exists
  const gameExist = await Game.findOne({ title: title });

  if (gameExist) {
    return res.status(422).json({ msg: "The game already exist" });
  }

  const game = new Game({
    title,
    price,
    genre,
    stock,
    ram,
    cpuModel,
    gpuModel,
    ostype,
  });
  try {
    await game.save();
    res.status(201).json({ msg: "Game created with success!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getGame = async (req, res) => {
  try {
    const gameId = req.params.id;
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }
    res.status(200).json(game);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getGames = async (req, res) => {
  try {
    const games = await Game.find();
    if (!games) {
      return res.status(404).json({ message: "No Results" });
    }
    res.status(200).json(games);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.editgame = async (req, res) => {
  try {
    const gameId = req.params.id;
    const { title, price, genre, stock, ram, cpuModel, gpuModel, ostype } = req.body;

    const updatedGame = await Game.findByIdAndUpdate(
      gameId,
      {
        title,
        price,
        genre,
        stock,
        ram,
        cpuModel,
        gpuModel,
        ostype,
      },
      { new: true }
    );

    if (!updatedGame) {
      return res.status(404).json({ message: "Game not found" });
    }

    res.status(200).json({ msg: "Game Updated with success!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteGame = async (req, res) => {
  try {
    const gameId = req.params.id;
    const deletedGame = await Game.findByIdAndDelete(gameId);
    if (!deletedGame) {
      return res.status(404).json({ message: "Game not found" });
    }
    res.status(200).json({ message: "Game deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.verifyGameById = async (req, res) => {
  try {
    // req.params
    let id = req.params.id;

    const game = await Game.findById(id);
    if (!game) {
      return res.status(404).json({ success: 0 });
    }

    // Send response
    return res.status(200).send({ success: 1 });
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};


exports.GameCompatibility = async (req, res) => {

  const { ram } = req.body;

  try {
    let id = req.params.id;
    const game = await Game.findById(id);

    if (ram >= game.ram) {
      
      res.status(200).json({ message: "Recomended specs for a good gameplay." });
    } else {
      
      res.status(200).json({ message: "Not recomended specs for this game." });
    }

  } catch (error) {
    res.status(500).json({ message: "Error comparing game compatibility." });
  }

};