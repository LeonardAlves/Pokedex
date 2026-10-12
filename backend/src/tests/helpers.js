const mongoose = require("mongoose");
const Pokemon = require("../models/Pokemon");

// Cenário fixo usado nos testes de leitura
const samplePokemons = [
    { number: 1, name: "bulbasaur", types: ["grass", "poison"], height: 7, weight: 69 },
    { number: 4, name: "charmander", types: ["fire"], height: 6, weight: 85 },
    { number: 6, name: "charizard", types: ["fire", "flying"], height: 17, weight: 905 },
    { number: 7, name: "squirtle", types: ["water"], height: 5, weight: 90 },
    { number: 25, name: "pikachu", types: ["electric"], height: 4, weight: 60, favorite: true }
];

// Apaga tudo da coleção. Só roda se o banco for o de teste.
async function clearPokemons() {
    const dbName = mongoose.connection.name;

    if (dbName !== "pokedex_test") {
        throw new Error(
            `Recusando apagar dados: o banco conectado é "${dbName}", não "pokedex_test".`
        );
    }

    await Pokemon.deleteMany({});
}

// Limpa e insere o cenário padrão
async function seedPokemons() {
    await clearPokemons();
    return Pokemon.insertMany(samplePokemons);
}

module.exports = { samplePokemons, clearPokemons, seedPokemons };