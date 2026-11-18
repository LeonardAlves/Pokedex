import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TYPE_COLORS } from "../constants/types";
import TypeBadge from "../components/TypeBadge";
import { getPokemonById, toggleFavorite } from "../services/api";
import "./PokemonDetails.css";

function PokemonDetails() {
  const { id } = useParams();

    const navigate = useNavigate();
  const location = useLocation();

  function handleBack() {
    // "default" = a página foi aberta direto (F5 ou link), sem histórico dentro do app
    if (location.key !== "default") {
      navigate(-1);
    } else {
      navigate("/");
    }
  }

  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    setLoading(true);
    setError(null);

    getPokemonById(id)
      .then((data) => {
        if (!ignore) setPokemon(data);
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
  }, [id]);

    async function handleToggleFavorite() {
    try {
      const updated = await toggleFavorite(pokemon._id);
      setPokemon(updated);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="details">
            <button type="button" className="details__back" onClick={handleBack}>
        ← Voltar
      </button>

      {loading && <p>Carregando...</p>}
      {error && <p>Erro: {error}</p>}

      {pokemon && !loading && (
          <article
          className="details__card"
          style={{ "--type-color": TYPE_COLORS[pokemon.types[0]] || "#ddd" }}
        >
          <span className="details__number">
            #{String(pokemon.number).padStart(3, "0")}
          </span>

          <h2 className="details__name">{pokemon.name}</h2>

          <img
            className="details__image"
            src={pokemon.image}
            alt={pokemon.name}
          />

          <div className="details__types">
            {pokemon.types.map((type) => (
              <TypeBadge key={type} type={type} />
            ))}
          </div>

          <dl className="details__stats">
            <div>
              <dt>Altura</dt>
              <dd>{pokemon.height / 10} m</dd>
            </div>
            <div>
              <dt>Peso</dt>
              <dd>{pokemon.weight / 10} kg</dd>
            </div>
                        <div>
              <dt>Favorito</dt>
              <dd>
                <button
                  type="button"
                  className="details__favorite"
                  onClick={handleToggleFavorite}
                >
                  {pokemon.favorite ? "❤️ Desfavoritar" : "🤍 Favoritar"}
                </button>
              </dd>
            </div>
          </dl>
        </article>
      )}
    </section>
  );
}

export default PokemonDetails;