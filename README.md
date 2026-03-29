# Curatorial — Museum Intelligence Dashboard

A research-oriented dashboard for exploring the Metropolitan Museum of Art's open collection. Built for curators who need to discover artifacts, analyze historical context, and organize digital exhibitions.

**Live Demo:** [curatorial.vercel.app](https://curatorial.vercel.app)

---

## Getting Started

```bash
npm install
npm run dev       # http://localhost:5173
npm run test      # run test suite
npm run build     # production build
```

## Architecture

### Tech Stack

- **React 19** + **TypeScript 5.9** — strict types, modern concurrent features
- **Vite 8** — fast dev server with instant hot reload
- **TanStack React Query v5** — server state, caching, progressive loading
- **Tailwind CSS v4** — utility-first styling with custom theme tokens
- **Zod v4** — runtime validation and transformation of API responses
- **React Router v7** — URL-driven state for deep-linking and filter persistence
- **Vitest + Testing Library + MSW** — unit, component, and integration tests

### Key Architectural Decisions

#### Progressive Loading Strategy

The Met API returns a list of object IDs from search, then requires individual fetches per artwork. Rather than blocking the UI until all items load, the app uses a three-step pipeline:

1. **Search** — fetch matching object IDs (single request)
2. **Paginate** — slice IDs client-side (12 per page)
3. **Progressive fetch** — load each artwork individually via `useQueries`, rendering cards as they arrive

A custom **concurrency limiter** (queue-based, max 6 parallel requests) prevents overwhelming the API while keeping the UI responsive.

#### Data Integrity via Zod Schemas

The Met API returns inconsistent data — null fields, missing images, varying date formats. A Zod schema layer (`src/lib/schemas.ts`) transforms raw responses into a normalized internal model with safe defaults (`null` titles become `"Untitled"`, missing arrays become `[]`). This single transformation boundary keeps all downstream components free from null-checking.

#### URL-Driven State

All search configuration (keyword, department, date range, page) lives in URL search params. This enables deep-linking, browser back/forward navigation, and state restoration on refresh — all without additional state management libraries.

#### Session-Scoped Collection

The "Collected" feature uses `sessionStorage` with a `Map`-based reducer for O(1) toggle/lookup operations. Session scope was chosen deliberately — the requirement specifies maintaining collected status "across the session," and session storage clears naturally when the tab closes.

### Project Structure

```
src/
├── components/       # UI components (cards, filters, pagination)
│   ├── ui/           # Base UI primitives (shadcn v4 + Base UI)
│   └── __tests__/    # Component tests
├── context/          # React context (CollectedProvider)
├── hooks/            # Custom hooks (useCollection, useArtworkDetail)
├── lib/              # API client, Zod schemas, concurrency limiter, constants
│   └── __tests__/    # Schema and utility tests
├── pages/            # Route-level page components
├── test/             # Test setup and MSW mock handlers
└── types/            # TypeScript interfaces
```

## AI Usage

AI tools (Claude) were used throughout development for:

- **Scaffolding** — initial project setup, component structure, and shadcn configuration
- **Implementation** — progressive loading strategy, concurrency limiter, Zod schema design
- **Code review** — identifying redundant query config, missing test coverage, and architectural inconsistencies
- **Refactoring** — unifying query configuration, replacing JS-based responsive logic with Tailwind CSS classes, simplifying component types

The human role focused on architectural decisions, requirement interpretation, UX judgment calls, and validating that AI-generated code met the specification. AI was treated as a fast pair programmer — useful for velocity, but every output was reviewed for correctness and coherence.
