import Link from "next/link";
import { REPOSITORIES } from "@/config/repos";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 py-4 border-b flex items-center justify-between">
        <h1 className="text-xl font-bold">GitHub Jobs Aggregator</h1>
        <nav>
           <Link href="/jobs" className="text-sm font-medium hover:underline underline-offset-4">
              Browse Jobs
           </Link>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Find Developer Jobs <br className="hidden sm:inline" />
          <span className="text-blue-600 dark:text-blue-400">Directly from GitHub</span>
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          We aggregate job listings from public GitHub repositories using Issues. 
          No middleman, just direct access to opportunities.
        </p>
        
        <div className="flex gap-4">
          <Link 
            href="/jobs" 
            className="inline-flex items-center justify-center h-11 rounded-md px-8 font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors bg-black text-white dark:bg-white dark:text-black"
          >
            Browse Jobs
          </Link>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
             className="inline-flex items-center justify-center h-11 rounded-md px-8 font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Learn More
          </a>
        </div>

        <div className="mt-12">
          <p className="text-sm text-muted-foreground mb-4">Aggregating from:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {REPOSITORIES.map((repo) => (
              <span key={`${repo.owner}/${repo.name}`} className="px-2 py-1 bg-muted rounded text-xs font-mono">
                {repo.owner}/{repo.name}
              </span>
            ))}
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        <p>Built with Next.js & GitHub GraphQL API</p>
      </footer>
    </div>
  );
}
