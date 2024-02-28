require("dotenv").config();
const mongoose = require("mongoose");
const axios = require("axios");
const Shop = require("../models/shopModel");
const crypto = require("crypto");

exports.addSale = async (req, res) => {
  try {
    const { gameId, userId } = req.body;

    const token = req.headers.authorization.split(" ")[1];

    // Define the request headers
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const userRes = await axios.get(`http://localhost:3004/http-auth/user/${userId}`, { headers });

    const user = userRes.data;

    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }

    const gameRes = await axios.get(`http://localhost:3004/http-product/game/${gameId}`);

    const game = gameRes.data;

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    const { specs, name, price, stock } = game;

    if (stock <= 0) {
      return res.status(404).json({ message: "Game with no Stock Available" });
    }

    await axios.put(`http://localhost:3004/http-product/game/reduceStock/${gameId}`);

    // Generate a random game key
    const gameKey = crypto
      .randomBytes(8)
      .toString("hex")
      .match(/.{1,4}/g)
      .join("-")
      .toUpperCase();

    const currentDate = new Date();

    const shop = new Shop({
      gameId: gameId,
      userId: userId,
      amount: price,
      saleDate: currentDate,
    });

    await shop.save();

    const actualShop = await Shop.findOne({ saleDate: currentDate });

    const { _id } = actualShop.toObject();

    const newUserGame = { userId: userId, gameId: gameId, name: name, key: gameKey, saleId: _id };

    await axios.put("http://localhost:3004/http-auth/user/addGame", newUserGame);

    return res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getSales = async (req, res) => {
  try {
    const sales = await Shop.find();
    if (!sales) {
      return res.status(404).json({ message: "No Results" });
    }
    res.status(200).json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getSale = async (req, res) => {
  try {
    const saleId = req.params.id;
    const sale = await Shop.findById(saleId);
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }
    const { __v, ...newSale } = sale.toObject();
    res.status(200).json(newSale);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
