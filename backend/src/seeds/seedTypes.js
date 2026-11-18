const mongoose = require("mongoose");
const Type = require("../models/Type");

const TYPES = [
  { slug: "normal", name: "Normal", color: "#A8A77A" },
  { slug: "fire", name: "Fire", color: "#EE8130" },
  { slug: "water", name: "Water", color: "#6390F0" },
  { slug: "electric", name: "Electric", color: "#F7D02C" },
  { slug: "grass", name: "Grass", color: "#7AC74C" },
  { slug: "ice", name: "Ice", color: "#96D9D6" },
  { slug: "fighting", name: "Fighting", color: "#C22E28" },
  { slug: "poison", name: "Poison", color: "#A33EA1" },
  { slug: "ground", name: "Ground", color: "#E2BF65" },
  { slug: "flying", name: "Flying", color: "#A98FF3" },
  { slug: "psychic", name: "Psychic", color: "#F95587" },
  { slug: "bug", name: "Bug", color: "#A6B91A" },
  { slug: "rock", name: "Rock", color: "#B6A136" },
  { slug: "ghost", name: "Ghost", color: "#735797" },
  { slug: "dragon", name: "Dragon", color: "#6F35FC" },
  { slug: "dark", name: "Dark", color: "#705746" },
  { slug: "steel", name: "Steel", color: "#B7B7CE" },
  { slug: "fairy", name: "Fairy", color: "#D685AD" },
];

async function seedTypes() {
  await mongoose.connect(process.env.MONGO_URI);

  const result = await Type.bulkWrite(
    TYPES.map((type) => ({
      updateOne: {
        filter: { slug: type.slug },
        update: { $setOnInsert: type },
        upsert: true,
      },
    }))
  );

  console.log(`Criados: ${result.upsertedCount} | Já existiam: ${TYPES.length - result.upsertedCount}`);
  await mongoose.disconnect();
}

seedTypes().catch((error) => {
  console.error("Erro no seed de tipos:", error);
  process.exit(1);
});