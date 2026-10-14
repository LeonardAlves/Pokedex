const express = require("express");
const cors = require("cors");

const pokemonRoutes = require("./routes/pokemonRoutes");
const errorHandler = require("./middlewares/errorHandler");
const AppError = require("./errors/AppError");

const app = express();

// Só aceita requisições do navegador vindas do frontend configurado
app.use(cors({ origin: process.env.CORS_ORIGIN }));

app.use(express.json());

app.use("/pokemon", pokemonRoutes);

// NOVO: se nenhuma rota respondeu, cai aqui
app.use((req, res, next) => {
    next(new AppError("Route not found", 404));
});

// Sempre por último: precisa vir depois das rotas e do 404
app.use(errorHandler);

module.exports = app;