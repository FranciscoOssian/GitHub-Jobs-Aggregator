// Removed unused imports
// Removed unused import
// Native timeAgo implementation used below

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

export function JobCard({ job }: { job: Job }) {
  return (
    <div className="flex flex-col p-6 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg leading-none tracking-tight">
            <a href={job.url} target="_blank" rel="noopener noreferrer" className="hover:underline decoration-blue-500 underline-offset-4">
              {job.title}
            </a>
          </h3>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="font-medium text-foreground">{job.company}</span>
            <span>•</span>
            <span className="text-muted-foreground">{job.repository}</span>
          </p>
        </div>
        <a 
          href={job.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 gap-2"
        >
          View on GitHub <ExternalLink className="w-4 h-4" />
        </a>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2">
        {job.labels.map((label) => (
          <Badge key={label.name} colorHex={label.color}>
            {label.name}
          </Badge>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t flex items-center text-xs text-muted-foreground">
        <Calendar className="w-3.5 h-3.5 mr-1" />
        Posted {timeAgo(job.createdAt)}
      </div>
    </div>
  );
}
