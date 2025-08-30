import type { NextApiRequest, NextApiResponse } from "next";
import { pokeApi } from "@/lib/pokeapi";
import type { PokemonDetails } from "@/types/pokemon";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method Not Allowed" });

  const { name_or_id } = req.query;
  if (!name_or_id || Array.isArray(name_or_id)) {
    return res.status(400).json({ message: "Parâmetro inválido" });
  }

  try {
    const { data } = await pokeApi.get<PokemonDetails>(`/pokemon/${name_or_id.toString().toLowerCase()}`);

    res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=600");

    return res.status(200).json(data);
  } catch (err: any) {
    const status = err?.response?.status ?? 500;

    if (status === 404) return res.status(404).json({ message: "Pokémon não encontrado" });
    return res.status(500).json({ message: "Erro ao obter Pokémon" });
  }
}
