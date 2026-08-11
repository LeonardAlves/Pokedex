async function seed() {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/25");

    const pokemon = await response.json();

    const pokemonData = {
        number: pokemon.id,
        name: pokemon.name,
        types: pokemon.types.map(type => type.type.name),
        image: pokemon.sprites.front_default,
        height: pokemon.height,
        weight: pokemon.weight,
        favorite: false
    };

    console.log(pokemonData);

    }

seed();