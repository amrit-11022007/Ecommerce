export function CardSkeleton() {
  return (
    <article className="neu-card flex animate-pulse flex-col gap-4 p-5">
      <div className="neu-inset">
        <div className="aspect-square w-full rounded-xl bg-slate-300" />
      </div>

      <div className="flex items-start justify-between gap-2">
        <div className="space-y-2">
          <div className="h-3 w-20 rounded bg-slate-300" />
          <div className="h-6 w-36 rounded bg-slate-300" />
        </div>

        <div className="h-7 w-12 rounded bg-slate-300" />
      </div>

      <div className="flex items-center justify-between">
        <div className="h-6 w-24 rounded bg-slate-300" />
        <div className="h-11 w-11 rounded-full bg-slate-300" />
      </div>
    </article>
  );
}
