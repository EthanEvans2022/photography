import { render } from 'vitest-browser-svelte';
import { describe, it, expect } from 'vitest';
import { page } from '@vitest/browser/context';
import Sidebar from './Sidebar.svelte';

describe('Sidebar', () => {
	it('renders nav links when open', async () => {
		render(Sidebar, { open: true });
		await expect.element(page.getByRole('link', { name: /Library/i })).toBeVisible();
		await expect.element(page.getByRole('link', { name: /Favorites/i })).toBeVisible();
		await expect.element(page.getByRole('link', { name: /Albums/i })).toBeVisible();
	});

	it('renders nothing when closed', async () => {
		render(Sidebar, { open: false });
		expect(page.getByRole('navigation').query()).toBeNull();
	});

	it('Library link points to /photos', async () => {
		render(Sidebar, { open: true });
		await expect
			.element(page.getByRole('link', { name: /Library/i }))
			.toHaveAttribute('href', '/photos');
	});

	it('Favorites link points to /photos?favorites=1', async () => {
		render(Sidebar, { open: true });
		await expect
			.element(page.getByRole('link', { name: /Favorites/i }))
			.toHaveAttribute('href', '/photos?favorites=1');
	});

	it('Albums link points to /photos/albums', async () => {
		render(Sidebar, { open: true });
		await expect
			.element(page.getByRole('link', { name: /Albums/i }))
			.toHaveAttribute('href', '/photos/albums');
	});
});
