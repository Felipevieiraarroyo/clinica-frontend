export function SkeletonCita() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <div className="h-5 w-40 rounded bg-slate-200" />
          <div className="h-4 w-52 rounded bg-slate-200" />
          <div className="h-4 w-36 rounded bg-slate-200" />
        </div>

        <div className="h-7 w-28 rounded-full bg-slate-200" />
      </div>
    </div>
  );
}
