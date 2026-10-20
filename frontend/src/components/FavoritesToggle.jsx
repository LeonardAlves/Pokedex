import "./FavoritesToggle.css";

function FavoritesToggle({ active, onToggle }) {
  return (
    <button
      type="button"
      className={`favorites-toggle ${active ? "is-active" : ""}`}
      onClick={onToggle}
      aria-pressed={active}
    >
      {active ? "❤️ Meus favoritos" : "🤍 Meus favoritos"}
    </button>
  );
}

export default FavoritesToggle;