import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { photoService, getVisiblePhotos } from '../+page.server';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const load: PageServerLoad = ({ params, locals }) => {
	const photo = photoService.getPhoto(params.id);
	if (!photo) error(404, 'Photo not found');

	// Access check
	if (photo.visibility === 'private') {
		if (!locals.user || locals.user.role !== 'owner') error(403, 'Forbidden');
	} else if (photo.visibility === 'shared') {
		if (!locals.user) error(403, 'Forbidden');
		if (locals.user.role !== 'owner' && !photo.people.includes(locals.user.id)) {
			error(403, 'Forbidden');
		}
	}

	// Find adjacent photo IDs in the auth-filtered list
	const allVisible = getVisiblePhotos(locals.user);
	const idx = allVisible.findIndex((p) => p.id === params.id);
	const prevId = idx > 0 ? allVisible[idx - 1].id : null;
	const nextId = idx < allVisible.length - 1 ? allVisible[idx + 1].id : null;

	return { photo, prevId, nextId };
};

export const actions: Actions = {
	favorite: async ({ params, locals }) => {
		if (!locals.user) error(401, 'Unauthorized');

		const photo = photoService.getPhoto(params.id);
		if (!photo) error(404, 'Photo not found');

		if (locals.user.role !== 'owner' && !photo.people.includes(locals.user.id)) {
			error(403, 'Forbidden');
		}

		const updated = photoService.favoritePhoto(params.id, !photo.favorite);
		return { photo: updated };
	},

	delete: async ({ params, locals }) => {
		if (!locals.user) error(401, 'Unauthorized');
		if (locals.user.role !== 'owner') error(403, 'Forbidden');

		photoService.deletePhoto(params.id);
		return { success: true, redirect: '/photos' };
	},

	download: async ({ params, locals }) => {
		const photo = photoService.getPhoto(params.id);
		if (!photo) error(404, 'Photo not found');

		// Check access
		if (photo.visibility === 'private') {
			if (!locals.user || locals.user.role !== 'owner') error(403, 'Forbidden');
		} else if (photo.visibility === 'shared') {
			if (!locals.user) error(403, 'Forbidden');
			if (locals.user.role !== 'owner' && !photo.people.includes(locals.user.id)) {
				error(403, 'Forbidden');
			}
		}

		const filename = photo.src.split('/').pop() ?? `${params.id}.jpg`;
		const filePath = join(process.cwd(), 'static', photo.src);

		try {
			const fileBuffer = await readFile(filePath);
			return new Response(fileBuffer, {
				headers: {
					'Content-Type': 'application/octet-stream',
					'Content-Disposition': `attachment; filename="${filename}"`
				}
			});
		} catch {
			error(404, 'File not found on disk');
		}
	}
};
