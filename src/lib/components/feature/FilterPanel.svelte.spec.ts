import { render } from 'vitest-browser-svelte';
import { describe, it, expect } from 'vitest';
import { page } from '@vitest/browser/context';
import FilterPanel from './FilterPanel.svelte';

const allTags = ['landscape', 'nature', 'portrait', 'wildlife'];
const allPeople = ['alice', 'bob', 'carol'];

describe('FilterPanel', () => {
	it('renders date range inputs', async () => {
		render(FilterPanel, { allTags, allPeople, isAuthenticated: false });
		await expect.element(page.getByRole('textbox', { name: /Date from/i })).toBeVisible();
		await expect.element(page.getByRole('textbox', { name: /Date to/i })).toBeVisible();
	});

	it('renders Tags section', async () => {
		render(FilterPanel, { allTags, allPeople, isAuthenticated: false });
		await expect.element(page.getByText('Tags')).toBeVisible();
	});

	it('shows empty-tags placeholder when no tags selected', async () => {
		render(FilterPanel, { allTags, allPeople, isAuthenticated: false });
		await expect.element(page.getByText('No tags selected')).toBeVisible();
	});

	it('hides People section when not authenticated', async () => {
		render(FilterPanel, { allTags, allPeople, isAuthenticated: false });
		expect(page.getByText('People').query()).toBeNull();
	});

	it('shows People section when authenticated', async () => {
		render(FilterPanel, { allTags, allPeople, isAuthenticated: true });
		await expect.element(page.getByText('People')).toBeVisible();
	});

	it('shows empty-people placeholder when authenticated and no people selected', async () => {
		render(FilterPanel, { allTags, allPeople, isAuthenticated: true });
		await expect.element(page.getByText('No people selected')).toBeVisible();
	});

	it('shows tag search input after clicking add button', async () => {
		render(FilterPanel, { allTags, allPeople, isAuthenticated: false });
		const addBtn = page.getByRole('button', { name: /Add tag filter/i });
		await addBtn.click();
		await expect.element(page.getByRole('textbox', { name: /Tag search/i })).toBeVisible();
	});

	it('shows tag autocomplete suggestions while typing', async () => {
		render(FilterPanel, { allTags, allPeople, isAuthenticated: false });
		await page.getByRole('button', { name: /Add tag filter/i }).click();
		await page.getByRole('textbox', { name: /Tag search/i }).fill('land');
		await expect.element(page.getByRole('option', { name: 'landscape' })).toBeVisible();
	});

	it('shows no-results message when search has no matches', async () => {
		render(FilterPanel, { allTags, allPeople, isAuthenticated: false });
		await page.getByRole('button', { name: /Add tag filter/i }).click();
		await page.getByRole('textbox', { name: /Tag search/i }).fill('zzz');
		await expect.element(page.getByText('No matching tags')).toBeVisible();
	});

	it('renders clear-all button', async () => {
		render(FilterPanel, { allTags, allPeople, isAuthenticated: false });
		await expect.element(page.getByRole('button', { name: /Clear all filters/i })).toBeVisible();
	});
});
