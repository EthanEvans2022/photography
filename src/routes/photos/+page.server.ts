import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { PhotoFilters } from '$lib/server/services/photos/IPhotoService';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { photoService, getVisiblePhotos } from './photo-utils.server';

const LIMIT = 50;

function parseFilters(searchParams: URLSearchParams): PhotoFilters {
	const filters: PhotoFilters = {};
	const dateFrom = searchParams.get('dateFrom');
	const dateTo = searchParams.get('dateTo');
	const tags = searchParams.getAll('tag');
	const people = searchParams.getAll('person');
	const favorites = searchParams.get('favorites');

	if (dateFrom) filters.dateFrom = new Date(dateFrom).toISOString();
	if (dateTo) filters.dateTo = new Date(dateTo).toISOString();
	if (tags.length > 0) filters.tags = tags;
	if (people.length > 0) filters.people = people;
	if (favorites === '1') filters.favorite = true;

	return filters;
}

export const load: PageServerLoad = ({ locals, url }) => {
	const offset = parseInt(url.searchParams.get('offset') ?? '0');
	const filters = parseFilters(url.searchParams);

	const allVisible = getVisiblePhotos(locals.user, filters);
	const photos = allVisible.slice(offset, offset + LIMIT);
	const hasMore = offset + LIMIT < allVisible.length;

	return {
		photos,
		hasMore,
		totalCount: allVisible.length,
		allTags: photoService.getAllTags(),
		allPeople: photoService.getAllPeople()
	};
};

export const actions: Actions = {
	favorite: async ({ request, locals }) => {
		if (!locals.user) error(401, 'Unauthorized');

		const data = await request.formData();
		const ids = data.getAll('id') as string[];
		const setFavorite = data.get('favorite') === 'true';

		for (const id of ids) {
			const photo = photoService.getPhoto(id);
			if (!photo) continue;

			// Only owner or photo subject can favorite
			if (locals.user.role !== 'owner' && !photo.people.includes(locals.user.id)) {
				continue;
			}

			photoService.favoritePhoto(id, setFavorite);
		}

		return { success: true };
	},

	delete: async ({ request, locals }) => {
		if (!locals.user) error(401, 'Unauthorized');
		if (locals.user.role !== 'owner') error(403, 'Forbidden');

		const data = await request.formData();
		const ids = data.getAll('id') as string[];

		for (const id of ids) {
			photoService.deletePhoto(id);
		}

		return { success: true };
	},

	download: async ({ request, locals }) => {
		const data = await request.formData();
		const id = data.get('id') as string;

		const photo = photoService.getPhoto(id);
		if (!photo) error(404, 'Photo not found');

		// Check visibility access
		if (photo.visibility === 'private') {
			if (!locals.user || locals.user.role !== 'owner') error(403, 'Forbidden');
		} else if (photo.visibility === 'shared') {
			if (!locals.user) error(403, 'Forbidden');
			if (locals.user.role !== 'owner' && !photo.people.includes(locals.user.id)) {
				error(403, 'Forbidden');
			}
		}

		const filename = photo.src.split('/').pop() ?? `${id}.jpg`;
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
			error(404, 'File not found');
		}
	}
};
