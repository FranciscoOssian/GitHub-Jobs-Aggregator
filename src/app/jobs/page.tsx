import { Suspense } from "react";
import { fetchJobs } from "@/lib/github";
import { JobList } from "./job-list";
import { REPOSITORIES } from "@/config/repos";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const revalidate = 86400; // 24 hours

export default async function JobsPage() {
  // Fetch data on the server
  const jobs = await fetchJobs();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-4 border-b flex items-center gap-4">
        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold">Latest Jobs</h1>
      </header>
      
      <main className="flex-1 container mx-auto max-w-4xl p-6">
        <div className="mb-8">
          <p className="text-muted-foreground">
            Aggregated from {REPOSITORIES.length} repositories. Updated daily.
          </p>
        </div>

        <Suspense fallback={<div>Loading filters...</div>}>
          <JobList jobs={jobs} />
        </Suspense>
      </main>
    </div>
  );
}
