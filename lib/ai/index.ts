import type { AiAugmentation, PokemonDetails } from "@/types/pokemon";
import { QUOTES, capitalize, hashString, pickDeterministic } from "./quotes";
import { buildFunFact } from "./fun_facts";
import { BATTLE_TIPS } from "./battle_tips";

export function buildAiAugmentation(p: PokemonDetails): AiAugmentation {
  const seed = hashString(p.name || String(p.id || ""));

  const ai_quote = pickDeterministic(QUOTES, seed).replaceAll("{name}", capitalize(p.name));
  const ai_fun_fact = buildFunFact(p, seed);

  const type1 = p.types?.[0]?.type?.name ?? "default";
  const ai_battle_tip =
    (BATTLE_TIPS[type1] ?? BATTLE_TIPS.default).replace("{name}", capitalize(p.name));
    
  return { ai_quote, ai_fun_fact, ai_battle_tip };

}
