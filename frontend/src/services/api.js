const API_URL = import.meta.env.VITE_API_URL;

export async function getPokemons(params = {}) {
  // Monta a query string: { page: 1, type: "fire" } vira "page=1&type=fire"
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value);
    }
  });

  const response = await fetch(`${API_URL}/pokemon?${query.toString()}`);

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Erro ao buscar Pokémon");
  }

  return response.json();
}