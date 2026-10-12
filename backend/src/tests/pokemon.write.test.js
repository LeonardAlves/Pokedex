const request = require("supertest");
const app = require("../app");
const Pokemon = require("../models/Pokemon");
const { connectTestDB, disconnectTestDB } = require("./setup");
const { seedPokemons, clearPokemons } = require("./helpers");

let pokemons;

beforeAll(async () => {
    await connectTestDB();
});

beforeEach(async () => {
    pokemons = await seedPokemons();
});

afterAll(async () => {
    await clearPokemons();
    await disconnectTestDB();
});

// Atalho para achar um Pokémon do cenário pelo nome
const find = (name) => pokemons.find((p) => p.name === name);

describe("POST /pokemon", () => {

    test("cria um Pokémon válido e responde 201", async () => {
        const res = await request(app)
            .post("/pokemon")
            .send({ number: 152, name: "chikorita", types: ["grass"], height: 9, weight: 64 });

        expect(res.status).toBe(201);
        expect(res.body.name).toBe("chikorita");
        expect(res.body.favorite).toBe(false); // valor padrão

        const total = await Pokemon.countDocuments();
        expect(total).toBe(6);
    });

    test("número duplicado retorna 409", async () => {
        const res = await request(app)
            .post("/pokemon")
            .send({ number: 1, name: "outro" });

        expect(res.status).toBe(409);
        expect(res.body).toEqual({ error: "A Pokemon with this number already exists" });
    });

    test("sem nome retorna 400", async () => {
        const res = await request(app)
            .post("/pokemon")
            .send({ number: 9001 });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error");
    });

    test("tipo inválido retorna 400", async () => {
        const res = await request(app)
            .post("/pokemon")
            .send({ number: 9001, name: "teste", types: ["banana"] });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain("banana is not a valid type");
    });

    test("altura negativa retorna 400", async () => {
        const res = await request(app)
            .post("/pokemon")
            .send({ number: 9001, name: "teste", height: -5 });

        expect(res.status).toBe(400);
    });

    test("JSON malformado retorna 400", async () => {
        const res = await request(app)
            .post("/pokemon")
            .set("Content-Type", "application/json")
            .send("{ favorite: true }");

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "Invalid JSON in request body" });
    });
});

describe("PUT /pokemon/:id", () => {

    test("atualiza campos e responde 200", async () => {
        const res = await request(app)
            .put(`/pokemon/${find("squirtle")._id}`)
            .send({ weight: 100 });

        expect(res.status).toBe(200);
        expect(res.body.weight).toBe(100);
        expect(res.body.name).toBe("squirtle"); // o resto não mudou
    });

    test("tipo inválido retorna 400 e não salva", async () => {
        const id = find("squirtle")._id;
        const res = await request(app)
            .put(`/pokemon/${id}`)
            .send({ types: ["banana"] });

        expect(res.status).toBe(400);

        const noBanco = await Pokemon.findById(id);
        expect(noBanco.types).toEqual(["water"]);
    });

    test("número já usado por outro Pokémon retorna 409", async () => {
        const res = await request(app)
            .put(`/pokemon/${find("squirtle")._id}`)
            .send({ number: 1 });

        expect(res.status).toBe(409);
    });

    test("id inexistente retorna 404", async () => {
        const res = await request(app)
            .put("/pokemon/000000000000000000000000")
            .send({ weight: 1 });

        expect(res.status).toBe(404);
    });

    test("id inválido retorna 400", async () => {
        const res = await request(app)
            .put("/pokemon/abc")
            .send({ weight: 1 });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "Invalid id" });
    });
});

describe("PATCH /pokemon/:id/favorite", () => {

    test("favorita um Pokémon que não era favorito", async () => {
        const res = await request(app).patch(`/pokemon/${find("squirtle")._id}/favorite`);

        expect(res.status).toBe(200);
        expect(res.body.favorite).toBe(true);
    });

    test("desfavorita um Pokémon que já era favorito", async () => {
        const res = await request(app).patch(`/pokemon/${find("pikachu")._id}/favorite`);

        expect(res.status).toBe(200);
        expect(res.body.favorite).toBe(false);
    });

    test("duas chamadas seguidas voltam ao valor original", async () => {
        const id = find("squirtle")._id;

        await request(app).patch(`/pokemon/${id}/favorite`);
        const res = await request(app).patch(`/pokemon/${id}/favorite`);

        expect(res.body.favorite).toBe(false);
    });

    test("id inexistente retorna 404", async () => {
        const res = await request(app).patch("/pokemon/000000000000000000000000/favorite");

        expect(res.status).toBe(404);
    });

    test("id inválido retorna 400", async () => {
        const res = await request(app).patch("/pokemon/abc/favorite");

        expect(res.status).toBe(400);
    });
});

describe("DELETE /pokemon/:id", () => {

    test("remove o Pokémon e responde 200", async () => {
        const id = find("squirtle")._id;
        const res = await request(app).delete(`/pokemon/${id}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: "Pokemon deleted successfully" });

        const noBanco = await Pokemon.findById(id);
        expect(noBanco).toBeNull();
    });

    test("id inexistente retorna 404", async () => {
        const res = await request(app).delete("/pokemon/000000000000000000000000");

        expect(res.status).toBe(404);
    });

    test("id inválido retorna 400", async () => {
        const res = await request(app).delete("/pokemon/abc");

        expect(res.status).toBe(400);
    });
});

describe("POST /pokemon/import", () => {

    test("cria os Pokémon novos e atualiza os existentes", async () => {
        const res = await request(app)
            .post("/pokemon/import")
            .send([
                { number: 1, name: "bulbasaur", types: ["grass", "poison"], height: 8, weight: 69, favorite: false },
                { number: 152, name: "chikorita", types: ["grass"], height: 9, weight: 64, favorite: false }
            ]);

        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Pokemons imported successfully");
        expect(res.body.created).toBe(1);
        expect(res.body.updated).toBe(1);

        const total = await Pokemon.countDocuments();
        expect(total).toBe(6);
    });

    test("reimportar NÃO apaga favoritos", async () => {
        // O Pikachu do cenário é favorito; o n8n enviaria favorite: false
        await request(app)
            .post("/pokemon/import")
            .send([
                { number: 25, name: "pikachu", types: ["electric"], height: 4, weight: 60, favorite: false }
            ]);

        const pikachu = await Pokemon.findById(find("pikachu")._id);
        expect(pikachu.favorite).toBe(true);
    });

    test("Pokémon novo nasce com favorite false", async () => {
        await request(app)
            .post("/pokemon/import")
            .send([
                { number: 152, name: "chikorita", types: ["grass"], favorite: true }
            ]);

        const novo = await Pokemon.findOne({ number: 152 });
        expect(novo.favorite).toBe(false);
    });

    test("body que não é lista retorna 400", async () => {
        const res = await request(app)
            .post("/pokemon/import")
            .send({ nome: "isto não é uma lista" });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "Body must be a non-empty array of pokemons" });
    });

    test("lista vazia retorna 400", async () => {
        const res = await request(app)
            .post("/pokemon/import")
            .send([]);

        expect(res.status).toBe(400);
    });
});