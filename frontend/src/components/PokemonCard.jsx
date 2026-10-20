import { Link } from "react-router-dom";
import "./PokemonCard.css";

function PokemonCard({ pokemon, onToggleFavorite }) {
  const formattedNumber = `#${String(pokemon.number).padStart(3, "0")}`;

  function handleFavoriteClick(event) {
    // Impede que o clique no coração abra a página de detalhes
    event.preventDefault();
    event.stopPropagation();
    onToggleFavorite(pokemon._id);
  }

  return (
    <Link className="pokemon-card" to={`/pokemon/${pokemon._id}`}>
      <span className="pokemon-card__number">{formattedNumber}</span>

      <button
        type="button"
        className="pokemon-card__favorite"
        onClick={handleFavoriteClick}
        aria-label={
          pokemon.favorite ? "Desfavoritar Pokémon" : "Favoritar Pokémon"
        }
      >
        {pokemon.favorite ? "❤️" : "🤍"}
      </button>

      <img
        className="pokemon-card__image"
        src={pokemon.image}
        alt={pokemon.name}
        loading="lazy"
      />

      <h2 className="pokemon-card__name">{pokemon.name}</h2>

      <div className="pokemon-card__types">
        {pokemon.types.map((type) => (
          <span key={type} className="pokemon-card__type">
            {type}
          </span>
        ))}
      </div>
    </Link>
  );
}

export default PokemonCard;