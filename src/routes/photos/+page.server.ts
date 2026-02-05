import type { PageServerLoad } from './$types';
import LocalPhotoService from '$lib/server/services/photos/LocalPhotoService';

const photoService = new LocalPhotoService();

export const load: PageServerLoad = () => {
	return {
		photos: photoService.getPhotos()
	};
};
