import type IPhotoService from './IPhotoService';
import type { PhotoFilters } from './IPhotoService';
import type { Photo, LocalPhoto, Album, Visibility } from '$lib/types/photo';
import { env } from '$env/dynamic/private';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const PHOTOS_JSON = path.resolve(env.PHOTOS_JSON_PATH ?? 'static/photos/photos.json');

function loadPhotosFromFile(): Photo[] {
	if (!fs.existsSync(PHOTOS_JSON)) return [];
	const raw: LocalPhoto[] = JSON.parse(fs.readFileSync(PHOTOS_JSON, 'utf-8'));
	const seen = new Set<string>();
	return raw
		.filter((entry) => {
			if (seen.has(entry.id)) return false;
			seen.add(entry.id);
			return true;
		})
		.map((entry) => ({
			...entry,
			deletedAt: null,
			createdAt: entry.metadata.datetime
		}));
}

function applyFilters(list: Photo[], filters?: PhotoFilters): Photo[] {
	if (!filters) return list;

	return list.filter((p) => {
		if (filters.favorite !== undefined && p.favorite !== filters.favorite) return false;
		if (filters.dateFrom && p.metadata.datetime < filters.dateFrom) return false;
		if (filters.dateTo && p.metadata.datetime > filters.dateTo) return false;

		if (filters.tags?.length) {
			if (!filters.tags.some((t) => p.tags.includes(t))) return false;
		}
		if (filters.people?.length) {
			if (!filters.people.some((person) => p.people.includes(person))) return false;
		}
		if (filters.visibility && p.visibility !== filters.visibility) return false;

		return true;
	});
}

export default class LocalPhotoService implements IPhotoService {
	private photos: Photo[];
	private albums: (Album & { photoIds: string[] })[];

	constructor(initialPhotos?: Photo[]) {
		this.photos = initialPhotos ?? loadPhotosFromFile();
		this.albums = [];
	}

	// ── Photos ──────────────────────────────────────────

	getPhotos(filters?: PhotoFilters): Photo[] {
		const active = this.photos.filter((p) => !p.deletedAt);
		const filtered = applyFilters(active, filters);
		return filtered.sort((a, b) => {
			const dt =
				new Date(b.metadata.datetime).getTime() - new Date(a.metadata.datetime).getTime();
			return dt !== 0 ? dt : a.id.localeCompare(b.id);
		});
	}

	getPhoto(id: string): Photo | undefined {
		return this.photos.find((p) => p.id === id && !p.deletedAt);
	}

	favoritePhoto(id: string, favorite: boolean): Photo | undefined {
		const photo = this.getPhoto(id);
		if (!photo) return undefined;
		photo.favorite = favorite;
		return photo;
	}

	deletePhoto(id: string): Photo | undefined {
		const photo = this.getPhoto(id);
		if (!photo) return undefined;
		photo.deletedAt = new Date().toISOString();
		return photo;
	}

	restorePhoto(id: string): Photo | undefined {
		const photo = this.photos.find((p) => p.id === id && p.deletedAt);
		if (!photo) return undefined;
		photo.deletedAt = null;
		return photo;
	}

	getDeletedPhotos(): Photo[] {
		return this.photos.filter((p) => p.deletedAt !== null);
	}

	// ── Albums ──────────────────────────────────────────

	private findAlbum(id: string) {
		return this.albums.find((a) => a.id === id);
	}

	getAlbums(): Album[] {
		return this.albums.map(({ photoIds, ...album }) => album);
	}

	getAlbum(id: string): (Album & { photos: Photo[] }) | undefined {
		const album = this.findAlbum(id);
		if (!album) return undefined;
		const { photoIds, ...rest } = album;
		const albumPhotos = photoIds
			.map((pid) => this.photos.find((p) => p.id === pid && !p.deletedAt))
			.filter((p): p is Photo => p !== undefined);
		return { ...rest, photos: albumPhotos };
	}

	createAlbum(name: string, ownerId: string, visibility: Visibility = 'private'): Album {
		const album = {
			id: crypto.randomUUID(),
			name,
			ownerId,
			coverPhotoId: null,
			visibility,
			createdAt: new Date().toISOString(),
			photoIds: [] as string[]
		};
		this.albums.push(album);
		const { photoIds, ...rest } = album;
		return rest;
	}

	deleteAlbum(id: string): void {
		this.albums = this.albums.filter((a) => a.id !== id);
	}

	addToAlbum(albumId: string, photoId: string): void {
		const album = this.findAlbum(albumId);
		if (!album) return;
		if (!album.photoIds.includes(photoId)) {
			album.photoIds.push(photoId);
		}
		if (!album.coverPhotoId) {
			album.coverPhotoId = photoId;
		}
	}

	removeFromAlbum(albumId: string, photoId: string): void {
		const album = this.findAlbum(albumId);
		if (!album) return;
		album.photoIds = album.photoIds.filter((id) => id !== photoId);
		if (album.coverPhotoId === photoId) {
			album.coverPhotoId = album.photoIds[0] ?? null;
		}
	}

	// ── Lookup helpers ──────────────────────────────────

	getAllTags(): string[] {
		const tags = new Set<string>();
		for (const p of this.photos) {
			if (!p.deletedAt) p.tags.forEach((t) => tags.add(t));
		}
		return [...tags].sort();
	}

	getAllPeople(): string[] {
		const people = new Set<string>();
		for (const p of this.photos) {
			if (!p.deletedAt) p.people.forEach((person) => people.add(person));
		}
		return [...people].sort();
	}
}
