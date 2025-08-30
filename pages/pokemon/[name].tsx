import { useRouter } from "next/router";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getPokemonByNameOrId } from "@/services/pokemon";
import type { PokemonDetails } from "@/types/pokemon";

export default function PokemonDetailsPage() {
  const router = useRouter();
  const { name, page: pageParam } = router.query;
  const page =
    typeof pageParam === "string" && Number.isFinite(parseInt(pageParam, 10))
      ? parseInt(pageParam, 10)
      : 1;

  const enabled = typeof name === "string" && name.length > 0;

  const { data, isLoading, isFetching, error } = useQuery<PokemonDetails>({
    queryKey: ["pokemon", name],
    queryFn: () => getPokemonByNameOrId(name as string),
    enabled,
    staleTime: 60_000,
  });

  const backHref = { pathname: "/", query: { page } };

  if (!enabled || isLoading) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold capitalize">{name ?? "Carregando..."}</h1>
          <Link href="/" className="text-sm text-blue-600 hover:underline">← Voltar</Link>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="animate-pulse rounded-xl border bg-white p-6">
            <div className="h-64 w-full rounded-md bg-gray-200" />
          </div>
          <div className="animate-pulse rounded-xl border bg-white p-6 space-y-3">
            <div className="h-5 w-40 bg-gray-200 rounded" />
            <div className="h-4 w-56 bg-gray-200 rounded" />
            <div className="h-4 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-64 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold capitalize">{name as string}</h1>
          <Link href="/" className="text-sm text-blue-600 hover:underline">← Voltar</Link>
        </header>
        <p className="text-red-600">Não foi possível carregar este Pokémon.</p>
      </div>
    );
  }

  const art =
    data.sprites.other?.["official-artwork"]?.front_default ?? "/placeholder.png";

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <nav className="mb-4 flex items-center justify-between" aria-label="Navegação de detalhe">
        <h1 className="text-2xl font-bold capitalize">
          {data.name}
          {isFetching && <span className="ml-2 align-middle text-sm animate-pulse text-gray-500">atualizando…</span>}
        </h1>
        <Link href={backHref} className="text-sm text-blue-600 hover:underline">← Voltar</Link>
      </nav>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 text-center">
          <img
            src={art ?? undefined}
            alt={data.name}
            className="mx-auto h-64 w-auto object-contain"
            loading="lazy"
          />
        </div>

        <div className="rounded-xl border bg-white p-6 space-y-6">
          <section>
            <h2 className="mb-2 text-lg font-semibold">Tipos</h2>
            <div className="flex flex-wrap gap-2">
              {data.types.map((t) => (
                <span
                  key={t.type.name}
                  className="rounded-full border px-3 py-1 text-sm capitalize"
                >
                  {t.type.name}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">Habilidades</h2>
            <ul className="list-disc pl-5 space-y-1">
              {data.abilities.map((ab) => (
                <li key={ab.ability.name} className="capitalize">
                  {ab.ability.name} {ab.is_hidden && <span className="text-xs text-gray-500">(hidden)</span>}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <section className="mt-6 rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Atributos</h2>
        <ul className="space-y-3">
          {data.stats.map((s) => {
            const value = s.base_stat;
            const pct = Math.min(100, Math.round((value / 255) * 100));
            return (
              <li key={s.stat.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="capitalize">{s.stat.name}</span>
                  <span className="tabular-nums">{value}</span>
                </div>
                <div className="h-2 w-full rounded bg-gray-200">
                  <div
                    className="h-2 rounded bg-green-500"
                    style={{ width: `${pct}%` }}
                    aria-valuemin={0}
                    aria-valuemax={255}
                    aria-valuenow={value}
                    role="progressbar"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
