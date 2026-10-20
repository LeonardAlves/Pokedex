import PokemonCard from "./PokemonCard";
import "./PokemonList.css";

function PokemonList({ pokemons, onToggleFavorite }) {
  if (pokemons.length === 0) {
    return <p>Nenhum Pokémon encontrado.</p>;
  }

  return (
    <section className="pokemon-list">
      {pokemons.map((pokemon) => (
        <PokemonCard
          key={pokemon._id}
          pokemon={pokemon}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </section>
  );
}

export default PokemonList;