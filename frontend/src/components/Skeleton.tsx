// Skeleton placeholders shown while data (or a lazy page chunk) is loading.

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-surface-container-high rounded-lg ${className}`} />;
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 flex flex-col gap-3">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </>
  );
}

export function ListRowsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-center gap-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-3">
          <Skeleton className="w-10 h-10 rounded-full shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="w-16 h-8" />
        </div>
      ))}
    </div>
  );
}

export function StatCardsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 flex flex-col gap-3">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      ))}
    </>
  );
}

// Suspense fallback while a lazy route chunk is being fetched.
export function PageSkeleton() {
  return (
    <div className="bg-background min-h-screen w-full p-6 md:p-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-10 w-32 hidden md:block" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCardsSkeleton count={4} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CardGridSkeleton count={3} />
        </div>
      </div>
    </div>
  );
}
