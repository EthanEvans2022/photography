import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { photoService } from '../../photo-utils.server';
import type { Photo } from '$lib/types/photo';

export const load: PageServerLoad = ({ params, locals }) => {
	const album = photoService.getAlbum(params.id);
	if (!album) error(404, 'Album not found');

	// Access check
	if (album.visibility === 'private') {
		if (!locals.user || locals.user.role !== 'owner') error(403, 'Forbidden');
	} else if (album.visibility === 'shared') {
		if (!locals.user) error(403, 'Forbidden');
	}

	// Filter photos within album by visibility
	const visiblePhotos: Photo[] = album.photos.filter((p) => {
		if (p.visibility === 'public') return true;
		if (!locals.user) return false;
		if (locals.user.role === 'owner') return true;
		return p.visibility === 'shared' && p.people.includes(locals.user!.id);
	});

	return { album: { ...album, photos: visiblePhotos } };
};
