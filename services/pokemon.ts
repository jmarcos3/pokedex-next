import axios from "axios";

export type PokemonListItem = { name: string; url: string };

export type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
};

const api = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
});

export const getPokemons = async (limit = 20, offset = 0): Promise<PokemonListResponse> => {
  const response = await api.get<PokemonListResponse>(`/pokemon?limit=${limit}&offset=${offset}`);
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


export type PokemonType = {
  slot: number;
  type: { name: string; url: string };
};

export type PokemonAbility = {
  is_hidden: boolean;
  slot: number;
  ability: { name: string; url: string };
};

export type PokemonStat = {
  base_stat: number;
  effort: number;
  stat: { name: string; url: string };
};

export type PokemonDetails = {
  id: number;
  name: string;
  sprites: {
    other?: {
      ["official-artwork"]?: { front_default: string | null };
    };
  };
  types: PokemonType[];
  abilities: PokemonAbility[];
  stats: PokemonStat[];
};

export const getPokemonByNameOrId = async ( nameOrId: string | number ): Promise<PokemonDetails> => 
  {
  const { data } = await api.get<PokemonDetails>(`/pokemon/${nameOrId}`);
  return data;
};