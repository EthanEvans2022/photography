import { describe, it, expect, vi, beforeEach } from 'vitest';

// We test the logic of the load function in isolation
// by mocking the parent module's photoService and getVisiblePhotos

const publicPhoto = {
	id: 'pub-1',
	src: '/photos/pub-1.jpg',
	ownerId: 'owner',
	favorite: false,
	visibility: 'public' as const,
	tags: [],
	people: [],
	metadata: { datetime: '2026-01-01T00:00:00.000Z' },
	deletedAt: null,
	createdAt: '2026-01-01T00:00:00.000Z'
};

const sharedPhoto = {
	id: 'shared-1',
	src: '/photos/shared-1.jpg',
	ownerId: 'owner',
	favorite: false,
	visibility: 'shared' as const,
	tags: [],
	people: ['viewer-1'],
	metadata: { datetime: '2026-01-02T00:00:00.000Z' },
	deletedAt: null,
	createdAt: '2026-01-02T00:00:00.000Z'
};

const privatePhoto = {
	id: 'priv-1',
	src: '/photos/priv-1.jpg',
	ownerId: 'owner',
	favorite: false,
	visibility: 'private' as const,
	tags: [],
	people: [],
	metadata: { datetime: '2026-01-03T00:00:00.000Z' },
	deletedAt: null,
	createdAt: '2026-01-03T00:00:00.000Z'
};

vi.mock('../+page.server', () => ({
	photoService: {
		getPhoto: vi.fn((id: string) => {
			if (id === publicPhoto.id) return publicPhoto;
			if (id === sharedPhoto.id) return sharedPhoto;
			if (id === privatePhoto.id) return privatePhoto;
			return undefined;
		}),
		favoritePhoto: vi.fn((id: string, fav: boolean) => ({
			...publicPhoto,
			id,
			favorite: fav
		})),
		deletePhoto: vi.fn()
	},
	getVisiblePhotos: vi.fn(() => [publicPhoto, sharedPhoto, privatePhoto])
}));

describe('Photo detail load', () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it('returns photo and adjacent IDs for public photo (no auth)', async () => {
		const { load } = await import('./+page.server');
		const result = await load({
			params: { id: 'pub-1' },
			locals: { user: null, session: null }
		} as never);

		expect(result.photo.id).toBe('pub-1');
	});

	it('throws 404 for non-existent photo', async () => {
		const { load } = await import('./+page.server');
		await expect(
			load({ params: { id: 'does-not-exist' }, locals: { user: null, session: null } } as never)
		).rejects.toMatchObject({ status: 404 });
	});

	it('throws 403 for private photo when not authenticated', async () => {
		const { load } = await import('./+page.server');
		await expect(
			load({ params: { id: 'priv-1' }, locals: { user: null, session: null } } as never)
		).rejects.toMatchObject({ status: 403 });
	});

	it('allows owner to access private photo', async () => {
		const { load } = await import('./+page.server');
		const result = await load({
			params: { id: 'priv-1' },
			locals: { user: { id: 'owner', role: 'owner' }, session: null }
		} as never);
		expect(result.photo.id).toBe('priv-1');
	});

	it('throws 403 for shared photo when viewer is not in people list', async () => {
		const { load } = await import('./+page.server');
		await expect(
			load({
				params: { id: 'shared-1' },
				locals: { user: { id: 'unknown-viewer', role: 'viewer' }, session: null }
			} as never)
		).rejects.toMatchObject({ status: 403 });
	});

	it('allows tagged viewer to access shared photo', async () => {
		const { load } = await import('./+page.server');
		const result = await load({
			params: { id: 'shared-1' },
			locals: { user: { id: 'viewer-1', role: 'viewer' }, session: null }
		} as never);
		expect(result.photo.id).toBe('shared-1');
	});

	it('returns prevId and nextId', async () => {
		const { load } = await import('./+page.server');
		const result = await load({
			params: { id: 'shared-1' },
			locals: { user: { id: 'viewer-1', role: 'viewer' }, session: null }
		} as never);
		expect(result).toHaveProperty('prevId');
		expect(result).toHaveProperty('nextId');
	});
});
