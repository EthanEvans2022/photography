import { render } from 'vitest-browser-svelte';
import { describe, it, expect } from 'vitest';
import { page } from '@vitest/browser/context';
import UserWidget from './UserWidget.svelte';

const mockUser = {
	id: 'user-1',
	displayName: 'Jane Doe',
	username: 'janedoe',
	role: 'owner'
};

describe('UserWidget — logged out', () => {
	it('shows Welcome heading', async () => {
		render(UserWidget, { user: null });
		await expect.element(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
	});

	it('shows Sign in link to /login', async () => {
		render(UserWidget, { user: null });
		const signIn = page.getByRole('link', { name: 'Sign in' });
		await expect.element(signIn).toBeVisible();
		await expect.element(signIn).toHaveAttribute('href', '/login');
	});

	it('shows Create account link', async () => {
		render(UserWidget, { user: null });
		await expect.element(page.getByRole('link', { name: 'Create account' })).toBeVisible();
	});

	it('does not show user display name', async () => {
		render(UserWidget, { user: null });
		expect(page.getByText('Jane Doe').query()).toBeNull();
	});
});

describe('UserWidget — logged in', () => {
	it('shows user display name', async () => {
		render(UserWidget, { user: mockUser });
		await expect.element(page.getByText('Jane Doe')).toBeVisible();
	});

	it('shows username with @ prefix', async () => {
		render(UserWidget, { user: mockUser });
		await expect.element(page.getByText('@janedoe')).toBeVisible();
	});

	it('shows the user role', async () => {
		render(UserWidget, { user: mockUser });
		await expect.element(page.getByText('owner')).toBeVisible();
	});

	it('shows initials in avatar', async () => {
		render(UserWidget, { user: mockUser });
		await expect.element(page.getByText('JD')).toBeVisible();
	});

	it('shows My Photos link', async () => {
		render(UserWidget, { user: mockUser });
		await expect.element(page.getByRole('link', { name: 'My Photos' })).toBeVisible();
	});

	it('does not show Welcome heading', async () => {
		render(UserWidget, { user: mockUser });
		expect(page.getByRole('heading', { name: 'Welcome' }).query()).toBeNull();
	});

	it('computes initials for single-word name', async () => {
		render(UserWidget, { user: { ...mockUser, displayName: 'Madonna' } });
		await expect.element(page.getByText('MA')).toBeVisible();
	});
});
