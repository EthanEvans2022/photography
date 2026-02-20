import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { photoService, getVisiblePhotos } from '../+page.server';

export const load: PageServerLoad = ({ locals }) => {
	if (!locals.user) error(403, 'Sign in to view albums');

	const allAlbums = photoService.getAlbums();

	// Filter albums by visibility
	const visibleAlbums = allAlbums.filter((album) => {
		if (album.visibility === 'public') return true;
		if (!locals.user) return false;
		if (locals.user.role === 'owner') return true;
		// Viewer: only public or shared albums
		return album.visibility === 'shared';
	});

	// Enrich with photo count and cover photo src
	const albums = visibleAlbums.map((album) => {
		const albumData = photoService.getAlbum(album.id);
		const visiblePhotos = albumData
			? albumData.photos.filter((p) => {
					if (p.visibility === 'public') return true;
					if (!locals.user) return false;
					if (locals.user.role === 'owner') return true;
					return p.visibility === 'shared' && p.people.includes(locals.user!.id);
				})
			: [];

		const coverSrc = album.coverPhotoId
			? photoService.getPhoto(album.coverPhotoId)?.src ?? null
			: null;

		return { ...album, photoCount: visiblePhotos.length, coverSrc };
	});

	return { albums };
};
