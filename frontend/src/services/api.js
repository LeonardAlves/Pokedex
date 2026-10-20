const API_URL = import.meta.env.VITE_API_URL;

async function request(path, options) {
  const response = await fetch(`${API_URL}${path}`, options);

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Erro ao comunicar com a API");
  }

  return response.json();
}

export function getPokemons(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value);
    }
  });

  return request(`/pokemon?${query.toString()}`);
}

export function getPokemonById(id) {
  return request(`/pokemon/${id}`);
}

// NOVO: inverte o favorito e devolve o Pokémon atualizado
export function toggleFavorite(id) {
  return request(`/pokemon/${id}/favorite`, { method: "PATCH" });
}