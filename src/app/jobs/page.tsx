import { Suspense } from "react";
import { fetchJobs } from "@/lib/github";
import { JobList } from "./job-list";
import LinkNext from "next/link";
import { ArrowLeft } from "lucide-react";
import { JobCardSkeleton } from "@/components/job-card-skeleton";
import type { Metadata } from "next";

export const revalidate = 86400; // 24 hours

export const metadata: Metadata = {
  title: "Browse GitHub Jobs - Aggregated Issues",
  description: "Find job opportunities aggregated from open source repositories. Filter by label, company, and more.",
};

export default async function JobsPage() {
  // Fetch data on the server
  const jobs = await fetchJobs();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-4 border-b flex items-center gap-4 bg-background/80 backdrop-blur-md z-50 sticky top-0">
        <LinkNext href="/" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </LinkNext>
        <h1 className="text-xl font-bold">Latest Jobs</h1>
      </header>
      
      <main className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8">
        <Suspense fallback={<JobsLoadingSkeleton />}>
          <JobList jobs={jobs} />
        </Suspense>
      </main>
    </div>
  );
}

function JobsLoadingSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
       {/* Sidebar Skeleton */}
       <div className="hidden lg:block w-80 shrink-0 space-y-6">
          <div className="h-64 bg-card border rounded-xl animate-pulse" />
       </div>
       
       {/* List Skeleton */}
       <div className="flex-1 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <JobCardSkeleton key={i} />
          ))}
       </div>
    </div>
  );
}
