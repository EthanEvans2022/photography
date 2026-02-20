import { describe, it, expect, vi, beforeEach } from 'vitest';

const publicAlbum = {
	id: 'album-1',
	name: 'Public Album',
	ownerId: 'owner',
	coverPhotoId: null,
	visibility: 'public' as const,
	createdAt: '2026-01-01T00:00:00.000Z'
};

const sharedAlbum = {
	id: 'album-2',
	name: 'Shared Album',
	ownerId: 'owner',
	coverPhotoId: null,
	visibility: 'shared' as const,
	createdAt: '2026-01-01T00:00:00.000Z'
};

const privateAlbum = {
	id: 'album-3',
	name: 'Private Album',
	ownerId: 'owner',
	coverPhotoId: null,
	visibility: 'private' as const,
	createdAt: '2026-01-01T00:00:00.000Z'
};

vi.mock('../+page.server', () => ({
	photoService: {
		getAlbums: vi.fn(() => [publicAlbum, sharedAlbum, privateAlbum]),
		getAlbum: vi.fn((id: string) => {
			const album = [publicAlbum, sharedAlbum, privateAlbum].find((a) => a.id === id);
			if (!album) return undefined;
			return { ...album, photos: [] };
		}),
		getPhoto: vi.fn(() => undefined)
	},
	getVisiblePhotos: vi.fn(() => [])
}));

describe('Albums list load', () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it('throws 403 when not authenticated', async () => {
		const { load } = await import('./+page.server');
		await expect(
			load({ locals: { user: null, session: null } } as never)
		).rejects.toMatchObject({ status: 403 });
	});

	it('owner sees all albums', async () => {
		const { load } = await import('./+page.server');
		const result = await load({
			locals: { user: { id: 'owner', role: 'owner' }, session: null }
		} as never);
		expect(result.albums.length).toBe(3);
	});

	it('viewer sees only public and shared albums', async () => {
		const { load } = await import('./+page.server');
		const result = await load({
			locals: { user: { id: 'viewer-1', role: 'viewer' }, session: null }
		} as never);
		const ids = result.albums.map((a: { id: string }) => a.id);
		expect(ids).toContain('album-1');
		expect(ids).toContain('album-2');
		expect(ids).not.toContain('album-3');
	});
});

describe('Album detail load', () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it('throws 404 for non-existent album', async () => {
		const { load } = await import('./[id]/+page.server');
		await expect(
			load({
				params: { id: 'does-not-exist' },
				locals: { user: { id: 'owner', role: 'owner' }, session: null }
			} as never)
		).rejects.toMatchObject({ status: 404 });
	});

	it('throws 403 for private album when unauthenticated', async () => {
		const { load } = await import('./[id]/+page.server');
		await expect(
			load({
				params: { id: 'album-3' },
				locals: { user: null, session: null }
			} as never)
		).rejects.toMatchObject({ status: 403 });
	});

	it('owner can access private album', async () => {
		const { load } = await import('./[id]/+page.server');
		const result = await load({
			params: { id: 'album-3' },
			locals: { user: { id: 'owner', role: 'owner' }, session: null }
		} as never);
		expect(result.album.id).toBe('album-3');
	});

	it('public album accessible without auth', async () => {
		const { load } = await import('./[id]/+page.server');
		const result = await load({
			params: { id: 'album-1' },
			locals: { user: null, session: null }
		} as never);
		expect(result.album.id).toBe('album-1');
	});
});
