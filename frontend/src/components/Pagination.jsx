import "./Pagination.css";

// Monta a lista a exibir: [1, "...", 4, 5, 6, "...", 31]
function getPageItems(page, totalPages) {
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);

  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);

  const items = [];
  sorted.forEach((p, index) => {
    // Se há um "buraco" entre dois números, coloca reticências
    if (index > 0 && p - sorted[index - 1] > 1) {
      items.push("...");
    }
    items.push(p);
  });

  return items;
}

function Pagination({ page, totalPages, onPageChange }) {
  // Com uma página só, não há o que navegar
  if (totalPages <= 1) return null;

  const items = getPageItems(page, totalPages);

  return (
    <nav className="pagination" aria-label="Paginação">
      <button
        type="button"
        className="pagination__button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        Anterior
      </button>

      {items.map((item, index) =>
        item === "..." ? (
          <span key={`gap-${index}`} className="pagination__gap">
            ...
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={`pagination__button ${item === page ? "is-active" : ""}`}
            onClick={() => onPageChange(item)}
            aria-current={item === page ? "page" : undefined}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        className="pagination__button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        Próximo
      </button>
    </nav>
  );
}

export default Pagination;