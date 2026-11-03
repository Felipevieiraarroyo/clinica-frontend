export function SkeletonMetricCard() {
  return (
    <article
      aria-label="Carregando indicador"
      className="animate-pulse rounded-xl bg-white p-6 shadow-md"
    >
      <div className="flex items-center justify-between">
        <div className="h-4 w-32 rounded bg-slate-200" />
        <div className="h-8 w-8 rounded-full bg-slate-200" />
      </div>

      <div className="mt-4 h-9 w-24 rounded bg-slate-200" />
      <div className="mt-3 h-4 w-40 rounded bg-slate-200" />
    </article>
  );
}
