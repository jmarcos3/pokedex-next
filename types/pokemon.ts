export type PokemonListItem = { name: string; url: string };

export type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
};

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
  height: number;
  weight: number;
  base_experience: number | null;

  sprites: {
    other?: {
      ["official-artwork"]?: { front_default: string | null };
    };
  };
  types: PokemonType[];
  abilities: PokemonAbility[];
  stats: PokemonStat[];
};

export type AiAugmentation = {
  ai_quote: string;
  ai_fun_fact: string;
  ai_battle_tip: string;
};

export type PokemonDetailsResponse = PokemonDetails & AiAugmentation;