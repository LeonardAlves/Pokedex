const request = require("supertest");
const app = require("../app");
const { connectTestDB, disconnectTestDB } = require("./setup");
const { seedPokemons, clearPokemons } = require("./helpers");

let pokemons; // guarda os Pokémon criados, para usar os _id nos testes

beforeAll(async () => {
    await connectTestDB();
});

// Antes de CADA teste: banco limpo + 5 Pokémon conhecidos
beforeEach(async () => {
    pokemons = await seedPokemons();
});

afterAll(async () => {
    await clearPokemons();
    await disconnectTestDB();
});

describe("GET /pokemon", () => {

    test("lista todos com informações de paginação", async () => {
        const res = await request(app).get("/pokemon");

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(5);
        expect(res.body.total).toBe(5);
        expect(res.body.page).toBe(1);
        expect(res.body.limit).toBe(20);
        expect(res.body.totalPages).toBe(1);
    });

    test("retorna ordenado por número", async () => {
        const res = await request(app).get("/pokemon");
        const numbers = res.body.data.map((p) => p.number);

        expect(numbers).toEqual([1, 4, 6, 7, 25]);
    });

    test("busca parcial por nome, sem diferenciar maiúsculas", async () => {
        const res = await request(app).get("/pokemon?search=CHAR");
        const names = res.body.data.map((p) => p.name);

        expect(res.status).toBe(200);
        expect(names).toEqual(["charmander", "charizard"]);
    });

    test("busca sem resultado retorna lista vazia", async () => {
        const res = await request(app).get("/pokemon?search=xyz");

        expect(res.status).toBe(200);
        expect(res.body.data).toEqual([]);
        expect(res.body.total).toBe(0);
    });

    test("filtra por tipo, inclusive Pokémon de dois tipos", async () => {
        const res = await request(app).get("/pokemon?type=fire");
        const names = res.body.data.map((p) => p.name);

        expect(names).toEqual(["charmander", "charizard"]);
        expect(res.body.total).toBe(2);
    });

    test("filtra só favoritos", async () => {
        const res = await request(app).get("/pokemon?favorite=true");

        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].name).toBe("pikachu");
    });

    test("filtra só não favoritos", async () => {
        const res = await request(app).get("/pokemon?favorite=false");

        expect(res.body.total).toBe(4);
    });

    test("combina filtros (busca + tipo)", async () => {
        const res = await request(app).get("/pokemon?search=char&type=flying");

        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].name).toBe("charizard");
    });

    test("paginação: segunda página com limit 2", async () => {
        const res = await request(app).get("/pokemon?page=2&limit=2");
        const numbers = res.body.data.map((p) => p.number);

        expect(numbers).toEqual([6, 7]);
        expect(res.body.page).toBe(2);
        expect(res.body.limit).toBe(2);
        expect(res.body.total).toBe(5);
        expect(res.body.totalPages).toBe(3);
    });

    test("página além do fim retorna lista vazia, sem erro", async () => {
        const res = await request(app).get("/pokemon?page=99");

        expect(res.status).toBe(200);
        expect(res.body.data).toEqual([]);
        expect(res.body.total).toBe(5);
    });

    test("limit acima de 100 é limitado a 100", async () => {
        const res = await request(app).get("/pokemon?limit=5000");

        expect(res.body.limit).toBe(100);
    });
});

describe("GET /pokemon/:id", () => {

    test("retorna o Pokémon quando o id existe", async () => {
        const pikachu = pokemons.find((p) => p.name === "pikachu");
        const res = await request(app).get(`/pokemon/${pikachu._id}`);

        expect(res.status).toBe(200);
        expect(res.body.name).toBe("pikachu");
        expect(res.body.number).toBe(25);
    });

    test("retorna 404 quando o id é válido mas não existe", async () => {
        const res = await request(app).get("/pokemon/000000000000000000000000");

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: "Pokemon not found" });
    });

    test("retorna 400 quando o id tem formato inválido", async () => {
        const res = await request(app).get("/pokemon/abc");

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "Invalid id" });
    });
});