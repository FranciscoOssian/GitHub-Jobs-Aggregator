# System Specification — GitHub Jobs Aggregator

## 1. System Overview
The system is a **read-only GitHub Issues aggregator** built with **Next.js**.

It:
- Consumes public data from GitHub
- Does not modify or enrich job content
- Redirects users to the original source

---

## 2. Technology Stack
- Framework: **Next.js (App Router + Server Components)**
- Styling: **Tailwind CSS**
- Data source: **GitHub GraphQL API**
- Authentication: Personal GitHub token (read-only)
- Rendering: Static + ISR (Jobs data) / Server-Side Rendering (Filtering)
- Caching: **`unstable_cache`** for aggregated job data with revalidation tags.

---

## 3. Data Source & Fetching
- Issues are fetched via GitHub GraphQL API
- A predefined list of repositories is queried
- Only public issues are considered

Caching strategy:
- Data is cached using Next.js features
- Revalidation occurs **once per day**
- Failures in one repository do not block others

---

## 4. Data Model (Conceptual)

### Job
Derived from a GitHub Issue:
- id
- title
- repository (owner/name)
- labels (raw + display-normalized)
- issue_url
- timestamps (optional)

No local job descriptions are stored.

---

## 5. Aggregation Logic
- Each configured repository is queried independently
- All returned issues are treated as jobs
- No heuristics to determine “valid” job issues

If a repository uses unconventional labels, they remain unchanged.

---

### 6. Normalization & Deduplication
- **Visual normalization**: Labels are cleaned up for UI display (e.g., casing).
- **Similarity-based Deduplication**: 
  - Uses **TF-IDF with 8-character n-grams** to compare job titles.
  - Default similarity threshold: **0.85**.
  - Duplicate jobs are identified but preserved in the dataset with a `duplicateInfo` property.
  - By default, duplicates are filtered out in the UI unless explicitly enabled.
- **Sorting**: Jobs are typically sorted by their arrival from the API (latest first).

#### Not allowed:
- Semantic inference
- Taxonomy creation
- Content rewriting

---

- **Search**: Jobs can be filtered by `Title`, `Repository`, and `Company`. Search is case-insensitive.
- **Repository Filtering**: Users can select/deselect specific repositories (default: all selected).
  - **Display**: Shown as the community/owner name only (e.g., "backend-br" instead of "backend-br/vagas").
  - **Sorting**: Repositories are sorted by community name length (ascending) to optimize the visual flow.
- **Label Logic**: Multiple selected labels use **OR** logic (Union), not AND. This allows selecting labels from different repositories simultaneously.
- **Duplicate Toggle**: A "Show Duplicates" switch allows users to see similar job postings from different repositories.
- **Dynamic Label Availability**: The list of available filter labels is derived from the currently visible jobs.
- **Label Context**: Labels are visually grouped by their repository in the filter UI.
- **Styling**: Label buttons use accessible contrast and distinct visual styles for selected states.

### Persistence Strategy
Filters (text, labels, repositories) are persisted **exclusively** via:
1. **URL Query Parameters**: The single source of truth (stateless, shareable).

Sync Logic: UI interactions trigger URL updates; Server renders based on URL.

---

## 8. Pages & Rendering

### Home
- Static page
- SEO-focused
- No dynamic data required

### Jobs
- Uses cached aggregated data
- Revalidated once per day
- Fast read-only rendering

---

## 9. Error Handling
- Partial failures tolerated
- If a repo fails, it is skipped
- No placeholder or fake jobs shown

---

## 10. Security & Ethics
- Only public GitHub data
- Token scoped to read-only
- Clear redirection to original issues
- No attempt to capture or retain users

---

## 11. Out of Scope
- Authentication
- User accounts
- Favorites or alerts
- Paid features
- Non-GitHub data sources

---

## 12. System Constraints
- Simplicity over intelligence
- Transparency over feature richness
- Aggregation over ownership
