import { render } from 'vitest-browser-svelte';
import { describe, it, expect, vi } from 'vitest';
import { page } from '@vitest/browser/context';
import Tag from './Tag.svelte';

describe('Tag', () => {
	it('renders the label text', async () => {
		render(Tag, { label: 'landscape' });
		await expect.element(page.getByText('landscape')).toBeVisible();
	});

	it('does not render a remove button when onremove is not provided', async () => {
		render(Tag, { label: 'nature' });
		expect(page.getByRole('button').query()).toBeNull();
	});

	it('renders a remove button when onremove is provided', async () => {
		render(Tag, { label: 'nature', onremove: vi.fn() });
		await expect.element(page.getByRole('button', { name: /Remove nature/i })).toBeVisible();
	});

	it('calls onremove when the remove button is clicked', async () => {
		const onremove = vi.fn();
		render(Tag, { label: 'wildlife', onremove });
		await page.getByRole('button').click();
		expect(onremove).toHaveBeenCalledOnce();
	});
});
