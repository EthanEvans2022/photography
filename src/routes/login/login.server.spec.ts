import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock all external dependencies
vi.mock('@node-rs/argon2', () => ({
	hash: vi.fn().mockResolvedValue('hashed-password'),
	verify: vi.fn().mockResolvedValue(true)
}));

vi.mock('@oslojs/encoding', () => ({
	encodeBase32LowerCase: vi.fn().mockReturnValue('generated-user-id')
}));

vi.mock('$lib/server/auth', () => ({
	generateSessionToken: vi.fn().mockReturnValue('session-token'),
	createSession: vi.fn().mockResolvedValue({ id: 'sess-id', expiresAt: new Date(Date.now() + 86400000) }),
	setSessionTokenCookie: vi.fn(),
	invalidateSession: vi.fn(),
	deleteSessionTokenCookie: vi.fn()
}));

const mockDbInsert = vi.fn();
const mockDbSelect = vi.fn();

vi.mock('$lib/server/db', () => ({
	db: {
		insert: vi.fn(() => ({ values: mockDbInsert })),
		select: vi.fn(() => ({
			from: vi.fn(() => ({
				where: mockDbSelect
			}))
		}))
	}
}));

vi.mock('$lib/server/db/schema', () => ({
	user: { username: 'username', id: 'id' }
}));

vi.mock('drizzle-orm', () => ({
	eq: vi.fn()
}));

describe('Login page load', () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it('redirects authenticated user away from login', async () => {
		const { load } = await import('./+page.server');
		await expect(
			load({
				locals: { user: { id: 'u1', role: 'owner' }, session: { id: 'sess' } },
				url: new URL('http://localhost/login')
			} as never)
		).rejects.toMatchObject({ status: 302 });
	});

	it('returns tab from query param', async () => {
		const { load } = await import('./+page.server');
		const result = await load({
			locals: { user: null, session: null },
			url: new URL('http://localhost/login?tab=register')
		} as never);
		expect(result.tab).toBe('register');
	});

	it('defaults to login tab', async () => {
		const { load } = await import('./+page.server');
		const result = await load({
			locals: { user: null, session: null },
			url: new URL('http://localhost/login')
		} as never);
		expect(result.tab).toBe('login');
	});
});

describe('Login action', () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it('returns fail for invalid username (too short)', async () => {
		const { actions } = await import('./+page.server');
		const formData = new FormData();
		formData.set('username', 'ab');
		formData.set('password', 'validpassword');

		const result = await actions.login({
			request: { formData: async () => formData } as never,
			locals: { user: null },
			cookies: { set: vi.fn() }
		} as never);

		expect(result).toMatchObject({ status: 400 });
	});

	it('returns fail for missing password', async () => {
		const { actions } = await import('./+page.server');
		const formData = new FormData();
		formData.set('username', 'validuser');
		formData.set('password', '123');

		const result = await actions.login({
			request: { formData: async () => formData } as never,
			locals: { user: null },
			cookies: { set: vi.fn() }
		} as never);

		expect(result).toMatchObject({ status: 400 });
	});

	it('returns fail when user does not exist', async () => {
		mockDbSelect.mockResolvedValueOnce([]);
		const { actions } = await import('./+page.server');
		const formData = new FormData();
		formData.set('username', 'unknownuser');
		formData.set('password', 'validpassword');

		const result = await actions.login({
			request: { formData: async () => formData } as never,
			locals: { user: null },
			cookies: { set: vi.fn() }
		} as never);

		expect(result).toMatchObject({ status: 400 });
	});
});

describe('Register action', () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it('returns fail for invalid username', async () => {
		const { actions } = await import('./+page.server');
		const formData = new FormData();
		formData.set('username', 'x'); // too short
		formData.set('password', 'validpassword');

		const result = await actions.register({
			request: { formData: async () => formData } as never,
			locals: { user: null },
			cookies: { set: vi.fn() }
		} as never);

		expect(result).toMatchObject({ status: 400 });
	});

	it('returns fail for short password', async () => {
		const { actions } = await import('./+page.server');
		const formData = new FormData();
		formData.set('username', 'validuser');
		formData.set('password', 'abc'); // too short

		const result = await actions.register({
			request: { formData: async () => formData } as never,
			locals: { user: null },
			cookies: { set: vi.fn() }
		} as never);

		expect(result).toMatchObject({ status: 400 });
	});

	it('returns fail when db insert throws (duplicate username)', async () => {
		mockDbInsert.mockRejectedValueOnce(new Error('unique constraint'));
		const { actions } = await import('./+page.server');
		const formData = new FormData();
		formData.set('username', 'existinguser');
		formData.set('password', 'validpassword');

		const result = await actions.register({
			request: { formData: async () => formData } as never,
			locals: { user: null },
			cookies: { set: vi.fn() }
		} as never);

		expect(result).toMatchObject({ status: 500 });
	});
});

describe('Logout action', () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it('invalidates session and redirects', async () => {
		const { actions } = await import('../logout/+page.server');
		const authMod = await import('$lib/server/auth');

		await expect(
			actions.default({
				locals: { session: { id: 'sess-123' }, user: { id: 'u1' } },
				cookies: { delete: vi.fn() }
			} as never)
		).rejects.toMatchObject({ status: 302 });

		expect(authMod.invalidateSession).toHaveBeenCalledWith('sess-123');
	});

	it('does not throw when no session exists', async () => {
		const { actions } = await import('../logout/+page.server');

		await expect(
			actions.default({
				locals: { session: null, user: null },
				cookies: { delete: vi.fn() }
			} as never)
		).rejects.toMatchObject({ status: 302 });
	});
});
