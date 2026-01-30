# GitHub Jobs Aggregator

A **non-commercial informational website** that aggregates job postings published as **GitHub Issues** across multiple repositories. This project acts strictly as an aggregator and index to help developers find jobs while preserving the original context and ownership of the repositories.

> "Help you find jobs — then send you back to GitHub."

## Features

-   **Centralized Discovery**: Aggregates job postings from multiple GitHub repositories into a single, high-quality index.
-   **Direct GitHub Integration**: All job listings link directly to the original GitHub Issue. No local job descriptions are stored or hosted.
-   **Smart Filtering**: Filter jobs by Repository or Labels with support for multiple selections (OR logic).
-   **Data Ownership**: Respects the source of the data; users are always redirected to the repository to apply or view details.
-   **Modern UI**: Clean, minimal interface built with Next.js and Tailwind CSS.
-   **Theme Support**: Fully supports Light and Dark modes.

## Architecture

This project is built using:

-   **Framework**: [Next.js](https://nextjs.org) (App Router)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com)
-   **Data Source**: GitHub GraphQL API
-   **Rendering**: Static Site Generation (SSG) with Incremental Static Regeneration (ISR).

### Data Strategy
-   Issues are fetched via the GitHub GraphQL API from a predefined list of repositories.
-   Valid jobs are cached and revalidated daily (ISR).
-   Failures in one repository do not block the entire site.

## Getting Started

### Prerequisites

-   Node.js (LTS version recommended)
-   A GitHub Personal Access Token (PAT) with `public_repo` access (or fine-grained token with read-only access to public repositories).

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/FranciscoOssian/GitHub-Jobs-Aggregator.git
    cd GitHub-Jobs-Aggregator
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  Set up environment variables:
    Create a `.env.local` file in the root directory and add your GitHub token:
    ```bash
    GITHUB_TOKEN=your_github_token_here
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

## License

The code in this repository is licensed under the generic license of the project. Job postings belong to their respective repository owners.
