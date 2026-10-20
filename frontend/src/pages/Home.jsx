import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getPokemons, toggleFavorite } from "../services/api";
import PokemonList from "../components/PokemonList";
import SearchBar from "../components/SearchBar";
import TypeFilter from "../components/TypeFilter";
import FavoritesToggle from "../components/FavoritesToggle";
import Pagination from "../components/Pagination";
import useDebounce from "../hooks/useDebounce";

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Valores "assentados" vindos da URL (a fonte da verdade)
  const urlSearch = searchParams.get("search") || "";
  const type = searchParams.get("type") || "";
  const onlyFavorites = searchParams.get("favorite") === "true";
  const page = Math.max(parseInt(searchParams.get("page")) || 1, 1);

  // Texto do campo: responde na hora; a URL só muda após o debounce
  const [searchInput, setSearchInput] = useState(urlSearch);
  const debouncedSearch = useDebounce(searchInput, 300);

  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  // Atualiza alguns parâmetros da URL, removendo os vazios
  function updateParams(changes, options) {
    const next = new URLSearchParams(searchParams);

    Object.entries(changes).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });

    setSearchParams(next, options);
  }

  // Quando o debounce "assenta", grava a busca na URL e volta à página 1
  useEffect(() => {
    if (debouncedSearch !== urlSearch) {
      updateParams({ search: debouncedSearch, page: "" }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  function handleTypeChange(value) {
    updateParams({ type: value, page: "" });
  }

  function handleFavoritesToggle() {
    updateParams({ favorite: onlyFavorites ? "" : "true", page: "" });
  }

  function handlePageChange(value) {
    updateParams({ page: value === 1 ? "" : String(value) });
  }

  async function handleToggleFavorite(id) {
    try {
      const updated = await toggleFavorite(id);

      setPokemons((current) => {
        // Na aba de favoritos, desfavoritar tira o card da lista
        if (onlyFavorites && !updated.favorite) {
          return current.filter((p) => p._id !== updated._id);
        }
        return current.map((p) => (p._id === updated._id ? updated : p));
      });
    } catch (err) {
      setError(err.message);
    }
  }

  // Busca na API sempre que algo na URL muda
  useEffect(() => {
    let ignore = false;

    setLoading(true);
    setError(null);

    getPokemons({
      limit: 20,
      page,
      search: urlSearch,
      type,
      favorite: onlyFavorites ? "true" : "",
    })
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
  }, [urlSearch, type, onlyFavorites, page]);

  return (
    <>
      <SearchBar value={searchInput} onChange={setSearchInput} />
      <TypeFilter selected={type} onSelect={handleTypeChange} />
      <FavoritesToggle active={onlyFavorites} onToggle={handleFavoritesToggle} />

      {loading && <p>Carregando...</p>}
      {error && <p>Erro: {error}</p>}
      {!loading && !error && (
        <>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

          <PokemonList
            pokemons={pokemons}
            onToggleFavorite={handleToggleFavorite}
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </>
  );
}

export default Home;