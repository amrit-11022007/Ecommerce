export function CardSkeleton() {
  return (
    <article className="flex animate-pulse flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
      <div className="overflow-hidden rounded-xl border border-white/5">
        <div className="aspect-square w-full rounded-xl bg-white/10" />
      </div>

      <div className="flex items-start justify-between gap-2">
        <div className="space-y-2">
          <div className="h-3 w-20 rounded bg-white/10" />
          <div className="h-6 w-36 rounded bg-white/10" />
        </div>

        <div className="h-7 w-12 rounded-lg bg-white/10" />
      </div>

      <div className="flex items-center justify-between">
        <div className="h-6 w-24 rounded bg-white/10" />
        <div className="h-10 w-10 rounded-full bg-white/10" />
      </div>
    </article>
  );
}
