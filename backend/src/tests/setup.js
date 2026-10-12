const mongoose = require("mongoose");

// Troca o nome do banco: pokedex -> pokedex_test
// Segurança: se a URI não terminar em pokedex..., o teste se recusa a rodar
function getTestUri() {
    const uri = process.env.MONGO_URI;

    if (!uri || !uri.includes("/pokedex?")) {
        throw new Error(
            "MONGO_URI inesperada. Por segurança, os testes não vão rodar."
        );
    }

    return uri.replace("/pokedex?", "/pokedex_test?");
}

async function connectTestDB() {
    await mongoose.connect(getTestUri());
}

async function disconnectTestDB() {
    await mongoose.disconnect();
}

module.exports = { connectTestDB, disconnectTestDB };