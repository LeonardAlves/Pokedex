import "./SearchBar.css";

function SearchBar({ value, onChange }) {
  return (
    <input
      className="search-bar"
      type="search"
      placeholder="🔍 Buscar Pokémon..."
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label="Buscar Pokémon"
    />
  );
}

export default SearchBar;