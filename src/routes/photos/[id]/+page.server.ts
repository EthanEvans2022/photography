import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import LocalPhotoService from '$lib/server/services/photos/LocalPhotoService';

const photoService = new LocalPhotoService();

export const load: PageServerLoad = ({ params }) => {
	const photo = photoService.getPhoto(params.id);
	if (!photo) {
		error(404, 'Photo not found');
	}
	return { photo };
};
