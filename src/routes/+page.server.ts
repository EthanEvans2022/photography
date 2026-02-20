import type { PageServerLoad } from './$types';
import LocalPhotoService from '$lib/server/services/photos/LocalPhotoService';
import type { Photo } from '$lib/types/photo';

const photoService = new LocalPhotoService();

function getVisiblePhotos(user: { id: string; role: string } | null): Photo[] {
	if (!user) {
		return photoService.getPhotos({ visibility: 'public' });
	}
	if (user.role === 'owner') {
		return photoService.getPhotos();
	}
	// viewer: public + shared where user is tagged
	return photoService.getPhotos().filter(
		(p) =>
			p.visibility === 'public' ||
			(p.visibility === 'shared' && p.people.includes(user.id))
	);
}

export const load: PageServerLoad = ({ locals }) => {
	const photos = getVisiblePhotos(locals.user);
	return {
		previewPhotos: photos.slice(0, 8)
	};
};
