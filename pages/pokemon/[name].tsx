import { useRouter } from "next/router";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getPokemonByNameOrId } from "@/services/pokemon";
import type { PokemonDetailsResponse } from "@/types/pokemon";
import { formatHeight, formatWeight } from "@/lib/formatters";

export default function PokemonDetailsPage() {
  const router = useRouter();
  const { name, page: pageParam } = router.query;
  const page =
    typeof pageParam === "string" && Number.isFinite(parseInt(pageParam, 10))
      ? parseInt(pageParam, 10)
      : 1;

  const enabled = typeof name === "string" && name.length > 0;

  const { data, isLoading, isFetching, error } = useQuery<PokemonDetailsResponse>({
    queryKey: ["pokemon", name],
    queryFn: () => getPokemonByNameOrId(name as string),
    enabled,
    staleTime: 60_000,
  });

  const backHref = { pathname: "/", query: { page } };

  if (!enabled || isLoading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(40%_30%_at_50%_0%,#e0f2fe_0%,transparent_60%),linear-gradient(#fff, #f9fafb)]">
        <div className="p-6 max-w-3xl mx-auto">
          <header className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold capitalize">{name ?? "Carregando..."}</h1>
            <Link href="/" className="rounded-lg border bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm hover:bg-gray-50">
              ← Voltar
            </Link>
          </header>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6">
              <div className="h-64 w-full rounded-md bg-gray-100" />
            </div>
            <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 space-y-3">
              <div className="h-5 w-40 bg-gray-100 rounded" />
              <div className="h-4 w-56 bg-gray-100 rounded" />
              <div className="h-4 w-48 bg-gray-100 rounded" />
              <div className="h-4 w-64 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[radial-gradient(40%_30%_at_50%_0%,#e0f2fe_0%,transparent_60%),linear-gradient(#fff, #f9fafb)]">
        <div className="p-6 max-w-3xl mx-auto">
          <header className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold capitalize">{(name as string) ?? "Pokémon"}</h1>
            <Link href="/" className="rounded-lg border bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm hover:bg-gray-50">
              ← Voltar
            </Link>
          </header>
          <p className="text-red-600">Não foi possível carregar este Pokémon.</p>
        </div>
      </div>
    );
  }

  const art =
    data.sprites.other?.["official-artwork"]?.front_default ?? "/placeholder.png";

  const idBadge = `#${String(data.id).padStart(3, "0")}`;

  return (
    <div className="min-h-screen bg-[radial-gradient(40%_30%_at_50%_0%,#e0f2fe_0%,transparent_60%),linear-gradient(#fff, #f9fafb)]">
      <div className="p-6 max-w-3xl mx-auto">
        <nav className="mb-4 flex items-center justify-between" aria-label="Navegação de detalhe">
          <h1 className="text-2xl font-extrabold capitalize tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-indigo-600">
            {data.name}
            {isFetching && (
              <span className="ml-2 align-middle text-sm animate-pulse text-gray-500">atualizando…</span>
            )}
          </h1>
          <Link
            href={backHref}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            ← Voltar
          </Link>
        </nav>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <span className="absolute left-4 top-4 rounded-full bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-600 ring-1 ring-gray-200">
              {idBadge}
            </span>
            <img
              src={art ?? undefined}
              alt={data.name}
              className="mx-auto h-64 w-auto object-contain"
              loading="lazy"
            />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
            <section>
              <h2 className="mb-2 text-lg font-semibold">Tipos</h2>
              <div className="flex flex-wrap gap-2">
                {data.types.map((t) => (
                  <span
                    key={t.type.name}
                    className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm capitalize text-gray-700"
                  >
                    {t.type.name}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold">Habilidades</h2>
              <ul className="space-y-1">
                {data.abilities.map((ab) => (
                  <li key={ab.ability.name} className="capitalize text-gray-800">
                    {ab.ability.name}{" "}
                    {ab.is_hidden && (
                      <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 ring-1 ring-gray-200">
                        hidden
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            <section className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-sky-50 px-3 py-2 text-center ring-1 ring-sky-100">
                <p className="text-xs text-sky-700">Altura</p>
                <p className="font-semibold text-sky-900">{formatHeight(data.height)}</p>
              </div>
              <div className="rounded-xl bg-indigo-50 px-3 py-2 text-center ring-1 ring-indigo-100">
                <p className="text-xs text-indigo-700">Peso</p>
                <p className="font-semibold text-indigo-900">{formatWeight(data.weight)}</p>
              </div>
            </section>
          </div>
        </div>

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Atributos</h2>
          <ul className="space-y-3">
            {data.stats.map((s) => {
              const value = s.base_stat;
              const pct = Math.min(100, Math.round((value / 255) * 100));
              return (
                <li key={s.stat.name}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="capitalize text-gray-700">{s.stat.name}</span>
                    <span className="tabular-nums text-gray-900">{value}</span>
                  </div>
                  <div className="h-2 w-full rounded bg-gray-200">
                    <div
                      className="h-2 rounded bg-gradient-to-r from-emerald-500 to-green-500"
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

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold">Da IA</h2>

          <div>
            <h3 className="text-sm font-medium text-gray-600">Citação</h3>
            <blockquote className="mt-1 rounded-lg border-l-4 border-sky-200 bg-sky-50/40 p-3 italic text-gray-800">
              {data.ai_quote}
            </blockquote>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-600">Curiosidade</h3>
            <p className="mt-1 text-gray-800">{data.ai_fun_fact}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-600">Dica de batalha</h3>
            <p className="mt-1 text-gray-800">{data.ai_battle_tip}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
