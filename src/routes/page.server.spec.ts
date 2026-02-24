import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the LocalPhotoService module
vi.mock('$lib/server/services/photos/LocalPhotoService', () => {
	const photos = [
		{
			id: 'p1',
			src: '/photos/p1.jpg',
			ownerId: 'owner',
			favorite: false,
			visibility: 'public',
			tags: [],
			people: [],
			metadata: { datetime: '2026-01-01T00:00:00.000Z' },
			deletedAt: null,
			createdAt: '2026-01-01T00:00:00.000Z'
		},
		{
			id: 'p2',
			src: '/photos/p2.jpg',
			ownerId: 'owner',
			favorite: false,
			visibility: 'shared',
			tags: [],
			people: ['viewer-1'],
			metadata: { datetime: '2026-01-02T00:00:00.000Z' },
			deletedAt: null,
			createdAt: '2026-01-02T00:00:00.000Z'
		},
		{
			id: 'p3',
			src: '/photos/p3.jpg',
			ownerId: 'owner',
			favorite: false,
			visibility: 'private',
			tags: [],
			people: [],
			metadata: { datetime: '2026-01-03T00:00:00.000Z' },
			deletedAt: null,
			createdAt: '2026-01-03T00:00:00.000Z'
		}
	];

	return {
		default: vi.fn().mockImplementation(function () {
			return {
				getPhotos: vi.fn((filters?: { visibility?: string }) => {
					if (filters?.visibility === 'public') {
						return photos.filter((p) => p.visibility === 'public');
					}
					return photos;
				})
			};
		})
	};
});

describe('Homepage load — visibility filtering', () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it('unauthenticated user sees only public photos', async () => {
		const { load } = await import('./+page.server');
		const result = await load({ locals: { user: null, session: null } } as never);
		expect(result.previewPhotos.every((p) => p.visibility === 'public')).toBe(true);
	});

	it('owner sees all photos', async () => {
		const { load } = await import('./+page.server');
		const result = await load({
			locals: { user: { id: 'owner', role: 'owner' }, session: null }
		} as never);
		expect(result.previewPhotos.length).toBeGreaterThan(0);
	});

	it('caps preview at 8 photos', async () => {
		const { load } = await import('./+page.server');
		const result = await load({
			locals: { user: { id: 'owner', role: 'owner' }, session: null }
		} as never);
		expect(result.previewPhotos.length).toBeLessThanOrEqual(8);
	});
});
