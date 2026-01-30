"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export interface FilterState {
  search: string;
  labels: string[];
  hiddenRepos: string[]; // Store 'owner/name' of HIDDEN repos. Default is empty (all visible).
}

const STORAGE_KEY = "github-jobs-filters";

export function useJobFilters(defaultRepos: string[]) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isInitialized, setIsInitialized] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    labels: [],
    hiddenRepos: [],
  });

  // 1. Initialize State: URL -> LocalStorage -> Defaults
  useEffect(() => {
    if (isInitialized) return;

    const urlSearch = searchParams.get("search");
    const urlLabels = searchParams.get("labels");
    const urlHiddenRepos = searchParams.get("hiddenRepos");

    const hasUrlParams = urlSearch !== null || urlLabels !== null || urlHiddenRepos !== null;

    if (hasUrlParams) {
      // URL has priority
      setFilters({
        search: urlSearch || "",
        labels: urlLabels ? urlLabels.split(",") : [],
        hiddenRepos: urlHiddenRepos ? urlHiddenRepos.split(",") : [],
      });
    } else {
      // Fallback to LocalStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setFilters(parsed);
        } catch (e) {
          console.error("Failed to parse stored filters", e);
        }
      }
    }
    setIsInitialized(true);
  }, [searchParams, isInitialized]);

  // 2. Persist State: Update URL and LocalStorage on change
  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters((prev) => {
      const next = { ...prev, ...newFilters };
      
      // Update LocalStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

      // Update URL
      const params = new URLSearchParams();
      if (next.search) params.set("search", next.search);
      if (next.labels.length > 0) params.set("labels", next.labels.join(","));
      if (next.hiddenRepos.length > 0) params.set("hiddenRepos", next.hiddenRepos.join(","));
      
      router.replace(`?${params.toString()}`, { scroll: false });

      return next;
    });
  }, [router]);

  return {
    filters,
    setFilters: updateFilters,
    isInitialized,
  };
}
