const express = require("express");

const router = express.Router();

const pokemonController = require("../controllers/pokemonController");

router.post("/", pokemonController.create);

router.get("/", pokemonController.index);

router.get("/:id", pokemonController.show);

router.put("/:id", pokemonController.update);

router.delete("/:id", pokemonController.delete);

module.exports = router;
