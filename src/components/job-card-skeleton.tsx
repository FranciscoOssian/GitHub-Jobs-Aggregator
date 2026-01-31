export function JobCardSkeleton() {
  return (
    <div className="flex flex-col p-6 rounded-xl border bg-card text-card-foreground shadow-sm animate-pulse">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-2 w-full">
          {/* Title Skeleton */}
          <div className="h-6 bg-muted rounded w-3/4 max-w-md" />
          
          {/* Metadata Skeleton */}
          <div className="flex items-center gap-2 pt-1">
            <div className="h-4 bg-muted rounded w-24" />
            <span className="text-muted-foreground">•</span>
            <div className="h-4 bg-muted rounded w-32" />
          </div>
        </div>
        
        {/* Button Skeleton */}
        <div className="h-9 w-32 bg-muted rounded shrink-0" />
      </div>
      
      {/* Labels Skeleton */}
      <div className="mt-4 flex flex-wrap gap-2">
        <div className="h-5 w-16 bg-muted rounded-full" />
        <div className="h-5 w-20 bg-muted rounded-full" />
        <div className="h-5 w-12 bg-muted rounded-full opacity-60" />
      </div>

      {/* Date Skeleton */}
      <div className="mt-4 pt-4 border-t flex items-center">
         <div className="h-3 w-24 bg-muted rounded" />
      </div>
    </div>
  );
}
