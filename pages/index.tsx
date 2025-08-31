import { useMemo, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { getPokemons, getPokemonByName } from "@/services/pokemon";
import { getPokemonIdFromUrl, getPokemonImageUrl } from "@/lib/pokeapi";
import type { PokemonListItem, PokemonListResponse } from "@/types/pokemon";
import { CardSkeleton } from "@/components/card_skeleton";
import { Pagination } from "@/components/pagination";

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

    const result = await searchPokemon(q.toLowerCase());
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

  if (error) {
    return (
      <p className="p-6 text-sm text-red-600">
        Erro ao carregar pokémons
      </p>
    );
  }

  const totalPages = data ? Math.ceil(data.count / limit) : 1;
  const canPrev = page > 1;
  const canNext = Boolean(data?.next);

  const goToPage = (p: number) =>
    router.push({ pathname: "/", query: { page: p } }, undefined, { shallow: true });

  const handlePrev = () => canPrev && goToPage(page - 1);
  const handleNext = () => canNext && goToPage(page + 1);

  return (
    <div className="min-h-screen bg-[radial-gradient(40%_30%_at_50%_0%,#e0f2fe_0%,transparent_60%),linear-gradient(#fff, #f9fafb)]">
      <div className="p-6 max-w-6xl mx-auto">
        <header className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-indigo-600">
                Pokédex
              </h1>
              <span className="inline-flex items-center rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700 ring-1 ring-inset ring-sky-200">
                Beta
              </span>
            </div>

            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className={`relative`}>
                <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                  🔎
                </span>
                <input
                  value={nameQuery}
                  onChange={(e) => setNameQuery(e.target.value)}
                  placeholder="Buscar por nome exato (ex: pikachu)"
                  className={`w-80 rounded-lg border px-9 py-2 text-sm outline-none transition-shadow
                    ${notFound ? "border-red-300 ring-2 ring-red-100" : "border-gray-300 focus:ring-2 focus:ring-sky-200"}
                  `}
                  aria-label="Buscar pokémon por nome"
                  aria-invalid={notFound || undefined}
                />
              </div>
              <button
                type="submit"
                disabled={isSearching || !nameQuery.trim()}
                className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-[transform,box-shadow,background-color]
                           hover:bg-sky-700 hover:shadow-md active:translate-y-[1px]
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? "Buscando..." : "Buscar"}
              </button>
            </form>
          </div>

          {notFound && (
            <p className="mt-2 text-sm text-red-600">
              Pokémon não encontrado. Verifique se digitou o nome corretamente.
            </p>
          )}
        </header>

        <Pagination
          page={page}
          totalPages={totalPages}
          canPrev={canPrev}
          canNext={canNext}
          onPrev={handlePrev}
          onNext={handleNext}
          isFetching={isFetching}
          className="mb-5"
        />

        <ul
          aria-busy={isFetching}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        >
          {isLoading && Array.from({ length: 10 }).map((_, i) => <CardSkeleton key={i} />)}

          {data?.results.map((p: PokemonListItem) => {
            const id = getPokemonIdFromUrl(p.url);
            const img = getPokemonImageUrl(id);
            return (
              <li
                key={p.name}
                className="group rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm
                           transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <Link href={{ pathname: `/pokemon/${p.name}`, query: { page } }} className="block">
                  <img
                    src={img}
                    alt={p.name}
                    width={96}
                    height={96}
                    loading="lazy"
                    className="mx-auto mb-3 h-24 w-24 object-contain transition-transform group-hover:scale-[1.03]"
                  />
                  <p className="font-semibold capitalize tracking-wide text-gray-800">
                    {p.name}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>

        <Pagination
          page={page}
          totalPages={totalPages}
          canPrev={canPrev}
          canNext={canNext}
          onPrev={handlePrev}
          onNext={handleNext}
          isFetching={isFetching}
          className="mt-6 mb-5 block sm:hidden"
        />

      </div>
    </div>
  );
}
