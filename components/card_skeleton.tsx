export function CardSkeleton() {
  return (
    <li className="rounded-2xl border border-gray-200/70 bg-white p-4 text-center shadow-sm">
      <div className="mx-auto mb-2 h-24 w-24 rounded-xl bg-gray-100 animate-pulse" />
      <div className="mx-auto h-3 w-24 rounded bg-gray-100 animate-pulse" />
    </li>
  );
}