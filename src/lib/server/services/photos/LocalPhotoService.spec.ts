import { describe, it, expect, beforeEach } from 'vitest';
import LocalPhotoService from './LocalPhotoService';
import type { Photo } from '$lib/types/photo';

function makePhoto(overrides: Partial<Photo> & { id: string }): Photo {
	return {
		src: `/photos/${overrides.id}.jpg`,
		ownerId: 'user-1',
		favorite: false,
		visibility: 'public',
		tags: [],
		people: [],
		metadata: { datetime: '2026-01-15T12:00:00.000Z' },
		deletedAt: null,
		createdAt: '2026-01-15T12:00:00.000Z',
		...overrides
	};
}

const SEED_PHOTOS: Photo[] = [
	makePhoto({
		id: 'photo-1',
		metadata: { datetime: '2026-01-10T10:00:00.000Z' },
		createdAt: '2026-01-10T10:00:00.000Z',
		tags: ['landscape', 'nature'],
		people: ['user-2'],
		visibility: 'public'
	}),
	makePhoto({
		id: 'photo-2',
		metadata: { datetime: '2026-01-12T14:00:00.000Z' },
		createdAt: '2026-01-12T14:00:00.000Z',
		tags: ['portrait'],
		people: ['user-3'],
		visibility: 'shared',
		favorite: true
	}),
	makePhoto({
		id: 'photo-3',
		metadata: { datetime: '2026-01-15T08:00:00.000Z' },
		createdAt: '2026-01-15T08:00:00.000Z',
		tags: ['nature', 'wildlife'],
		people: ['user-2', 'user-3'],
		visibility: 'private'
	}),
	makePhoto({
		id: 'photo-4',
		metadata: { datetime: '2026-01-08T09:00:00.000Z' },
		createdAt: '2026-01-08T09:00:00.000Z',
		tags: ['landscape'],
		visibility: 'public'
	})
];

function freshPhotos(): Photo[] {
	return SEED_PHOTOS.map((p) => ({ ...p, tags: [...p.tags], people: [...p.people], metadata: { ...p.metadata } }));
}

// ============================================================
// Photo CRUD
// ============================================================

describe('LocalPhotoService — Photo CRUD', () => {
	let svc: LocalPhotoService;

	beforeEach(() => {
		svc = new LocalPhotoService(freshPhotos());
	});

	it('getPhotos returns all non-deleted photos sorted newest-first', () => {
		const photos = svc.getPhotos();
		expect(photos).toHaveLength(4);
		expect(photos[0].id).toBe('photo-3');
		expect(photos[1].id).toBe('photo-2');
		expect(photos[2].id).toBe('photo-1');
		expect(photos[3].id).toBe('photo-4');
	});

	it('getPhoto returns a photo by id', () => {
		const photo = svc.getPhoto('photo-1');
		expect(photo).toBeDefined();
		expect(photo!.id).toBe('photo-1');
	});

	it('getPhoto returns undefined for non-existent id', () => {
		expect(svc.getPhoto('does-not-exist')).toBeUndefined();
	});

	it('getPhoto returns undefined for a deleted photo', () => {
		svc.deletePhoto('photo-1');
		expect(svc.getPhoto('photo-1')).toBeUndefined();
	});

	it('favoritePhoto sets favorite to true', () => {
		const result = svc.favoritePhoto('photo-1', true);
		expect(result).toBeDefined();
		expect(result!.favorite).toBe(true);
		expect(svc.getPhoto('photo-1')!.favorite).toBe(true);
	});

	it('favoritePhoto sets favorite to false', () => {
		const result = svc.favoritePhoto('photo-2', false);
		expect(result).toBeDefined();
		expect(result!.favorite).toBe(false);
	});

	it('favoritePhoto returns undefined for non-existent photo', () => {
		expect(svc.favoritePhoto('nope', true)).toBeUndefined();
	});

	it('favoritePhoto returns undefined for deleted photo', () => {
		svc.deletePhoto('photo-1');
		expect(svc.favoritePhoto('photo-1', true)).toBeUndefined();
	});

	it('deletePhoto soft-deletes and returns the photo', () => {
		const result = svc.deletePhoto('photo-1');
		expect(result).toBeDefined();
		expect(result!.deletedAt).not.toBeNull();
		expect(svc.getPhotos()).toHaveLength(3);
	});

	it('deletePhoto returns undefined for non-existent photo', () => {
		expect(svc.deletePhoto('nope')).toBeUndefined();
	});

	it('deletePhoto returns undefined for already-deleted photo', () => {
		svc.deletePhoto('photo-1');
		expect(svc.deletePhoto('photo-1')).toBeUndefined();
	});

	it('restorePhoto restores a deleted photo', () => {
		svc.deletePhoto('photo-1');
		const result = svc.restorePhoto('photo-1');
		expect(result).toBeDefined();
		expect(result!.deletedAt).toBeNull();
		expect(svc.getPhotos()).toHaveLength(4);
	});

	it('restorePhoto returns undefined for non-deleted photo', () => {
		expect(svc.restorePhoto('photo-1')).toBeUndefined();
	});

	it('restorePhoto returns undefined for non-existent photo', () => {
		expect(svc.restorePhoto('nope')).toBeUndefined();
	});

	it('getDeletedPhotos returns only deleted photos', () => {
		expect(svc.getDeletedPhotos()).toHaveLength(0);
		svc.deletePhoto('photo-1');
		svc.deletePhoto('photo-2');
		const deleted = svc.getDeletedPhotos();
		expect(deleted).toHaveLength(2);
		expect(deleted.map((p) => p.id).sort()).toEqual(['photo-1', 'photo-2']);
	});
});

// ============================================================
// Filtering
// ============================================================

describe('LocalPhotoService — Filtering', () => {
	let svc: LocalPhotoService;

	beforeEach(() => {
		svc = new LocalPhotoService(freshPhotos());
	});

	it('filters by favorite', () => {
		const favs = svc.getPhotos({ favorite: true });
		expect(favs).toHaveLength(1);
		expect(favs[0].id).toBe('photo-2');
	});

	it('filters by non-favorite', () => {
		const nonFavs = svc.getPhotos({ favorite: false });
		expect(nonFavs).toHaveLength(3);
	});

	it('filters by dateFrom', () => {
		const result = svc.getPhotos({ dateFrom: '2026-01-12T00:00:00.000Z' });
		expect(result).toHaveLength(2);
		expect(result.map((p) => p.id)).toEqual(['photo-3', 'photo-2']);
	});

	it('filters by dateTo', () => {
		const result = svc.getPhotos({ dateTo: '2026-01-11T00:00:00.000Z' });
		expect(result).toHaveLength(2);
		expect(result.map((p) => p.id)).toEqual(['photo-1', 'photo-4']);
	});

	it('filters by date range', () => {
		const result = svc.getPhotos({
			dateFrom: '2026-01-09T00:00:00.000Z',
			dateTo: '2026-01-13T00:00:00.000Z'
		});
		expect(result).toHaveLength(2);
		expect(result.map((p) => p.id)).toEqual(['photo-2', 'photo-1']);
	});

	it('filters by tags', () => {
		const result = svc.getPhotos({ tags: ['nature'] });
		expect(result).toHaveLength(2);
		expect(result.map((p) => p.id)).toEqual(['photo-3', 'photo-1']);
	});

	it('filters by tags matches any (OR logic)', () => {
		const result = svc.getPhotos({ tags: ['portrait', 'wildlife'] });
		expect(result).toHaveLength(2);
		expect(result.map((p) => p.id)).toEqual(['photo-3', 'photo-2']);
	});

	it('filters by people', () => {
		const result = svc.getPhotos({ people: ['user-2'] });
		expect(result).toHaveLength(2);
		expect(result.map((p) => p.id)).toEqual(['photo-3', 'photo-1']);
	});

	it('filters by visibility', () => {
		const result = svc.getPhotos({ visibility: 'public' });
		expect(result).toHaveLength(2);
		expect(result.map((p) => p.id)).toEqual(['photo-1', 'photo-4']);
	});

	it('combines multiple filters', () => {
		const result = svc.getPhotos({ tags: ['nature'], visibility: 'public' });
		expect(result).toHaveLength(1);
		expect(result[0].id).toBe('photo-1');
	});

	it('returns empty for no matches', () => {
		const result = svc.getPhotos({ tags: ['nonexistent'] });
		expect(result).toHaveLength(0);
	});

	it('excludes deleted photos from filtered results', () => {
		svc.deletePhoto('photo-1');
		const result = svc.getPhotos({ tags: ['nature'] });
		expect(result).toHaveLength(1);
		expect(result[0].id).toBe('photo-3');
	});
});

// ============================================================
// Album CRUD
// ============================================================

describe('LocalPhotoService — Album CRUD', () => {
	let svc: LocalPhotoService;

	beforeEach(() => {
		svc = new LocalPhotoService(freshPhotos());
	});

	it('createAlbum creates an album with default visibility', () => {
		const album = svc.createAlbum('Vacation', 'user-1');
		expect(album.name).toBe('Vacation');
		expect(album.ownerId).toBe('user-1');
		expect(album.visibility).toBe('private');
		expect(album.coverPhotoId).toBeNull();
		expect(album.id).toBeDefined();
		expect(album.createdAt).toBeDefined();
	});

	it('createAlbum with explicit visibility', () => {
		const album = svc.createAlbum('Public Album', 'user-1', 'public');
		expect(album.visibility).toBe('public');
	});

	it('getAlbums returns all albums', () => {
		expect(svc.getAlbums()).toHaveLength(0);
		svc.createAlbum('A', 'user-1');
		svc.createAlbum('B', 'user-1');
		expect(svc.getAlbums()).toHaveLength(2);
	});

	it('getAlbum returns album with its photos', () => {
		const album = svc.createAlbum('Test', 'user-1');
		svc.addToAlbum(album.id, 'photo-1');
		svc.addToAlbum(album.id, 'photo-2');
		const result = svc.getAlbum(album.id);
		expect(result).toBeDefined();
		expect(result!.photos).toHaveLength(2);
		expect(result!.photos.map((p) => p.id).sort()).toEqual(['photo-1', 'photo-2']);
	});

	it('getAlbum returns undefined for non-existent album', () => {
		expect(svc.getAlbum('nope')).toBeUndefined();
	});

	it('getAlbum excludes deleted photos', () => {
		const album = svc.createAlbum('Test', 'user-1');
		svc.addToAlbum(album.id, 'photo-1');
		svc.addToAlbum(album.id, 'photo-2');
		svc.deletePhoto('photo-1');
		const result = svc.getAlbum(album.id);
		expect(result!.photos).toHaveLength(1);
		expect(result!.photos[0].id).toBe('photo-2');
	});

	it('deleteAlbum removes the album', () => {
		const album = svc.createAlbum('Test', 'user-1');
		svc.deleteAlbum(album.id);
		expect(svc.getAlbums()).toHaveLength(0);
		expect(svc.getAlbum(album.id)).toBeUndefined();
	});

	it('addToAlbum sets cover photo on first add', () => {
		const album = svc.createAlbum('Test', 'user-1');
		svc.addToAlbum(album.id, 'photo-1');
		const result = svc.getAlbum(album.id);
		expect(result!.coverPhotoId).toBe('photo-1');
	});

	it('addToAlbum does not duplicate photos', () => {
		const album = svc.createAlbum('Test', 'user-1');
		svc.addToAlbum(album.id, 'photo-1');
		svc.addToAlbum(album.id, 'photo-1');
		const result = svc.getAlbum(album.id);
		expect(result!.photos).toHaveLength(1);
	});

	it('addToAlbum does nothing for non-existent album', () => {
		svc.addToAlbum('nope', 'photo-1');
		// no error thrown
		expect(svc.getAlbums()).toHaveLength(0);
	});

	it('removeFromAlbum removes a photo', () => {
		const album = svc.createAlbum('Test', 'user-1');
		svc.addToAlbum(album.id, 'photo-1');
		svc.addToAlbum(album.id, 'photo-2');
		svc.removeFromAlbum(album.id, 'photo-1');
		const result = svc.getAlbum(album.id);
		expect(result!.photos).toHaveLength(1);
		expect(result!.photos[0].id).toBe('photo-2');
	});

	it('removeFromAlbum updates cover when removing current cover', () => {
		const album = svc.createAlbum('Test', 'user-1');
		svc.addToAlbum(album.id, 'photo-1');
		svc.addToAlbum(album.id, 'photo-2');
		svc.removeFromAlbum(album.id, 'photo-1');
		const result = svc.getAlbum(album.id);
		expect(result!.coverPhotoId).toBe('photo-2');
	});

	it('removeFromAlbum sets cover to null when album becomes empty', () => {
		const album = svc.createAlbum('Test', 'user-1');
		svc.addToAlbum(album.id, 'photo-1');
		svc.removeFromAlbum(album.id, 'photo-1');
		const result = svc.getAlbum(album.id);
		expect(result!.coverPhotoId).toBeNull();
		expect(result!.photos).toHaveLength(0);
	});

	it('removeFromAlbum does nothing for non-existent album', () => {
		svc.removeFromAlbum('nope', 'photo-1');
		// no error thrown
		expect(svc.getAlbums()).toHaveLength(0);
	});
});

// ============================================================
// Lookup helpers
// ============================================================

describe('LocalPhotoService — Lookup helpers', () => {
	let svc: LocalPhotoService;

	beforeEach(() => {
		svc = new LocalPhotoService(freshPhotos());
	});

	it('getAllTags returns unique sorted tags', () => {
		const tags = svc.getAllTags();
		expect(tags).toEqual(['landscape', 'nature', 'portrait', 'wildlife']);
	});

	it('getAllTags excludes tags from deleted photos', () => {
		svc.deletePhoto('photo-3'); // has 'nature', 'wildlife'
		const tags = svc.getAllTags();
		expect(tags).toEqual(['landscape', 'nature', 'portrait']);
	});

	it('getAllTags returns empty when no photos', () => {
		const svc2 = new LocalPhotoService([]);
		expect(svc2.getAllTags()).toEqual([]);
	});

	it('getAllPeople returns unique sorted people', () => {
		const people = svc.getAllPeople();
		expect(people).toEqual(['user-2', 'user-3']);
	});

	it('getAllPeople excludes people from deleted photos', () => {
		svc.deletePhoto('photo-1'); // has user-2
		svc.deletePhoto('photo-2'); // has user-3
		// photo-3 still has user-2 and user-3
		const people = svc.getAllPeople();
		expect(people).toEqual(['user-2', 'user-3']);
	});

	it('getAllPeople returns empty when all photos with people are deleted', () => {
		svc.deletePhoto('photo-1');
		svc.deletePhoto('photo-2');
		svc.deletePhoto('photo-3');
		// photo-4 has no people
		expect(svc.getAllPeople()).toEqual([]);
	});

	it('getAllPeople returns empty when no photos', () => {
		const svc2 = new LocalPhotoService([]);
		expect(svc2.getAllPeople()).toEqual([]);
	});
});
