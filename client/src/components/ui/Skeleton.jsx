export const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-lg bg-white/5 ${className}`} />
);

export const CardSkeleton = () => (
  <div className="glass-card p-5 space-y-3">
    <Skeleton className="h-3 w-24" />
    <Skeleton className="h-7 w-32" />
    <Skeleton className="h-2 w-16" />
  </div>
);

export const TableRowSkeleton = () => (
  <div className="flex items-center gap-4 py-3.5 px-1">
    <Skeleton className="w-9 h-9 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-2.5 w-1/5" />
    </div>
    <Skeleton className="h-4 w-16" />
  </div>
);

export const FullPageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-base">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-2 border-mint/30 border-t-mint rounded-full animate-spin" />
      <p className="text-ink-muted text-sm">Loading FinTrack...</p>
    </div>
  </div>
);
