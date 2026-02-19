# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview production build locally

npm run check            # TypeScript type-checking (svelte-check)
npm run lint             # Check formatting and linting (Prettier + ESLint)
npm run format           # Auto-format code

npm run test:unit        # Run unit/component tests (Vitest, watch mode)
npm run test:e2e         # Run E2E tests (Playwright, requires built app)
npm run test             # Run all tests once (unit + e2e)

npm run db:start         # Start local Postgres via Docker
npm run db:push          # Push schema changes to DB (dev, no migration file)
npm run db:generate      # Generate migration files from schema changes
npm run db:migrate       # Run pending migrations
npm run db:studio        # Open Drizzle visual DB studio

npm run photos:generate  # Scan static/photos/ and regenerate static/photos/photos.json

npm run storybook        # Launch Storybook on port 6006
```

Copy `.env.example` to `.env` before running the app locally. Run `npm run db:start` before any DB commands.

## Architecture

**Stack:** SvelteKit 2 + Svelte 5 (runes API), TypeScript strict, `adapter-node`, Vite 7, PostgreSQL + Drizzle ORM.

### Data Flow

All data loading is server-side via SvelteKit `+page.server.ts` `load` functions — no client-side fetching. Route components receive typed `PageData` from their server load function.

### Service Layer

Photo data access is abstracted behind `IPhotoService` ([src/lib/server/services/photos/IPhotoService.ts](src/lib/server/services/photos/IPhotoService.ts)). The current implementation is `LocalPhotoService` ([src/lib/server/services/photos/LocalPhotoService.ts](src/lib/server/services/photos/LocalPhotoService.ts)), which loads from `static/photos/photos.json` at startup. The DB schema is fully defined ([src/lib/server/db/schema.ts](src/lib/server/db/schema.ts)) but a database-backed service implementation does not yet exist. When adding new photo routes, instantiate `LocalPhotoService` and call it through the `IPhotoService` interface so that the implementation can be swapped later without changing route logic.

### DB Schema

Tables: `user`, `session`, `photo`, `album`, `albumPhoto`. Photos support soft-delete (`deletedAt`), visibility enum (`public`/`shared`/`private`), and JSONB fields for tags, people, and metadata. See [src/lib/server/db/schema.ts](src/lib/server/db/schema.ts).

### Authentication

Session-based auth (Lucia-inspired pattern) implemented in [src/lib/server/auth.ts](src/lib/server/auth.ts). Raw 18-byte token stored in cookie; SHA-256 hash stored as session ID in DB. Auth middleware runs in [src/hooks.server.ts](src/hooks.server.ts) via `sequence()` and populates `event.locals.user` and `event.locals.session` for all server `load` functions. Auth types are declared in [src/app.d.ts](src/app.d.ts).

### i18n

Paraglide (`@inlang/paraglide-js`) with English (`messages/en.json`) and Spanish (`messages/es.json`). Source messages compile to `src/lib/paraglide/` — do not edit that directory manually. The Paraglide middleware in `hooks.server.ts` detects locale from URL prefix; `src/hooks.ts` strips the locale prefix for client-side routing.

### Styling

Pure CSS custom properties — no Tailwind. Design tokens (colors, spacing, typography, border-radius) are declared in `src/app.css` `:root`. The app uses a dark theme by default. Component styles are scoped `<style>` blocks within each `.svelte` file.

### Testing

Three Vitest projects (configured in [vite.config.ts](vite.config.ts)):
- **server** — Node environment for server-side code (e.g., `LocalPhotoService`)
- **client** — Chromium browser via Playwright for Svelte component tests (`*.svelte.spec.ts`)
- **storybook** — Browser tests for Storybook stories

All tests use `requireAssertions: true`. E2E tests live in `e2e/` and use Playwright against the built app.

### Adding Photos

1. Place image files in `static/photos/`
2. Run `npm run photos:generate` to regenerate `static/photos/photos.json`
