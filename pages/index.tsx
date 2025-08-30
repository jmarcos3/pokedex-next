import { useMemo, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  getPokemons,
  getPokemonByName,
} from "@/services/pokemon";
import { getPokemonIdFromUrl, getPokemonImageUrl } from "@/lib/pokeapi";
import type { PokemonListItem, PokemonListResponse } from "@/types/pokemon";

export default function Home() {
  const router = useRouter();

  const [nameQuery, setNameQuery] = useState("");
  const [notFound, setNotFound] = useState(false);

  const { mutateAsync: searchPokemon, isPending: isSearching } = useMutation({
    mutationFn: (name: string) => getPokemonByName(name),
  });

  async function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNotFound(false);
    const q = nameQuery.trim();
    if (!q) return;

    const result = await searchPokemon(q);
    if (result && result.name) {
      const currentPage =
        typeof router.query.page === "string" ? router.query.page : "1";
      router.push(
        { pathname: `/pokemon/${result.name}`, query: { page: currentPage } },
        undefined,
        { shallow: true }
      );
    } else {
      setNotFound(true);
    }
  }

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
      <header className="mb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold">Pokédex</h1>

          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <input
              value={nameQuery}
              onChange={(e) => setNameQuery(e.target.value)}
              placeholder="Buscar por nome exato (ex: pikachu)"
              className="w-72 rounded-md border border-gray-300 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Buscar pokémon por nome"
            />
            <button
              type="submit"
              disabled={isSearching || !nameQuery.trim()}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50 hover:bg-gray-50"
            >
              {isSearching ? "Buscando..." : "Buscar"}
            </button>
          </form>
        </div>

        {notFound && (
          <p className="mt-2 text-sm text-red-600">Pokémon não encontrado. Verifique se digitou o nome corretamente</p>
        )}
      </header>

      <nav className="mb-4 flex items-center justify-between" aria-label="Paginação">
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handlePrev}
            disabled={!canPrev}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50 hover:bg-gray-50"
            aria-label="Página anterior"
          >
            ‹ Anterior
          </button>
          <span aria-live="polite" className="min-w-[160px] text-sm text-gray-600 text-center">
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
