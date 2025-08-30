import type { PokemonDetails } from "@/types/pokemon";

const FUN_FACT_TEMPLATES = [
  "Sabia? {name} mede cerca de {heightM} m e pesa ~{weightKg} kg.",
  "Curiosidade: o tipo principal de {name} é {type1}.",
  "{name} pode aprender habilidades como {ability1}.",
  "{name} já chega com {baseExp} de experiência base.",
];

export function buildFunFact(p: PokemonDetails, seed: number) {
  const t = FUN_FACT_TEMPLATES[seed % FUN_FACT_TEMPLATES.length];
  const heightM = (p.height / 10).toFixed(1);
  const weightKg = (p.weight / 10).toFixed(1);
  const type1 = p.types?.[0]?.type?.name ?? "desconhecido";
  const ability1 = p.abilities?.[0]?.ability?.name ?? "—";
  const baseExp = p.base_experience ?? 0;

  return t
    .replaceAll("{name}", p.name[0].toUpperCase() + p.name.slice(1))
    .replaceAll("{heightM}", heightM)
    .replaceAll("{weightKg}", weightKg)
    .replaceAll("{type1}", type1)
    .replaceAll("{ability1}", ability1)
    .replaceAll("{baseExp}", String(baseExp));
}
