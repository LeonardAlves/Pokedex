const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const { connectTestDB, disconnectTestDB } = require("./setup");

beforeAll(async () => {
    await connectTestDB();
});

afterAll(async () => {
    await disconnectTestDB();
});

test("GET /pokemon retorna 200 e o formato paginado", async () => {
    const response = await request(app).get("/pokemon");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body).toHaveProperty("total");
    expect(Array.isArray(response.body.data)).toBe(true);
});

test("rota inexistente retorna 404 em JSON", async () => {
    const response = await request(app).get("/qualquercoisa");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Route not found" });
});