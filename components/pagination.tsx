type PaginationProps = {
  page: number;
  totalPages: number;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  isFetching: boolean;
  className?: string;
};

export function Pagination({
  page,
  totalPages,
  canPrev,
  canNext,
  onPrev,
  onNext,
  isFetching,
  className = "",
}: PaginationProps) {
  return (
    <nav
      className={`flex items-center justify-between ${className}`}
      aria-label="Paginação"
    >
      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={onPrev}
          disabled={!canPrev}
          title="Página anterior"
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm transition
                     hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Página anterior"
        >
          ‹ Anterior
        </button>
        <span
          aria-live="polite"
          className="min-w-[170px] text-sm text-gray-600 text-center px-2"
        >
          Página <strong>{page}</strong> de <strong>{totalPages}</strong>
          {isFetching && (
            <span className="ml-1 animate-pulse text-gray-500">atualizando…</span>
          )}
        </span>
        <button
          onClick={onNext}
          disabled={!canNext}
          title="Próxima página"
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm transition
                     hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Próxima página"
        >
          Próxima ›
        </button>
      </div>
    </nav>
  );
}
