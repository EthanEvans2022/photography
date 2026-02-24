import { render } from 'vitest-browser-svelte';
import { describe, it, expect } from 'vitest';
import { page } from 'vitest/browser';
import PhotosWidget from './PhotosWidget.svelte';
import type { Photo } from '$lib/types/photo';

function makePhoto(id: string, overrides: Partial<Photo> = {}): Photo {
	return {
		id,
		src: `/photos/${id}.jpg`,
		ownerId: 'owner',
		favorite: false,
		visibility: 'public',
		tags: [],
		people: [],
		metadata: { datetime: '2026-01-01T00:00:00.000Z' },
		deletedAt: null,
		createdAt: '2026-01-01T00:00:00.000Z',
		...overrides
	};
}

describe('PhotosWidget', () => {
	it('renders the photos section heading', async () => {
		render(PhotosWidget, { photos: [] });
		await expect.element(page.getByRole('heading', { name: 'Photos' })).toBeVisible();
	});

	it('renders a View All link to /photos', async () => {
		render(PhotosWidget, { photos: [] });
		const link = page.getByRole('link', { name: /View All/i });
		await expect.element(link).toBeVisible();
		await expect.element(link).toHaveAttribute('href', '/photos');
	});

	it('shows empty message when no photos', async () => {
		render(PhotosWidget, { photos: [] });
		await expect.element(page.getByText('No photos available.')).toBeVisible();
	});

	it('renders up to 8 photo thumbnails', async () => {
		const photos = Array.from({ length: 10 }, (_, i) => makePhoto(`p${i}`));
		render(PhotosWidget, { photos });
		// Thumbnail anchors have title={photo.metadata.datetime}; "View All" link has no title.
		const thumbs = page.getByTitle('2026-01-01T00:00:00.000Z');
		await expect.element(thumbs.first()).toBeVisible();
		expect((await thumbs.all()).length).toBe(8);
	});

	it('renders fewer than 8 thumbnails when fewer photos exist', async () => {
		const photos = Array.from({ length: 3 }, (_, i) => makePhoto(`p${i}`));
		render(PhotosWidget, { photos });
		const thumbs = page.getByTitle('2026-01-01T00:00:00.000Z');
		expect((await thumbs.all()).length).toBe(3);
	});

	it('each thumbnail links to the photo detail page', async () => {
		const photos = [makePhoto('abc')];
		render(PhotosWidget, { photos });
		const link = page.getByTitle('2026-01-01T00:00:00.000Z').first();
		await expect.element(link).toHaveAttribute('href', '/photos/abc');
	});
});
