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
  sprites: {
    other?: {
      ["official-artwork"]?: { front_default: string | null };
    };
  };
  types: PokemonType[];
  abilities: PokemonAbility[];
  stats: PokemonStat[];
};
