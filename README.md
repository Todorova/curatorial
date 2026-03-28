# Curatorial — Museum Intelligence Dashboard

A research tool for curators to explore, analyze, and collect artworks from The Metropolitan Museum of Art's open collection of over 400,000 works.

Built with React 19, TypeScript, and the [Met Museum Collection API](https://metmuseum.github.io/).

## Running Locally

```bash
pnpm install
pnpm dev        # Development server
pnpm test       # Run tests
pnpm build      # Production build
```

## Architecture Decisions

### The N+1 Problem: Concurrency-Limited Batch Fetching

The Met API returns a list of object IDs from search, then requires individual fetches for each object's details. Loading 20 artworks means 21 API requests (1 search + 20 objects).

**Solution:** A custom concurrency limiter (`src/lib/concurrency.ts`) caps parallel requests at 8, staying within the browser's connection-per-host limit. TanStack Query caches every object by ID, so navigating gallery → detail → back never re-fetches. AbortSignal propagation ensures stale requests are cancelled immediately when the search changes, freeing connections for the new query.

### Data Transformation Layer

The API returns 60+ fields per object, many nullable or inconsistently formatted. Zod schemas (`src/api/schemas.ts`) validate raw responses, and transform functions (`src/api/transform.ts`) map them to clean internal types with sensible defaults ("Unknown Artist", "Date unknown"). The UI never touches raw API data.

### URL-Driven State

All search filters (keyword, department, date range, page) live in URL search params via `useSearchParams`. Deep-linking and refresh restoration work automatically. Filter changes replace history entries to keep the back button clean.

### Related Works

The spec requires suggesting works from the same period (±50 years) and department. The API's search endpoint requires a `q` parameter, so we use the department name as the keyword combined with `dateBegin`/`dateEnd` parameters. Results are shuffled and limited to 8 to provide variety.

### Search Behavior

The Met API performs full-text search across all indexed fields, including internal metadata not displayed in the UI. This means some results may not contain the search term in visible fields. This is by design — the API is built for research curators who benefit from discovering unexpected connections. Users can narrow results with Department and Date Range filters.

## Tech Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · TanStack Query v5 · React Router v7 · Zod v4 · Vitest · pnpm

## Testing

32 tests covering:
- **Data transformation** — Zod schema validation, null handling, fallback defaults
- **Date parsing** — BCE/CE dates, centuries, approximate dates, ranges
- **Concurrency limiter** — max parallel execution, queue behavior, error handling
- **ArtworkCard component** — rendering, missing data fallbacks, collect toggle
- **useCollected hook** — add/remove/toggle, sessionStorage persistence, provider boundary

```bash
pnpm test
```

## AI Usage

This project was built using Claude Code (Claude Opus) as an AI pair programmer. The AI assisted with:

- **Architecture planning** — Designing the data layer, component structure, and performance strategy before writing code
- **Implementation** — Generating initial component code, API schemas, and test suites
- **Debugging** — Identifying race conditions in debounce logic, diagnosing browser connection saturation from concurrent API calls, and tracing image loading failures
- **Iterative refinement** — Multiple rounds of testing and fixing (debounce → setTimeout refs → form submission; hidden images → opacity wrapper → direct opacity)

Every architectural decision was discussed and validated before implementation. The AI proposed approaches, but the final choices (removing client-side filtering, switching from debounce to form submission, removing department counts) were made based on testing the actual behavior in the browser and evaluating against the challenge requirements.
