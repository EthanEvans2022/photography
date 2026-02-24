import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	it('should render h1', async () => {
		render(Page, { data: { previewPhotos: [], user: null } });

		const heading = page.getByRole('heading', { level: 2, name: 'Photos' });
		await expect.element(heading).toBeInTheDocument();
	});
});
