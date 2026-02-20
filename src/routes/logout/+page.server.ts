import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import * as auth from '$lib/server/auth';

export const actions: Actions = {
	default: async (event) => {
		if (event.locals.session) {
			await auth.invalidateSession(event.locals.session.id);
		}
		auth.deleteSessionTokenCookie(event);
		redirect(302, '/');
	}
};
