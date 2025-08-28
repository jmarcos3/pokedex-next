import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  getPokemons,
  getPokemonIdFromUrl,
  getPokemonImageUrl,
  type PokemonListItem,
  type PokemonListResponse,
} from "../services/pokemon";

export default function Home() {
  const router = useRouter();

  const limit = 20; 
  const pageFromQuery =
    typeof router.query.page === "string" ? parseInt(router.query.page, 10) : 1;
  const page = Number.isFinite(pageFromQuery) && pageFromQuery > 0 ? pageFromQuery : 1;

  const offset = useMemo(() => (page - 1) * limit, [page, limit]);

  const { data, isLoading, isFetching, error } = useQuery<PokemonListResponse>({
    queryKey: ["pokemons", limit, offset],
    queryFn: () => getPokemons(limit, offset),
    placeholderData: (prev) => prev, 
    staleTime: 30_000,
  });

  if (isLoading) return <p className="p-6 text-sm text-gray-600">Carregando...</p>;
  if (error || !data) return <p className="p-6 text-sm text-red-600">Erro ao carregar pokémons</p>;

  const totalPages = Math.ceil(data.count / limit);
  const canPrev = page > 1;
  const canNext = Boolean(data.next);

  const goToPage = (p: number) =>
    router.push({ pathname: "/", query: { page: p } }, undefined, { shallow: true });

  const handlePrev = () => canPrev && goToPage(page - 1);
  const handleNext = () => canNext && goToPage(page + 1);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <nav className="mb-4 flex items-center justify-between" aria-label="Paginação">
        <h1 className="text-3xl font-bold">Pokédex</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={!canPrev}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50 hover:bg-gray-50"
            aria-label="Página anterior"
          >
            ‹ Anterior
          </button>
          <span aria-live="polite" className="min-w-[140px] text-sm text-gray-600 text-center">
            Página {page} de {totalPages}
            {isFetching && <span className="ml-1 animate-pulse"> atualizando…</span>}
          </span>
          <button
            onClick={handleNext}
            disabled={!canNext}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50 hover:bg-gray-50"
            aria-label="Próxima página"
          >
            Próxima ›
          </button>
        </div>
      </nav>

      <ul aria-busy={isFetching} className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {data.results.map((p: PokemonListItem) => {
          const id = getPokemonIdFromUrl(p.url);
          const img = getPokemonImageUrl(id);
          return (
            <li
              key={p.name}
              className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <Link href={{ pathname: `/pokemon/${p.name}`, query: { page } }} className="block">
                <img
                  src={img}
                  alt={p.name}
                  width={96}
                  height={96}
                  loading="lazy"
                  className="mx-auto mb-2 h-24 w-24 object-contain"
                />
                <p className="font-medium capitalize">{p.name}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
