import { POKEMON_TYPES } from "../constants/types";
import "./TypeFilter.css";

function TypeFilter({ selected, onSelect }) {
  return (
    <nav className="type-filter" aria-label="Filtrar por tipo">
      {/* Botão "Todos": tipo vazio = sem filtro */}
      <button
        type="button"
        className={`type-filter__button ${selected === "" ? "is-active" : ""}`}
        onClick={() => onSelect("")}
      >
        Todos
      </button>

      {POKEMON_TYPES.map((type) => (
        <button
          key={type}
          type="button"
          className={`type-filter__button ${selected === type ? "is-active" : ""}`}
          onClick={() => onSelect(type)}
        >
          {type}
        </button>
      ))}
    </nav>
  );
}

export default TypeFilter;