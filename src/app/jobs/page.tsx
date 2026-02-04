import { JobList } from "./job-list";
import LinkNext from "next/link";
import { ArrowLeft } from "lucide-react";
import { headers } from "next/headers";
import type { Job } from "@/types/job";

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

function getBaseUrl() {
  const headersList = headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? "http";

  if (!host) {
    return "http://localhost:3000";
  }

  return `${protocol}://${host}`;
}

export default async function JobsPage({ searchParams }: PageProps) {
  // 1. Fetch all data from the API with cache support
  const response = await fetch(`${getBaseUrl()}/api/jobs`, {
    next: {
      revalidate: 86400,
      tags: ["jobs"],
    },
  });
  if (!response.ok) {
    console.error(`Failed to fetch jobs API: ${response.status}`);
  }

  const allJobs: Job[] = response.ok ? await response.json() : [];

  // 2. Parse Search Params
  const params = await searchParams;
  const search = typeof params?.search === 'string' ? params.search : "";
  const labelsParam = typeof params?.labels === 'string' ? params.labels : "";
  const hiddenReposParam = typeof params?.hiddenRepos === 'string' ? params.hiddenRepos : "";
  const showDuplicates = params?.showDuplicates === 'true';

  const selectedLabels = labelsParam ? labelsParam.split(",") : [];
  const hiddenRepos = hiddenReposParam ? hiddenReposParam.split(",") : [];

  // 3. Filter Jobs on Server
  const filteredJobs = allJobs.filter(job => {
    // 1. Duplicate Filter (Primary)
    // If we don't want to show duplicates, filter out any job that has duplicateInfo
    if (!showDuplicates && job.duplicateInfo) return false;

    // 2. Repo Visibility Filter
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
      <header className="px-3 sm:px-6 py-3 sm:py-4 border-b flex items-center gap-3 sm:gap-4 bg-background/80 backdrop-blur-md z-50 sticky top-0">
        <LinkNext href="/" className="text-muted-foreground hover:text-foreground transition-colors p-2 -ml-2 rounded-md" aria-label="Go back to home page">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </LinkNext>
        <h1 className="text-lg sm:text-xl font-bold">Latest Jobs</h1>
      </header>
      
      <main className="flex-1 container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8 lg:py-8">
          <JobList 
            jobs={filteredJobs} 
            allJobs={allJobs}
            initialFilters={{
              search,
              labels: selectedLabels,
              hiddenRepos,
              showDuplicates
            }}
          />
      </main>
    </div>
  );
}
