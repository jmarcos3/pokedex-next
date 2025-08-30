import axios from "axios";
import type {
  PokemonListResponse,
  PokemonDetails,
} from "@/types/pokemon";

export const getPokemons = async (limit = 20, offset = 0): Promise<PokemonListResponse> => {
  const { data } = await axios.get<PokemonListResponse>(`/api/pokemon?limit=${limit}&offset=${offset}`);
  return data;
};

export const getPokemonByNameOrId = async (nameOrId: string | number): Promise<PokemonDetails> => {
  const { data } = await axios.get<PokemonDetails>(`/api/pokemon/${nameOrId}`);
  return data;
};

export async function getPokemonByName(name: string) {
  const n = name.trim().toLowerCase();
  if (!n) return null;

  const res = await fetch(`/api/pokemon/${n}`);
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("Erro ao buscar Pokémon");
  }
  return res.json();
}
