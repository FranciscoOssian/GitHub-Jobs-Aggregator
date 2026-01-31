import Link from "next/link";
import { REPOSITORIES } from "@/config/repos";
// Note: Lucide icons might not be installed, using simple text/svg or sticking to text for now to be safe.
// If icons were available, I'd use them in the features section.

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20">
      <header className="px-6 py-4 border-b flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <h1 className="text-xl font-bold tracking-tight">GitHub Jobs Aggregator</h1>
        <nav>
           <Link href="/jobs" className="text-sm font-medium hover:text-primary transition-colors">
              Browse Jobs
           </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center w-full">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center p-6 py-20 md:py-32 text-center space-y-8 w-full max-w-4xl mx-auto">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-tight">
              Find Developer Jobs <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Directly from GitHub
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
              We aggregate job listings from public GitHub repositories using Issues. <br className="hidden md:inline"/>
              No middleman, just direct access to opportunities.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link 
              href="/jobs" 
              className="inline-flex items-center justify-center h-12 rounded-lg px-8 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Browse Jobs
            </Link>
            <a 
              href="https://github.com/FranciscoOssian/GitHub-Jobs-Aggregator" 
              target="_blank" 
              rel="noopener noreferrer"
               className="inline-flex items-center justify-center h-12 rounded-lg px-8 font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-all"
            >
              View on GitHub
            </a>
          </div>
        </section>

        {/* Value Proposition / Features */}
        <section className="w-full px-6 py-16 bg-muted/30 border-y">
          <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-3">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Centralized Discovery</h3>
              <p className="text-muted-foreground">
                Stop checking dozens of individual repositories. We index job postings from the most active developer communities into a single, searchable list.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Direct Integration</h3>
              <p className="text-muted-foreground">
                We respect the source. Every listing links directly to the original GitHub Issue, preserving context and ensuring data ownership.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Smart Filtering</h3>
              <p className="text-muted-foreground">
                Filter by specific repositories or labels. Find exactly what you&apos;re looking for without the noise of traditional job boards.
              </p>
            </div>
          </div>
        </section>

        {/* Aggregation Source */}
        <section className="w-full px-6 py-20 text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Trusted Sources</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We currently aggregate job opportunities from these active open-source communities:
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {REPOSITORIES.map((repo) => (
              <a 
                href={`https://github.com/${repo.owner}/${repo.name}`}
                target="_blank"
                rel="noopener noreferrer"
                key={`${repo.owner}/${repo.name}`} 
                className="px-4 py-2 bg-muted/50 hover:bg-muted rounded-full text-sm font-medium transition-colors border border-transparent hover:border-border"
              >
                {repo.owner}/{repo.name}
              </a>
            ))}
          </div>

          <div className="pt-8 text-sm text-muted-foreground">
             <p>
               Missing a community?{" "}
               <a 
                 href="https://github.com/FranciscoOssian/GitHub-Jobs-Aggregator/issues" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-primary hover:underline underline-offset-4"
               >
                 Open an issue
               </a>
               {" "}to suggest a repository.
             </p>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t bg-muted/20">
        <div className="flex flex-col items-center gap-2">
           <a 
             href="https://github.com/FranciscoOssian/GitHub-Jobs-Aggregator" 
             target="_blank" 
             rel="noopener noreferrer" 
             className="hover:text-primary transition-colors font-medium"
           >
             GitHub Jobs Aggregator
           </a>
           <p className="text-xs">Open Source • Built for the Community</p>
        </div>
      </footer>
    </div>
  );
}
