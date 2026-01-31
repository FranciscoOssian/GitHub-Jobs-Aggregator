# System Specification — GitHub Jobs Aggregator

## 1. System Overview
The system is a **read-only GitHub Issues aggregator** built with **Next.js**.

It:
- Consumes public data from GitHub
- Does not modify or enrich job content
- Redirects users to the original source

---

## 2. Technology Stack
- Framework: **Next.js**
- Styling: **Tailwind CSS**
- Data source: **GitHub GraphQL API**
- Authentication: Personal GitHub token (read-only)
- Rendering: Static + ISR (Incremental Static Regeneration)

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

## 6. Normalization Rules
Allowed:
- Visual normalization of labels for UI
- Deduplication
- Sorting

Not allowed:
- Semantic inference
- Taxonomy creation
- Content rewriting

---

## 7. Filtering
- Filtering is entirely client-side (UI-driven)
- Filters operate directly on existing labels
- **Layout**: 
  - **Desktop**: Persistent Sticky Sidebar for filters to allow simultaneous filtering and browsing.
  - **Mobile**: Collapsible or stacked filters at the top.
- **Repository Filtering**: Users can select/deselect specific repositories (default: all selected).
  - **Display**: Shown as the community/owner name only (e.g., "backend-br" instead of "backend-br/vagas").
  - **Sorting**: Repositories are sorted by name length (ascending) to optimize the visual flow of the filter buttons.
- **Label Logic**: Multiple selected labels use **OR** logic (Union), not AND. This allows selecting labels from different repositories simultaneously.
- **Dynamic Label Availability**: The list of available filter labels must be derived **only** from the currently visible jobs.
- **Label Context**: Labels must be visually associated with their repository (e.g., grouped by repository in the filter UI).
- **Styling**: Label buttons should have accessible contrast and distinct visual style.
- No derived or synthetic filters

### Persistence Strategy
Filters (text, labels, repositories) must be persisted with the following priority:
1. **URL Query Parameters**: Primary source of truth (stateless, shareable).
2. **Local Storage**: Secondary source (user preference persistence).
3. **Defaults**: Fallback if neither exists (empty search, no labels, all repos).

Sync Logic: Changes update both URL and Local Storage.


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
