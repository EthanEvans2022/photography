import type { Photo, Album, Visibility } from '$lib/types/photo';

export interface PhotoFilters {
	dateFrom?: string;
	dateTo?: string;
	tags?: string[];
	people?: string[];
	favorite?: boolean;
	visibility?: Visibility;
}

export default interface IPhotoService {
	// Photos
	getPhotos(filters?: PhotoFilters): Photo[];
	getPhoto(id: string): Photo | undefined;
	favoritePhoto(id: string, favorite: boolean): Photo | undefined;
	deletePhoto(id: string): Photo | undefined;
	restorePhoto(id: string): Photo | undefined;
	getDeletedPhotos(): Photo[];

	// Albums
	getAlbums(): Album[];
	getAlbum(id: string): (Album & { photos: Photo[] }) | undefined;
	createAlbum(name: string, ownerId: string, visibility?: Visibility): Album;
	deleteAlbum(id: string): void;
	addToAlbum(albumId: string, photoId: string): void;
	removeFromAlbum(albumId: string, photoId: string): void;

	// Lookup helpers
	getAllTags(): string[];
	getAllPeople(): string[];
}
