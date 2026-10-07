const mongoose = require("mongoose");

// Lista dos 18 tipos oficiais de Pokémon
const VALID_TYPES = [
    "normal", "fire", "water", "electric", "grass", "ice",
    "fighting", "poison", "ground", "flying", "psychic", "bug",
    "rock", "ghost", "dragon", "dark", "steel", "fairy"
];

const pokemonSchema = new mongoose.Schema({

    number: {
        type: Number,
        required: true,
        unique: true,
        min: 1
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    types: [{
        type: String,
        enum: {
            values: VALID_TYPES,
            message: "{VALUE} is not a valid type"
        }
    }],

    image: {
        type: String
    },

    height: {
        type: Number,
        min: 0
    },

    weight: {
        type: Number,
        min: 0
    },

    favorite: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Pokemon", pokemonSchema);