"use client";

import { useMemo, useState } from "react";
import { Job } from "@/types/job";
import { JobCard } from "@/components/job-card";
import { Search, Filter, X, Menu } from "lucide-react"; 
import { REPOSITORIES } from "@/config/repos";
import { useJobFilters } from "@/hooks/use-job-filters";
import { Badge } from "@/components/ui/badge";

interface JobListProps {
  jobs: Job[];
}

export function JobList({ jobs }: JobListProps) {
  const { filters, setFilters, isInitialized } = useJobFilters([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  // ... (rest of logic unchanged until Badge)


  const { labelsByRepo, filteredJobs } = useMemo(() => {
    if (!isInitialized) {
      return { labelsByRepo: new Map<string, Map<string, number>>(), filteredJobs: [] };
    }

    const visibleJobs = jobs.filter(job => !filters.hiddenRepos.includes(job.repository));
    const repoLabelMap = new Map<string, Map<string, number>>();
    
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

    const result = visibleJobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(filters.search.toLowerCase()) || 
                            job.repository.toLowerCase().includes(filters.search.toLowerCase());
      
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
      ? current.filter(r => r !== repoName)
      : [...current, repoName];
    setFilters({ hiddenRepos: next });
  };

  if (!isInitialized) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-8 relative items-start">
      
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden w-full sticky top-[64px] z-30 mb-4 bg-background/95 backdrop-blur-sm">
         <button 
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full flex items-center justify-between p-4 bg-background border rounded-xl shadow-sm font-semibold"
         >
            <span className="flex items-center gap-2">
              <Filter className="w-5 h-5" /> Filters
            </span>
            {showMobileFilters ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
         </button>
      </div>

      {/* Sidebar Filters */}
      <aside className={`
        w-full lg:w-80 shrink-0 space-y-8
        ${showMobileFilters ? "block" : "hidden"} 
        lg:block lg:sticky lg:top-[100px]
      `}>
        <div className="bg-card border rounded-xl p-5 shadow-sm space-y-6 lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto customize-scrollbar">
           <div className="flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filters
              </h2>
              {(filters.search || filters.labels.length > 0 || filters.hiddenRepos.length > 0) && (
                <button
                  onClick={() => setFilters({ search: "", labels: [], hiddenRepos: [] })}
                  className="text-xs text-destructive hover:underline font-medium"
                >
                  Clear All
                </button>
              )}
           </div>

           {/* Search */}
           <div className="space-y-2">
             <label htmlFor="search-jobs" className="text-sm font-medium text-muted-foreground">Search</label>
             <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  id="search-jobs"
                  type="text"
                  placeholder="Title, company..."
                  className="w-full h-9 rounded-md border border-input bg-background pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={filters.search}
                  onChange={(e) => setFilters({ search: e.target.value })}
                  aria-label="Search jobs by title or company"
                />
             </div>
           </div>

           {/* Repositories */}
           <div className="space-y-3">
              <span className="text-sm font-medium text-muted-foreground block">Repositories</span>
              <div className="flex flex-wrap gap-2">
                {[...REPOSITORIES]
                  .sort((a, b) => a.owner.length - b.owner.length)
                  .map(repo => {
                  const fullName = `${repo.owner}/${repo.name}`;
                  const isHidden = filters.hiddenRepos.includes(fullName);
                  return (
                    <button
                      key={fullName}
                      onClick={() => toggleRepo(fullName)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors border ${
                        !isHidden 
                        ? "bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80" 
                        : "bg-transparent text-muted-foreground border-input opacity-60 hover:text-foreground"
                      }`}
                      aria-pressed={!isHidden}
                      aria-label={`Toggle visibility for repository ${repo.owner}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${!isHidden ? "bg-green-500" : "bg-zinc-300"}`} />
                      {repo.owner}
                    </button>
                  );
                })}
              </div>
           </div>

           {/* Labels */}
           <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Labels (Match Any)</span>
                {filters.labels.length > 0 && (
                   <button 
                     onClick={() => setFilters({ labels: [] })}
                     className="text-xs text-blue-500 hover:underline"
                   >
                     Clear
                   </button>
                )}
              </div>
              
              <div className="space-y-4 pr-1">
                 {Array.from(labelsByRepo.entries()).map(([repoName, labels]) => {
                    if (labels.size === 0) return null;
                    return (
                      <div key={repoName}>
                        <h4 className="text-[10px] font-bold uppercase text-muted-foreground mb-2 sticky top-0 bg-card py-1">
                          {repoName.split('/')[0]}
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {Array.from(labels.entries()).sort().map(([label, count]) => {
                             const isSelected = filters.labels.includes(label);
                             return (
                               <button
                                 key={`${repoName}-${label}`}
                                 onClick={() => toggleLabel(label)}
                                 className={`
                                   inline-flex items-center gap-1.5 rounded px-2 py-1 text-[11px] font-medium transition-colors border
                                   ${isSelected 
                                     ? "border-blue-500/50 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300" 
                                     : "border-transparent bg-secondary/40 text-secondary-foreground hover:bg-secondary/60"
                                   }
                                 `}
                                 title={`${label} (${count} jobs)`}
                               >
                                 {label}
                                 <span className="opacity-50 text-[10px]">{count}</span>
                               </button>
                             );
                          })}
                        </div>
                      </div>
                    );
                 })}
                 {Array.from(labelsByRepo.values()).every(m => m.size === 0) && (
                   <div className="text-sm text-muted-foreground italic px-2">No labels in visible jobs.</div>
                 )}
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Job Listings</h1>
          <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3 py-1 text-sm">
             {filteredJobs.length} Found
          </Badge>
        </div>

        <div className="space-y-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))
          ) : (
             <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl bg-muted/5">
                <Search className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-semibold">No jobs found</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                  Adjust your filters or search terms to see more results.
                </p>
                <button
                    onClick={() => setFilters({ search: "", labels: [], hiddenRepos: [] })}
                    className="mt-6 text-sm font-medium text-primary hover:underline"
                >
                    Clear all filters
                </button>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
