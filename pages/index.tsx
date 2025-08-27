import { useQuery } from "@tanstack/react-query";
import { getPokemons, getPokemonIdFromUrl, getPokemonImageUrl } from "../services/pokemon";

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["pokemons", 20, 0],
    queryFn: () => getPokemons(20, 0),
  });

  if (isLoading) {
    return <p className="p-6 text-sm text-gray-600">Carregando...</p>;
  }

  if (error || !data) {
    return <p className="p-6 text-sm text-red-600">Erro ao carregar pokémons</p>;
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Pokédex</h1>

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {data.results.map((p) => {
          const id = getPokemonIdFromUrl(p.url);
          const img = getPokemonImageUrl(id);

          return (
            <li
              key={p.name}
              className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <img
                src={img}
                alt={p.name}
                loading="lazy"
                className="mx-auto mb-2 h-24 w-24 object-contain"
              />
              <p className="font-medium capitalize">{p.name}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
