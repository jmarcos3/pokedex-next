import axios from "axios";

const api = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
});

export const getPokemons = async (limit = 20, offset = 0) => {
  const response = await api.get(`/pokemon?limit=${limit}&offset=${offset}`);
  return response.data as {
    count: number;
    next: string | null;
    previous: string | null;
    results: { name: string; url: string }[];
  };
};

export const getPokemonIdFromUrl = (url: string) => {
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1]; 
};

export const getPokemonImageUrl = (id: string | number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
