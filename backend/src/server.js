require("dotenv").config();

const connectDB = require("./database");
const app = require("./app");

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});