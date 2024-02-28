const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Routes for product operations
router.post("/create", productController.createGame);
router.get("/game/:id", productController.getGame);
router.get("/games", productController.getGames);
router.put("/games/edit/:id", productController.editgame);
router.delete("/games/delete/:id", productController.deleteGame);
router.get("/game/verify/:id", productController.verifyGameById);
router.post("/game/GameCompatibility/:id", productController.GameCompatibility);
router.put("/game/reduceStock/:id", productController.reduceStock);

module.exports = router;
