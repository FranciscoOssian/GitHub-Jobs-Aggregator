import { fetchJobs } from "@/lib/github";
import { JobList } from "./job-list";
import LinkNext from "next/link";
import { ArrowLeft } from "lucide-react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse GitHub Jobs - Aggregated Issues",
  description: "Find job opportunities aggregated from open source repositories. Filter by label, company, and more.",
};

// Helper to normalize strings for comparison
const normalize = (s: string) => s.toLowerCase().trim();

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function JobsPage({ searchParams }: PageProps) {
  // 1. Fetch all data on the server
  const allJobs = await fetchJobs();

  // 2. Parse Search Params
  const params = await searchParams;
  const search = typeof params?.search === 'string' ? params.search : "";
  const labelsParam = typeof params?.labels === 'string' ? params.labels : "";
  const hiddenReposParam = typeof params?.hiddenRepos === 'string' ? params.hiddenRepos : "";

  const selectedLabels = labelsParam ? labelsParam.split(",") : [];
  const hiddenRepos = hiddenReposParam ? hiddenReposParam.split(",") : [];

  // 3. Filter Jobs on Server
  const filteredJobs = allJobs.filter(job => {
    // Repo Visibility Filter
    if (hiddenRepos.includes(job.repository)) return false;

    // Default to true
    let matchesSearch = true;
    let matchesLabels = true;

    // Search Filter
    if (search) {
      const q = normalize(search);
      matchesSearch = normalize(job.title).includes(q) || 
                      normalize(job.repository).includes(q) ||
                      normalize(job.company).includes(q);
    }

    // Label Filter (OR logic)
    if (selectedLabels.length > 0) {
      matchesLabels = job.labels.some(l => selectedLabels.includes(l.name));
    }

    return matchesSearch && matchesLabels;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-4 border-b flex items-center gap-4 bg-background/80 backdrop-blur-md z-50 sticky top-0">
        <LinkNext href="/" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </LinkNext>
        <h1 className="text-xl font-bold">Latest Jobs</h1>
      </header>
      
      <main className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8">
          <JobList 
            jobs={filteredJobs} 
            allJobs={allJobs}
            initialFilters={{
              search,
              labels: selectedLabels,
              hiddenRepos
            }}
          />
      </main>
    </div>
  );
}
