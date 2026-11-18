const express = require("express");
const typeController = require("../controllers/TypeController");

const router = express.Router();

router.get("/", (req, res, next) => typeController.list(req, res, next));

module.exports = router;