const mongoose = require("mongoose");
const Pokemon = require("../models/Pokemon");
const AppError = require("../errors/AppError");

class PokemonController {

    async create(req, res, next) {
        try {
            const pokemon = await Pokemon.create(req.body);
            return res.status(201).json(pokemon);
        } catch (error) {
            next(error);
        }
    }

    async index(req, res, next) {
        try {
            const { search, type, favorite } = req.query;

            const page = Math.max(parseInt(req.query.page) || 1, 1);
            const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);

            const filter = {};

            if (search) {
                const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                filter.name = { $regex: escaped, $options: "i" };
            }

            if (type) {
                filter.types = type.toLowerCase();
            }

            if (favorite === "true") {
                filter.favorite = true;
            } else if (favorite === "false") {
                filter.favorite = false;
            }

            const total = await Pokemon.countDocuments(filter);

            const pokemons = await Pokemon.find(filter)
                .sort({ number: 1 })
                .skip((page - 1) * limit)
                .limit(limit);

            return res.status(200).json({
                data: pokemons,
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            });
        } catch (error) {
            next(error);
        }
    }

    async show(req, res, next) {
        try {
            const { id } = req.params;

            if (!mongoose.isValidObjectId(id)) {
                throw new AppError("Invalid id", 400);
            }

            const pokemon = await Pokemon.findById(id);
            if (!pokemon) {
                throw new AppError("Pokemon not found", 404);
            }

            return res.status(200).json(pokemon);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;

            if (!mongoose.isValidObjectId(id)) {
                throw new AppError("Invalid id", 400);
            }

            const pokemon = await Pokemon.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });   // <-- ESTA LINHA
            if (!pokemon) {
                throw new AppError("Pokemon not found", 404);
            }

            return res.status(200).json(pokemon);
        } catch (error) {
            next(error);
        }
    }

    async toggleFavorite(req, res, next) {
        try {
            const { id } = req.params;

            if (!mongoose.isValidObjectId(id)) {
                throw new AppError("Invalid id", 400);
            }

            const pokemon = await Pokemon.findById(id);
            if (!pokemon) {
                throw new AppError("Pokemon not found", 404);
            }

            pokemon.favorite = !pokemon.favorite;
            await pokemon.save();

            return res.status(200).json(pokemon);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;

            if (!mongoose.isValidObjectId(id)) {
                throw new AppError("Invalid id", 400);
            }

            const pokemon = await Pokemon.findByIdAndDelete(id);
            if (!pokemon) {
                throw new AppError("Pokemon not found", 404);
            }

            return res.status(200).json({
                message: "Pokemon deleted successfully"
            });
        } catch (error) {
            next(error);
        }
    }

    async import(req, res, next) {

        console.log("Entrou no import");
        try {
            if (!Array.isArray(req.body) || req.body.length === 0) {
                throw new AppError("Body must be a non-empty array of pokemons", 400);
            }

                        const operations = req.body.map((pokemonData) => {
                // Separa o "favorite" dos demais campos
                const { favorite, ...fields } = pokemonData;

                return {
                    updateOne: {
                        filter: { number: pokemonData.number },
                        update: {
                            // Sempre atualiza os dados vindos da PokeAPI
                            $set: fields,
                            // "favorite" só é definido quando o Pokémon é CRIADO
                            $setOnInsert: { favorite: false }
                        },
                        upsert: true
                    }
                };
            });

            const result = await Pokemon.bulkWrite(operations);

            return res.status(201).json({
                message: "Pokemons imported successfully",
                created: result.upsertedCount,
                updated: result.modifiedCount
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PokemonController();