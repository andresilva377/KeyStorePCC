const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shopController");


// Route to add Purchase
router.post("/shop/add", shopController.addPurchase);

//Route to get a purchase by id
router.get("/shop/:userEmail", shopController.getPurchase);

// Route to delete an existing purchase
router.delete("/shop/delete/:purchaseId", shopController.deletePurchase);

module.exports = router;
