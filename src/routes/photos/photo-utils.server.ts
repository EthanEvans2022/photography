import LocalPhotoService from '$lib/server/services/photos/LocalPhotoService';
import type { Photo } from '$lib/types/photo';
import type { PhotoFilters } from '$lib/server/services/photos/IPhotoService';

export const photoService = new LocalPhotoService();

export function getVisiblePhotos(
	user: { id: string; role: string } | null,
	filters: PhotoFilters = {}
): Photo[] {
	if (!user) {
		return photoService.getPhotos({ ...filters, visibility: 'public' });
	}
	if (user.role === 'owner') {
		return photoService.getPhotos(filters);
	}
	// viewer: public + shared where user is tagged
	return photoService.getPhotos(filters).filter(
		(p) =>
			p.visibility === 'public' ||
			(p.visibility === 'shared' && p.people.includes(user.id))
	);
}
