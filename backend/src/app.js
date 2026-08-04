const express = require("express");
const pokemonRoutes = require("./routes/pokemonRoutes");

const app = express();

app.use(express.json());
app.use("/pokemon", pokemonRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "API da Pokédex funcionando!"
  });
});

module.exports = app;