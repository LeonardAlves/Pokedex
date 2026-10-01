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
            // 1. Lê os parâmetros da URL (ex: ?search=char&type=fire&page=2&limit=20)
            const { search, type, favorite } = req.query;

            // 2. Lê page e limit (chegam como texto, então convertemos para número)
            //    Se não vierem ou forem inválidos, usamos os padrões: página 1, 20 por página
            const page = Math.max(parseInt(req.query.page) || 1, 1);
            const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);

            // 3. Começa com um filtro vazio, que significa "traga tudo"
            const filter = {};

            // 4. Condição de nome (igual a antes)
            if (search) {
                const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

                filter.name = { $regex: escaped, $options: "i" };
            }

            // 5. Condição de tipo (igual a antes)
            if (type) {
                filter.types = type.toLowerCase();
            }

            // 6. Condição de favorito (igual a antes)
            if (favorite === "true") {
                filter.favorite = true;
            } else if (favorite === "false") {
                filter.favorite = false;
            }

            // 7. Conta quantos Pokémon existem COM os filtros aplicados (NOVO)
            const total = await Pokemon.countDocuments(filter);

            // 8. Busca só a página pedida (NOVO: skip e limit)
            const pokemons = await Pokemon.find(filter)
                .sort({ number: 1 })
                .skip((page - 1) * limit)
                .limit(limit);

            // 9. Devolve um objeto com os dados e as informações de paginação (NOVO)
            return res.status(200).json({
                data: pokemons,
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            });
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

    async import(req, res) {

        console.log("Entrou no import");
        try {
            for (const pokemonData of req.body) {
                await Pokemon.findOneAndUpdate(
                    { number: pokemonData.number },
                    pokemonData,
                    { upsert: true, new: true }
                );
            
            }

            return res.status(201).json({
                message: "Pokemons imported successfully"
            });

        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }
}

module.exports = new PokemonController();