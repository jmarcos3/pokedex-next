import type { NextApiRequest, NextApiResponse } from "next";
import { pokeApi } from "@/lib/pokeapi";
import type { PokemonListResponse } from "@/types/pokemon";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method Not Allowed" });

  try {
    const limit = Number(req.query.limit ?? 20);
    const offset = Number(req.query.offset ?? 0);

    const { data } = await pokeApi.get<PokemonListResponse>(`/pokemon?limit=${limit}&offset=${offset}`);

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");

    return res.status(200).json(data);
  } catch (err: any) {
    const status = err?.response?.status ?? 500;
    return res.status(status).json({ message: "Erro ao obter lista de Pokémon" });
  }
}
