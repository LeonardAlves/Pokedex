import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import PokemonDetails from "./pages/PokemonDetails";

function App() {
  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: 16 }}>
      <h1>
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          Pokédex
        </Link>
      </h1>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemon/:id" element={<PokemonDetails />} />
        <Route path="*" element={<p>Página não encontrada.</p>} />
      </Routes>
    </main>
  );
}

export default App;