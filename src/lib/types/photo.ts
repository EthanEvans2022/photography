export type Visibility = 'public' | 'shared' | 'private';

export interface PhotoMetadata {
	datetime: string;
	location?: {
		longitude: number;
		latitude: number;
	};
}

export interface Photo {
	id: string;
	ownerId: string;
	src: string;
	favorite: boolean;
	visibility: Visibility;
	tags: string[];
	people: string[];
	metadata: PhotoMetadata;
	deletedAt: string | null;
	createdAt: string;
}

export type LocalPhoto = Omit<Photo, 'deletedAt' | 'createdAt'>;

export interface Album {
	id: string;
	name: string;
	ownerId: string;
	coverPhotoId: string | null;
	visibility: Visibility;
	createdAt: string;
}
