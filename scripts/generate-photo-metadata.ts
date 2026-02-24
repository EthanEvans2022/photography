/**
 * Scans static/photos/ for image files and generates a photos.json metadata skeleton.
 *
 * Usage:  npx tsx --env-file=.env scripts/generate-photo-metadata.ts
 *
 * - Only picks up .jpg, .jpeg, .png, .gif, .webp files
 * - Preserves any existing entries in photos.json (merges by id)
 * - New entries get placeholder values you should fill in
 */

import fs from 'fs';
import path from 'path';
import type { LocalPhoto } from '../src/lib/types/photo';

const PHOTOS_DIR = path.resolve(process.env.PHOTOS_DIR ?? 'static/photos');
const JSON_PATH = path.resolve(process.env.PHOTOS_JSON_PATH ?? 'static/photos/photos.json');
const IMAGE_EXTENSIONS = (process.env.IMAGE_EXTENSIONS ?? '.jpg,.jpeg,.png,.gif,.webp').split(',');

// Load existing JSON if present
let existing: LocalPhoto[] = [];
if (fs.existsSync(JSON_PATH)) {
	existing = JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'));
}
const existingById = new Map(existing.map((p) => [p.id, p]));

// Scan directory
const files = fs
	.readdirSync(PHOTOS_DIR)
	.filter((f) => IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase()));

const result: LocalPhoto[] = files.map((file) => {
	const id = path.basename(file, path.extname(file));

	// Keep existing entry if present
	if (existingById.has(id)) {
		return existingById.get(id)!;
	}

	return {
		id,
		src: `/photos/${file}`,
		ownerId: 'owner',
		favorite: false,
		visibility: 'public' as const,
		tags: [],
		people: [],
		metadata: {
			datetime: new Date().toISOString()
		}
	};
});

const seen = new Map<string, string>();
const deduped = result.filter((entry) => {
	if (seen.has(entry.id)) {
		console.warn(
			`Duplicate id "${entry.id}" — skipping ${entry.src} (kept ${seen.get(entry.id)})`
		);
		return false;
	}
	seen.set(entry.id, entry.src);
	return true;
});

fs.writeFileSync(JSON_PATH, JSON.stringify(deduped, null, '\t'));
console.log(`Wrote ${deduped.length} entries to ${JSON_PATH}`);
