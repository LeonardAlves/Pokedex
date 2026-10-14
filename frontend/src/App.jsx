import { useEffect, useState } from "react";
import { getPokemons } from "./services/api";
import PokemonList from "./components/PokemonList";
import SearchBar from "./components/SearchBar";
import TypeFilter from "./components/TypeFilter";
import Pagination from "./components/Pagination";
import useDebounce from "./hooks/useDebounce";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const [type, setType] = useState("");

  // NOVO: página atual e total de páginas (vem da API)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // NOVO: ao mudar a busca, volta para a página 1
  function handleSearchChange(value) {
    setSearch(value);
    setPage(1);
  }

  // NOVO: ao mudar o tipo, volta para a página 1
  function handleTypeChange(value) {
    setType(value);
    setPage(1);
  }

  useEffect(() => {
    let ignore = false;

    setLoading(true);
    setError(null);

    getPokemons({ limit: 20, page, search: debouncedSearch, type })
      .then((data) => {
        if (!ignore) {
          setPokemons(data.data);
          setTotalPages(data.totalPages);
        }
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [debouncedSearch, type, page]);

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: 16 }}>
      <h1>Pokédex</h1>

      <SearchBar value={search} onChange={handleSearchChange} />
      <TypeFilter selected={type} onSelect={handleTypeChange} />

      {loading && <p>Carregando...</p>}
      {error && <p>Erro: {error}</p>}
      {!loading && !error && (
        <>
          <PokemonList pokemons={pokemons} />
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </main>
  );
}

export default App;