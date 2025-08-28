import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  getPokemons,
  getPokemonIdFromUrl,
  getPokemonImageUrl,
  PokemonListResponse,
  PokemonListItem,
} from "../services/pokemon";

export default function Home() {
  const [limit] = useState(20);
  const [offset, setOffset] = useState(0);

  const { data, isLoading, isFetching, error } = useQuery<PokemonListResponse>({
    queryKey: ["pokemons", limit, offset],
    queryFn: () => getPokemons(limit, offset),
    placeholderData: keepPreviousData, 
    staleTime: 30_000, 
  });

  if (isLoading) {
    return <p className="p-6 text-sm text-gray-600">Carregando...</p>;
  }
  if (error || !data) {
    return <p className="p-6 text-sm text-red-600">Erro ao carregar pokémons</p>;
  }

  const page = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(data.count / limit);
  const canPrev = offset > 0;
  const canNext = Boolean(data.next); 

  const handlePrev = () => setOffset((prev) => Math.max(0, prev - limit));
  const handleNext = () => setOffset((prev) => prev + limit);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <nav className="mb-4 flex items-center justify-between" aria-label="Paginação">
        <h1 className="text-3xl font-bold">Pokédex</h1>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={!canPrev}
            aria-label="Página anterior"
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50 hover:bg-gray-50"
          >
            ‹ Anterior
          </button>

          <span
            aria-live="polite"
            className="min-w-[140px] text-sm text-gray-600 text-center"
          >
            Página {page} de {totalPages}
            {isFetching && <span className="ml-1 animate-pulse"> atualizando…</span>}
          </span>

          <button
            onClick={handleNext}
            disabled={!canNext}
            aria-label="Próxima página"
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50 hover:bg-gray-50"
          >
            Próxima ›
          </button>
        </div>
      </nav>

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {isLoading || isFetching
          ? Array.from({ length: limit }).map((_, i) => (
              <li
                key={i}
                className="animate-pulse rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm"
              >
                <div className="mx-auto mb-2 h-24 w-24 rounded-md bg-gray-200" />
                <div className="h-4 w-20 mx-auto rounded bg-gray-200" />
              </li>
            ))
          : data.results.map((p: PokemonListItem) => {
              const id = getPokemonIdFromUrl(p.url);
              const img = getPokemonImageUrl(id);
              return (
                <li
                  key={p.name}
                  className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm hover:shadow-md"
                >
                  <img
                    src={img}
                    alt={p.name}
                    className="mx-auto mb-2 h-24 w-24 object-contain"
                  />
                  <p className="font-medium capitalize">{p.name}</p>
                </li>
              );
            })}
      </ul>

      <div className="mt-6 flex items-center justify-end gap-2">
        <button
          onClick={handlePrev}
          disabled={!canPrev}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50 hover:bg-gray-50"
        >
          ‹ Anterior
        </button>
        <button
          onClick={handleNext}
          disabled={!canNext}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50 hover:bg-gray-50"
        >
          Próxima ›
        </button>
      </div>
    </div>
  );
}