import { hash, verify } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) redirect(302, '/');
	return { tab: event.url.searchParams.get('tab') ?? 'login' };
};

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (!validateUsername(username)) {
			return fail(400, {
				tab: 'login',
				message: 'Invalid username (3–31 characters, letters/numbers/underscore/dash only)'
			});
		}
		if (!validatePassword(password)) {
			return fail(400, { tab: 'login', message: 'Password must be 6–255 characters' });
		}

		const [existingUser] = await db
			.select()
			.from(table.user)
			.where(eq(table.user.username, username));

		if (!existingUser) {
			return fail(400, { tab: 'login', message: 'Incorrect username or password' });
		}

		const validPassword = await verify(existingUser.passwordHash, password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		if (!validPassword) {
			return fail(400, { tab: 'login', message: 'Incorrect username or password' });
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		redirect(302, '/');
	},

	register: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');
		const displayName = formData.get('displayName') ?? username;

		if (!validateUsername(username)) {
			return fail(400, { tab: 'register', message: 'Invalid username' });
		}
		if (!validatePassword(password)) {
			return fail(400, { tab: 'register', message: 'Password must be 6–255 characters' });
		}

		const userId = generateUserId();
		const passwordHash = await hash(password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		try {
			await db.insert(table.user).values({
				id: userId,
				username,
				passwordHash,
				displayName: String(displayName ?? username),
				email: `${username}@placeholder.local`,
				role: 'viewer'
			});

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, userId);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch {
			return fail(500, { tab: 'register', message: 'Username may already be taken' });
		}

		redirect(302, '/');
	}
};

function generateUserId() {
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	return encodeBase32LowerCase(bytes);
}

function validateUsername(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[a-z0-9_-]+$/.test(username)
	);
}

function validatePassword(password: unknown): password is string {
	return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}
