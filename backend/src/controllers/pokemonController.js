const Pokemon = require("../models/Pokemon");

class PokemonController {

    async create(req, res) {
        try {
            const pokemon = await Pokemon.create(req.body);
            return res.status(201).json(pokemon);

        } catch (error) {
            return res.status(400).json({
                 error: error.message 
                });
        }
    }

    async index(req, res) {
        try {
            const pokemons = await Pokemon.find();
            return res.status(200).json(pokemons);
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    async show(req, res) {
        try {
            const { id } = req.params;
            const pokemon = await Pokemon.findById(id);
            if (!pokemon) {
                return res.status(404).json({
                    error: "Pokemon not found"
                });
            }
            return res.status(200).json(pokemon);
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const pokemon = await Pokemon.findByIdAndUpdate(id, req.body, { new: true });
            if (!pokemon) {
                return res.status(404).json({
                    error: "Pokemon not found"
                });
            }
            return res.status(200).json(pokemon);
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
        const pokemon = await Pokemon.findByIdAndDelete(id);
            if (!pokemon) {
                return res.status(404).json({
                    error: "Pokemon not found"
                });
            }
            return res.status(200).json({
                message: "Pokemon deleted successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }
        
}

module.exports = new PokemonController();