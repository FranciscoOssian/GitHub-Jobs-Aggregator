import { fetchJobs } from "./github";
import { similarity } from "./similarity";
import { Job } from "@/types/job";
import { unstable_cache } from "next/cache";

/**
 * Process jobs to identify duplicates based on title similarity.
 * Runs when the getJobs cache is stale or manually revalidated.
 */
async function getProcessedJobs(): Promise<Job[]> {
  const jobs = await fetchJobs();
  
  if (jobs.length === 0) return [];

  // Create a copy to avoid mutating cached data if any
  const processedJobs: Job[] = jobs.map(j => ({ ...j }));
  
  const threshold = 0.85; // Similarity threshold
  let duplicateCount = 0;

  for (let i = 0; i < processedJobs.length; i++) {
    if (processedJobs[i].duplicateInfo) continue;

    for (let j = i + 1; j < processedJobs.length; j++) {
       if (processedJobs[j].duplicateInfo) continue;

       const score = similarity(processedJobs[i].title)
         .normalize()
         .charNGramTFIDF(8)
         .compare(processedJobs[j].title);
       
       if (score >= threshold) {
         processedJobs[j].duplicateInfo = {
           score: score,
           originalTitle: processedJobs[i].title,
           originalId: processedJobs[i].id
         };
         duplicateCount++;
       }
    }
  }

  console.log(`[Similarity] Processed ${processedJobs.length} jobs, found ${duplicateCount} duplicates.`);
  return processedJobs;
}

/**
 * Cached version of jobs with duplicate detection.
 */
export const getJobs = unstable_cache(
  async () => getProcessedJobs(),
  ['jobs-with-similarity'],
  { 
    revalidate: 86400, 
    tags: ['jobs'] 
  }
);
