import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { photoService, getVisiblePhotos } from '../+page.server';
import type { PhotoFilters } from '$lib/server/services/photos/IPhotoService';

const LIMIT = 50;

export const GET: RequestHandler = ({ url, locals }) => {
	const offset = parseInt(url.searchParams.get('offset') ?? '0');
	const limit = parseInt(url.searchParams.get('limit') ?? String(LIMIT));

	const filters: PhotoFilters = {};
	const dateFrom = url.searchParams.get('dateFrom');
	const dateTo = url.searchParams.get('dateTo');
	const tags = url.searchParams.getAll('tag');
	const people = url.searchParams.getAll('person');
	const favorites = url.searchParams.get('favorites');

	if (dateFrom) filters.dateFrom = new Date(dateFrom).toISOString();
	if (dateTo) filters.dateTo = new Date(dateTo).toISOString();
	if (tags.length > 0) filters.tags = tags;
	if (people.length > 0) filters.people = people;
	if (favorites === '1') filters.favorite = true;

	const allVisible = getVisiblePhotos(locals.user, filters);
	const photos = allVisible.slice(offset, offset + limit);
	const hasMore = offset + limit < allVisible.length;

	return json({ photos, hasMore });
};
