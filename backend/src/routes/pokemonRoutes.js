const express = require("express");

const router = express.Router();

const pokemonController = require("../controllers/pokemonController");

router.post("/", pokemonController.create);

router.get("/", pokemonController.index);

router.get("/:id", pokemonController.show);

module.exports = router;
