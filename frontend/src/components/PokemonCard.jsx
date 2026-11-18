import { Link } from "react-router-dom";
import { TYPE_COLORS } from "../constants/types";
import TypeBadge from "./TypeBadge";
import "./PokemonCard.css";

function PokemonCard({ pokemon, onToggleFavorite }) {
  const formattedNumber = `#${String(pokemon.number).padStart(3, "0")}`;

  // A cor do primeiro tipo define a borda superior do card
  const mainColor = TYPE_COLORS[pokemon.types[0]] || "#ddd";

  function handleFavoriteClick(event) {
    event.preventDefault();
    event.stopPropagation();
    onToggleFavorite(pokemon._id);
  }

  return (
    <Link
      className="pokemon-card"
      to={`/pokemon/${pokemon._id}`}
      style={{ "--type-color": mainColor }}
    >
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
          <TypeBadge key={type} type={type} />
        ))}
      </div>
    </Link>
  );
}

export default PokemonCard;