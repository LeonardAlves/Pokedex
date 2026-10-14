import "./PokemonCard.css";

function PokemonCard({ pokemon }) {
  // Deixa o número com 3 dígitos: 1 vira "#001"
  const formattedNumber = `#${String(pokemon.number).padStart(3, "0")}`;

  return (
    <article className="pokemon-card">
      <span className="pokemon-card__number">{formattedNumber}</span>

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
    </article>
  );
}

export default PokemonCard;