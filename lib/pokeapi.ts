import axios from "axios";

export const pokeApi = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
  timeout: 10_000,
});

export const getPokemonIdFromUrl = (url: string) => {
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1];
};

export const getPokemonImageUrl = (id: string | number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
