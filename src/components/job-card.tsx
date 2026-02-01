import { memo } from "react";
import { Job } from "@/types/job";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Calendar } from "lucide-react";

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

export const JobCard = memo(function JobCard({ job }: { job: Job }) {
  return (
    <div className="flex flex-col p-4 sm:p-6 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
      {/* Header Section - Stack on mobile, row on desktop */}
      <div className="flex flex-col gap-3 sm:gap-4">
        {/* Title Section */}
        <div className="space-y-2">
          <h3 className="font-semibold text-base sm:text-lg leading-snug tracking-tight wrap-break-word">
            <a 
              href={job.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:underline decoration-blue-500 underline-offset-4"
            >
              {job.title}
            </a>
            {job.duplicateInfo && (
              <div className="relative group inline-block ml-2 align-middle">
                <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800 cursor-help transition-all hover:scale-105">
                  {(job.duplicateInfo.score * 100).toFixed(0)}% Dup
                </span>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-popover text-popover-foreground text-[11px] rounded-lg shadow-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                  <div className="font-semibold mb-1 border-b pb-1">Potential duplicate of:</div>
                  <div className="italic wrap-break-word text-muted-foreground">&ldquo;{job.duplicateInfo.originalTitle}&rdquo;</div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-8 border-transparent border-t-border"></div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-[7px] border-transparent border-t-popover z-10"></div>
                </div>
              </div>
            )}
          </h3>
          
          {/* Company and Repository - Stack on very small screens */}
          <p className="text-xs sm:text-sm text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-medium text-foreground break-all">{job.company}</span>
            <span className="hidden xs:inline">•</span>
            <span className="text-muted-foreground break-all">{job.repository}</span>
          </p>
        </div>
        
        {/* Action Button - Full width on mobile */}
        <a 
          href={job.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full sm:w-auto sm:self-start inline-flex items-center justify-center rounded-md text-xs sm:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-3 sm:px-4 py-2 gap-2 cursor-pointer whitespace-nowrap"
        >
          <span className="hidden xs:inline">View on GitHub</span>
          <span className="xs:hidden">View Job</span>
          <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
        </a>
      </div>
      
      {/* Labels Section - Better wrapping */}
      <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
        {job.labels.map((label) => (
          <Badge key={label.name} colorHex={label.color}>
            {label.name}
          </Badge>
        ))}
      </div>

      {/* Footer - Timestamp */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t flex items-center text-xs text-muted-foreground" suppressHydrationWarning>
        <Calendar className="w-3.5 h-3.5 mr-1.5 shrink-0" />
        <span className="truncate">Posted {timeAgo(job.createdAt)}</span>
      </div>
    </div>
  );
});
