require("dotenv").config();
const mongoose = require("mongoose");
const axios = require("axios");
const Shop = require("../models/shopModel");
const crypto = require('crypto');

/*
exports.addPurchase = async (req, response) => {

  const { gameid, userEmail, data } = req.body;


  // Check if the user with the provided email exists

  axios

    .get(`http://localhost:3001/user/verify/${userEmail}`)

    .then((res) => {

      const { success } = res.data;

      if (success === 1) {

        axios

          .get(`http://localhost:3002/game/verify/${gameid}`)

          .then( (res) => {

            const { success } = res.data;

            if (success === 1) {

              // Find the user with the provided email

              axios

                .get(`http://localhost:3001/user/verify/${userEmail}`)

                .then( async (res) => {

                  const { success, user } = res.data;

                  if (success === 1) {

                    // Create the purchase with the game name

                    const shop = new Shop({ gameid, userEmail, data });

                    try {

                      // Save the purchase in the shop database

                      const savedShop = await shop.save();


                      // Add the purchase to the user's purchases array

                      user.compras.push({ gameid, data });
                      

                      const updatedUser = await user.save();


                      return response.status(201).json({ shop: savedShop, user: updatedUser });

                    } catch (error) {

                      console.error(error);

                      return response.status(500).send("Internal server error");

                    }

                  } else {

                    return response.status(404).send("User not found");

                  }

                })

                .catch((error) => {

                  return response.status(500).send({ error: error, message: error.message });

                });

            } else {

              return response.status(404).send("Game not found");

            }

          })

          .catch((error) => {

            return response.status(500).send({ error: error, message: error.message });

          });

      } else {

        return response.status(404).send("User not found");

      }

    })

    .catch((error) => {

      return response.status(500).send({ error: error, message: error.message });

    });

};
*/




exports.addPurchase = async (req, response) => {

  const { gameid, userEmail, data } = req.body;

  // Check if the user with the provided email exists

  try {
    const userRes = await axios.get(`http://auth-service:3001/user/verify/${userEmail}`);
    const { success } = userRes.data;

    if (success === 1) {

      const gameRes = await axios.get(`http://product-service:3002/game/verify/${gameid}`);
      const { success } = gameRes.data;

      if (success === 1) {

        // Generate a random game key
        const game_key = crypto

          .randomBytes(8)
          .toString('hex')
          .match(/.{1,4}/g)
          .join('-')
          .toUpperCase();

        // Create the purchase with the game name
        const shop = new Shop({ gameid, userEmail, data, game_key });

        try {
          await shop.save();

          order_id = req.params.id;
          // Call the auth service to add the orderid to the user

          //await axios.post(`http://localhost:3001/user/addOrderId`, { userEmail, order_id});
          
          
          return response.status(201).json(shop);

        } catch (error) {
          console.error(error);
          return response.status(500).send("Internal server error");
        }

      } else {

        return response.status(404).send("Game not found");
      }

    } else {
      return response.status(404).send("User not found");
    }
  } catch (error) {
    return response.status(500).send({ error: error, message: error.message });
  }
};


//get a purchase 
exports.getPurchase = async (req, response) => {
  try {
    const userEmail = req.params.userEmail;

    axios
      .get(`http://auth-service:3001/user/verify/${userEmail}`)
      .then(async (res) => {
        const { success } = res.data;
        if (success === 1) {
          try {
            const shop = await Shop.find({ userEmail: userEmail });

            if (!shop) {
              return response.status(404).send({ success: 0, message: "Don't have purchases!" });
            }

            return response.status(200).json(shop);
          } catch (error) {
            console.error(error);
            return response.status(500).send("Internal server error");
          }
        } else {
          return response.status(404).send("Purchse not found");
        }
      })
      .catch((error) => {
        return response.status(500).send({ error: error, message: error.message });
      });
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal server error");
  }
};

// Function to delete an existing review
exports.deletePurchase = async (req, res) => {
  try {
    const purchaseId = req.params.purchaseId;

    const deletePurchase = await Shop.findByIdAndDelete(purchaseId);
    if (!deletePurchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }
    res.status(200).json({ message: "Purchase deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};







/*
//add a product to the wishlist
exports.addProduct = async (req, res) => {
  try {
    // Verify if the game is available
    const game = await Game.findById(gameid);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    // Verify if the user exists
    const user = await User.findById(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the game is already in the wishlist
    const existingShopItem = await Shop.findOne({ gameid, user });
    if (existingShopItem) {
      return res.status(400).json({ error: "Game is already in the wishlist" });
    }

    // Add the game to the wishlist
    const newShopItem = new Shop({
      gameid,
      userEmail,
      data: new Date(),
    });

    const savedShopItem = await newShopItem.save();
    res.status(201).json(savedShopItem);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

//delete a product to the wishlist
exports.deleteProduct = async (req, res) => {
  const { gameid, user } = req.body;

  try {
    // Remove the game from the wishlist
    const deletedShopItem = await Shop.findOneAndDelete({ gameid, user });

    if (!deletedShopItem) {
      return res.status(404).json({ error: "Game not found in the wishlist" });
    }

    res.status(200).json({ message: "Game removed from the wishlist" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

//purchase a product from the wishlist
exports.addPurchase = async (req, res) => {
  const { gameid, user } = req.body;

  try {
    // Verify if the game is available
    const game = await Game.findById(gameid);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    // Verify if the user exists
    const user = await User.findById(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the game is in the wishlist
    const existingShopItem = await Shop.findOne({ gameid, user });
    if (!existingShopItem) {
      return res.status(400).json({ error: "Game is not in the wishlist" });
    }

    // Remove the game from the wishlist
    await Shop.findOneAndDelete({ gameid, user });

    // Add the game to the user's purchased games
    user.purchasedGames.push(gameid);
    await user.save();

    res.status(201).json({ message: "Game purchased successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

//delete a purchase of product from the wishlist
exports.deletePurchase = async (req, res) => {
  const { gameid, user } = req.body;

  try {
    // Verify if the game is available
    const game = await Game.findById(gameid);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    // Verify if the user exists
    const user = await User.findById(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the game is in the user's purchased games
    const purchasedIndex = user.purchasedGames.indexOf(gameid);
    if (purchasedIndex === -1) {
      return res.status(400).json({ error: "Game is not in the purchased list" });
    }

    // Remove the game from the user's purchased games
    user.purchasedGames.splice(purchasedIndex, 1);
    await user.save();

    res.status(200).json({ message: "Purchase deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
*/
