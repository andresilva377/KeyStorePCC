require("dotenv").config();
const mongoose = require("mongoose");
const axios = require("axios");

const Review = require("../models/reviewModel");

exports.createReview = async (req, response) => {
  const { gameid, userEmail, rating, comment } = req.body;

  // Check if the user with the provided email exists
  axios
    .get(`http://auth-service:3001/user/verify/${userEmail}`)
    .then((res) => {
      const { success } = res.data;
      if (success === 1) {
        axios
          .get(`http://product-service:3002/game/verify/${gameid}`)
          .then(async (res) => {
            const { success } = res.data;
            if (success === 1) {
              // Create the review with the game name
              const review = new Review({ gameid, userEmail, rating, comment });
              try {
                await review.save();
                return response.status(201).json(review);
              } catch (error) {
                console.error(error);
                return response.status(500).send("Internal server error");
              }
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

exports.getReview = async (req, response) => {
  try {
    const gameid = req.params.gameid;

    axios
      .get(`http://product-service:3002/game/verify/${gameid}`)
      .then(async (res) => {
        const { success } = res.data;
        if (success === 1) {
          try {
            const reviews = await Review.find({ gameid: gameid });

            if (!reviews) {
              return response.status(404).send({ success: 0, message: "Don't have reviews!" });
            }

            return response.status(200).json(reviews);
          } catch (error) {
            console.error(error);
            return response.status(500).send("Internal server error");
          }
        } else {
          return response.status(404).send("Game not found");
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

// Function to edit an existing review
exports.editReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const { rating, comment } = req.body;

    // Check if the review with the provided ID exists
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      {
        rating,
        comment,
      },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).send("Review not found");
    }

    res.status(200).json({ msg: "Review Updated with success!" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

// Function to delete an existing review
exports.deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;

    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

