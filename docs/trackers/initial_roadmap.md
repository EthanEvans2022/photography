# Phased Development Roadmap

> Derived from [`docs/prds/initial.md`](../prds/initial.md). Update phase statuses here as work progresses.

---

## Phase 1 — Foundation ⏳ IN REVIEW (PR #1)
- Session-based auth (login, logout, combined signup tab in `/login`)
- Read-only photo grid (`/photos`) with infinite scroll, date grouping, zoom, filter panel
- Read-only photo detail (`/photos/[id]`) with arrow nav, favorites, soft-delete, download
- Read-only albums browsing (`/photos/albums`, `/photos/albums/[id]`)
- UI component library: `Sidebar`, `UserWidget`, `FilterPanel`, `PhotosWidget`, `Dropdown`, `Tag`
- `LocalPhotoService` (JSON-backed), `IPhotoService` interface, `getVisiblePhotos()` helper
- Design system (CSS custom properties, dark theme, Inter font)

---

## Phase 2 — DB Migration & User Accounts

**Goal:** Persist data in Postgres and complete the user account layer.

### 2.1 Database-backed Photo Service
- Implement `DbPhotoService` in `src/lib/server/services/photos/DbPhotoService.ts` fulfilling the full `IPhotoService` interface using Drizzle queries
- Swap `LocalPhotoService` for `DbPhotoService` in `src/routes/photos/photo-utils.server.ts`
- Write a one-time seed script (or migration fixture) to import existing `static/photos/photos.json` into the DB

### 2.2 Dedicated `/signup` Route
- Create `src/routes/signup/+page.server.ts` and `+page.svelte`
- Move the `register` action out of `/login` into the new route
- Update `/login` to link to `/signup` (remove the tab pattern)

### 2.3 User Profile & Settings
- Add `/profile` route: view and edit `displayName`, `email`, `avatarUrl`
- Add `updateProfile` form action to `src/routes/profile/+page.server.ts`
- Surface avatar/display name in `UserWidget`

### 2.4 Owner User Management
- Add `/admin/users` route: list all viewer accounts, disable/enable accounts
- Owner-only guard (role check in load function)

**Critical files:**
- `src/lib/server/services/photos/IPhotoService.ts`
- `src/lib/server/services/photos/LocalPhotoService.ts` (reference implementation)
- `src/lib/server/db/schema.ts`
- `src/routes/photos/photo-utils.server.ts`
- `src/routes/login/+page.server.ts`

---

## Phase 3 — Owner Media Management

**Goal:** Give the owner full CRUD over their photo library.

### 3.1 Photo Upload
- Add `POST /photos/upload` endpoint supporting multipart file upload
- Write files to a configurable local directory (e.g. `UPLOAD_DIR` env var, defaulting to `./uploads/photos/`)
- Add `GET /media/[filename]` route to serve uploaded files from disk at runtime (bypasses `static/` bundling)
- Extract EXIF metadata (datetime, GPS) on ingest; populate `photo.metadata`
- Default new photos to `visibility: private`

### 3.2 Photo Metadata Editing
- Add `edit` form action to `/photos/[id]` (owner only): update title, datetime override, description, visibility
- Inline edit UI on the detail page

### 3.3 Visibility Controls
- Add `changeVisibility` action on photos and albums
- Show current visibility badge on grid thumbnails and detail page
- Bulk visibility change from the grid (extend existing bulk-select UI)

### 3.4 Trash / Restore
- Soft-delete is already tracked via `photo.deletedAt` (non-null = deleted) — no new schema property needed
- `IPhotoService` already defines `deletePhoto()`, `restorePhoto()`, and `getDeletedPhotos()`
- Add `/photos/trash` route: lists photos where `deletedAt IS NOT NULL`, using `getDeletedPhotos()`
- Add `restore` action (clears `deletedAt`) and `permanentDelete` action (hard-deletes row + file from disk)
- 30-day auto-purge: on load of `/photos/trash`, sweep and permanently delete any photo where `deletedAt < now() - 30 days`

**Critical files:**
- `src/routes/photos/+page.svelte` (bulk-select already partially wired)
- `src/routes/photos/[id]/+page.server.ts`
- `src/lib/server/services/photos/IPhotoService.ts` (`deletePhoto`, `restorePhoto` already defined)

---

## Phase 4 — Album CRUD

**Goal:** Full album management for the owner.

### 4.1 Create / Edit / Delete Albums
- Add `create`, `edit`, `delete` form actions to `/photos/albums/+page.server.ts`
- Create album modal/form: name, description, visibility
- Edit album: rename, change description, change cover photo, change visibility
- Delete album: confirm dialog, cascade remove `albumPhoto` join rows (keep photos)

### 4.2 Add / Remove Photos from Albums
- Add `addToAlbum` and `removeFromAlbum` actions
- "Add to Album" UI from photo detail page (dropdown of user's albums)
- Visibility broadening warning modal: if the photo's visibility is narrower than the album's, prompt owner to confirm broadening the photo's visibility

### 4.3 Album Sharing
- Set per-album visibility (`public` / `shared` / `private`)
- Album-level shared users list (future: explicit user grants beyond tagging)

**Critical files:**
- `src/routes/photos/albums/+page.server.ts`
- `src/routes/photos/albums/[id]/+page.server.ts`
- `src/lib/server/services/photos/IPhotoService.ts` (`createAlbum`, `deleteAlbum`, `addToAlbum`, `removeFromAlbum` already defined)

---

## Phase 5 — Tagging System

**Goal:** People tagging and contextual metadata tags with viewer discovery.

### 5.1 People Tagging
- Tag registered users in photos (store as `photo.people: userId[]`)
- "Tag people" UI on photo detail: user search/autocomplete → add tag
- Tagged users automatically gain view access to `shared` photos they appear in (already in `getVisiblePhotos()` logic)
- Remove people tag action

### 5.2 Contextual Tag Management
- "Add tag" / "Remove tag" actions on photo detail page
- Tags stored in `photo.tags: string[]` (already in schema)
- Tag autocomplete from `getAllTags()` (already in `IPhotoService`)

### 5.3 "Photos of Me" View
- Add `/photos/me` route for authenticated viewers
- Lists all `shared`/`public` photos where `people` includes `locals.user.id`

### 5.4 Tag Index
- Add `/photos/tags` route: browsable list of all tags with photo counts
- Clicking a tag filters to `/photos?tags[]=<tag>`

**Critical files:**
- `src/routes/photos/[id]/+page.server.ts`
- `src/lib/server/services/photos/IPhotoService.ts` (`getAllTags`, `getAllPeople`)
- `src/routes/photos/photo-utils.server.ts` (`getVisiblePhotos` — people access already factored in)

---

## Phase 6 — Search & Discovery

**Goal:** Full search across the library and viewer discovery surfaces.

### 6.1 Full-Text Search
- Add `/search` route with query param `?q=`
- Search across: photo tags, people usernames/display names, album names, metadata
- Results page with photo grid + album cards

### 6.2 "Shared With Me" Viewer Feed
- Add `/shared` route for authenticated viewers
- Shows all `shared` photos/albums the viewer has access to (explicit grants + people tags)
- Distinct from the main `/photos` grid (owner's full library view)

### 6.3 Viewer Sidebar Links
- Add "Shared With Me", "Photos of Me", and "Tags" to sidebar nav (viewer role only)

**Critical files:**
- `src/lib/components/feature/Sidebar.svelte`
- `src/routes/photos/photo-utils.server.ts` (`getVisiblePhotos`)

---

## Acceptance Criteria (per phase)
- `npm run test:unit` — all existing + new specs pass, **≥80% code coverage**
- `npm run lint` — no linting or formatting errors
- `npm run check` — no TypeScript errors
- Smoke-test as owner and as a viewer account to confirm access boundaries
- For Phase 2+: run `npm run db:push` to apply schema changes before testing
