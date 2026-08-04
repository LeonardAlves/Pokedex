const mongoose = require("mongoose");

const pokemonSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true
    },

    types: [{
        type: String
    }],

    image: {
        type: String
    },

    height: {
        type: Number
    },

    weight: {
        type: Number
    },

    favorite: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Pokemon", pokemonSchema);