"use client";

import { useMemo } from "react";
import { Job } from "@/types/job";
import { JobCard } from "@/components/job-card";
import { Search, Filter, Tag } from "lucide-react"; 
import { REPOSITORIES } from "@/config/repos";
import { useJobFilters } from "@/hooks/use-job-filters";

interface JobListProps {
  jobs: Job[];
}

export function JobList({ jobs }: JobListProps) {
  const { filters, setFilters, isInitialized } = useJobFilters([]);

  const { labelsByRepo, filteredJobs } = useMemo(() => {
    if (!isInitialized) {
      return { labelsByRepo: new Map<string, Map<string, number>>(), filteredJobs: [] };
    }

    // 1. Filter by Hidden Repositories first (Base Set of candidates)
    // We need this to determine which labels are "available" (contextual)
    const visibleJobs = jobs.filter(job => !filters.hiddenRepos.includes(job.repository));

    // 2. Calculate Available Labels Grouped by Repository
    const repoLabelMap = new Map<string, Map<string, number>>();
    
    // Initialize map for all visible repos to ensure order
    REPOSITORIES.forEach(repo => {
      const fullName = `${repo.owner}/${repo.name}`;
      if (!filters.hiddenRepos.includes(fullName)) {
        repoLabelMap.set(fullName, new Map());
      }
    });

    visibleJobs.forEach(job => {
      const repoMap = repoLabelMap.get(job.repository);
      if (repoMap) {
        job.labels.forEach((l) => {
          const count = repoMap.get(l.name) || 0;
          repoMap.set(l.name, count + 1);
        });
      }
    });

    // 3. Apply Search and Label Filters for Display
    const result = visibleJobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(filters.search.toLowerCase()) || 
                            job.repository.toLowerCase().includes(filters.search.toLowerCase());
      
      // LOGIC CHANGE: OR logic (some) instead of AND (every)
      const matchesLabels = filters.labels.length === 0 || 
                            filters.labels.some(label => job.labels.some(l => l.name === label));

      return matchesSearch && matchesLabels;
    });

    return { 
      labelsByRepo: repoLabelMap,
      filteredJobs: result 
    };
  }, [jobs, filters, isInitialized]);

  const toggleLabel = (label: string) => {
    const current = filters.labels;
    const next = current.includes(label) 
      ? current.filter(l => l !== label)
      : [...current, label];
    setFilters({ labels: next });
  };

  const toggleRepo = (repoName: string) => {
    const current = filters.hiddenRepos;
    const next = current.includes(repoName)
      ? current.filter(r => r !== repoName) // Unhide
      : [...current, repoName]; // Hide
    setFilters({ hiddenRepos: next });
  };

  // Only render when initialized to avoid hydration mismatch
  if (!isInitialized) return null;

  return (
    <div className="space-y-8">
      {/* Filters Panel */}
      <div className="bg-muted/30 p-4 sm:p-6 rounded-xl border space-y-6">
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title, repository, or company..."
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
          />
        </div>

        {/* Repositories Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Filter className="w-4 h-4" />
            <span>Visible Repositories</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {REPOSITORIES.map(repo => {
              const fullName = `${repo.owner}/${repo.name}`;
              const isHidden = filters.hiddenRepos.includes(fullName);
              return (
                <button
                  key={fullName}
                  onClick={() => toggleRepo(fullName)}
                  className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-all shadow-sm ${
                    !isHidden
                      ? "border-transparent bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md"
                      : "border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground opacity-60"
                  }`}
                  aria-pressed={!isHidden}
                >
                  <span className={`w-2 h-2 rounded-full ${!isHidden ? "bg-green-400" : "bg-zinc-300"}`} />
                  {fullName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Labels Grouped by Repository */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Tag className="w-4 h-4" />
              <span>Filter by Label (Match Any)</span>
            </div>
            {filters.labels.length > 0 && (
              <button 
                onClick={() => setFilters({ labels: [] })}
                className="text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors"
              >
                Clear labels
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto pr-2">
            {Array.from(labelsByRepo.entries()).map(([repoName, labels]) => {
              if (labels.size === 0) return null; // Don't show empty groups
              
              return (
                <div key={repoName} className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 pb-1 border-b">
                     {repoName}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from(labels.entries()).sort().map(([label, count]) => (
                       <button
                        key={`${repoName}-${label}`}
                        onClick={() => toggleLabel(label)}
                        className={`inline-flex items-center rounded-sm px-2 py-1 text-[11px] font-medium transition-colors border ${
                          filters.labels.includes(label)
                            ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-700 shadow-sm"
                            : "border-transparent bg-secondary/50 text-secondary-foreground hover:bg-secondary hover:text-foreground"
                        }`}
                        title={`${label} (${count} jobs)`}
                      >
                        {label}
                        <span className="ml-[3px] opacity-50 font-normal">
                          {count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          {Array.from(labelsByRepo.values()).every(m => m.size === 0) && (
             <p className="text-sm text-muted-foreground italic">No labels available from visible repositories.</p>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between pb-2 border-b">
        <h2 className="text-lg font-semibold tracking-tight">
          Job Listings
          <span className="ml-2 inline-flex items-center justify-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {filteredJobs.length}
          </span>
        </h2>
        {(filters.search || filters.labels.length > 0 || filters.hiddenRepos.length > 0) && (
            <button
                onClick={() => setFilters({ search: "", labels: [], hiddenRepos: [] })}
                className="text-sm font-medium text-destructive hover:text-destructive/80 transition-colors"
            >
                Reset All Filters
            </button>
        )}
      </div>

      {/* Job Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-xl bg-muted/10">
            <Search className="w-10 h-10 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No jobs found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-6">
              We couldn&apos;t find any jobs matching your current filters. Try adjusting your search keywords or labels.
            </p>
            <button
                onClick={() => setFilters({ search: "", labels: [], hiddenRepos: [] })}
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
                Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
