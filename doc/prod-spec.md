# Product Specification — GitHub Jobs Aggregator

## 1. Purpose
Create a **non-commercial informational website** that aggregates job postings published as **GitHub Issues** across multiple repositories.

The site acts strictly as an **aggregator and index**, not as a job board or marketplace.

---

## 2. Problem
Many job opportunities are shared via GitHub repositories using Issues.
Currently:
- Jobs are fragmented across many repos
- Discovery depends on knowing each repository
- Existing aggregators are limited to a single source

---

## 3. Value Proposition
- Centralize discovery of GitHub-based job postings
- Preserve the original context and ownership of repositories
- Reduce friction without competing with the source

The site’s role is:
> “Help you find jobs — then send you back to GitHub.”

---

## 4. Target Users
- Developers searching for jobs
- People already familiar with GitHub
- Users who want a lightweight, fast discovery experience

---

## 5. Non-Goals
The site does NOT:
- Create or host job postings
- Standardize job descriptions
- Infer salary, seniority, or stack
- Provide application flows
- Replace repository usage

---

## 6. Core Pages

### 6.1 Home (`/`)
The Home page is both:
- A **landing page**
- An **SEO-oriented explanation page**

Content:
- Clear explanation of what the site does
- Explicit statement that:
  - The site does not compete with repositories
  - All jobs belong to their original GitHub repos
- List of aggregated repositories (with links)
- CTA to access `/jobs`

Additional section:
- “Want to add a repository?”
- Instructions to open an Issue in the site’s own repository
- Link to that repository

No job listings appear on the Home page.

---

### 6.2 Jobs Listing (`/jobs`)
Primary functional page.

Features:
- Aggregated list of job postings
- Each job maps to a single GitHub Issue
- Minimal information only:
  - Issue title
  - Repository name
  - Labels
  - Direct link to the GitHub Issue

Primary action:
- Redirect the user to GitHub for full details

---

## 7. Labels & Filters
- Labels are taken **as-is** from GitHub
- No attempt to enforce or define taxonomy

Behavior:
- All labels are indexed
- Filters are UI-driven
- Light visual normalization allowed:
  - Remove separators (`-`, `_`)
  - Uppercase for display

Meaning is never inferred or unified.

---

## 8. UX Principles
- Clean and minimal UI
- Fast scanning
- Technical aesthetic
- No content duplication
- Encourage redirection to GitHub

---

## 9. Theme
- Light and Dark themes supported
- Default theme follows system preference
- Manual toggle available

---

## 10. SEO Intent
- Descriptive Home page
- Indexable `/jobs` page
- Clear transparency about data source

---

## 11. Success Criteria
- Jobs are easy to discover
- Users clearly understand data ownership
- Repositories feel referenced, not copied
