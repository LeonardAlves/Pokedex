const express = require("express");

const pokemonRoutes = require("./routes/pokemonRoutes");
const errorHandler = require("./middlewares/errorHandler");
const AppError = require("./errors/AppError");

const app = express();

app.use(express.json());

app.use("/pokemon", pokemonRoutes);

// NOVO: se nenhuma rota respondeu, cai aqui
app.use((req, res, next) => {
    next(new AppError("Route not found", 404));
});

// Sempre por último: precisa vir depois das rotas e do 404
app.use(errorHandler);

module.exports = app;