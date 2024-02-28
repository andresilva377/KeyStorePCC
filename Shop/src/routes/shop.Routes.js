const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shopController");

router.post("/shop/add", shopController.addSale);
router.get("/shop/sales", shopController.getSales);
router.get("/shop/sale/:id", shopController.getSale);

module.exports = router;
