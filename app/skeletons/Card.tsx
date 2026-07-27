export function CardSkeleton() {
  return (
    <article className="flex animate-pulse flex-col gap-4 rounded-3xl bg-white border border-gray-100 p-4">
      <div className="overflow-hidden rounded-2xl bg-linear-to-br from-gray-100 to-gray-50">
        <div className="aspect-square w-full rounded-2xl bg-linear-to-br from-gray-200 to-gray-100" />
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 flex-1">
          <div className="h-3 w-16 rounded-full bg-linear-to-r from-gray-200 to-gray-100" />
          <div className="h-5 w-32 rounded-full bg-linear-to-r from-gray-200 to-gray-100" />
        </div>
        <div className="h-7 w-14 rounded-full bg-linear-to-r from-gray-200 to-gray-100" />
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div className="h-7 w-20 rounded-full bg-linear-to-r from-gray-200 to-gray-100" />
        <div className="h-11 w-11 rounded-full bg-linear-to-r from-gray-200 to-gray-100" />
      </div>
    </article>
  );
}
