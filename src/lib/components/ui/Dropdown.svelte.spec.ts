import { render } from 'vitest-browser-svelte';
import { describe, it, expect } from 'vitest';
import { page } from '@vitest/browser/context';
import { createRawSnippet } from 'svelte';
import Dropdown from './Dropdown.svelte';

function makeSnippet(html: string) {
	return createRawSnippet(() => ({
		render: () => html,
		setup: () => {}
	}));
}

describe('Dropdown', () => {
	it('renders the trigger content', async () => {
		const trigger = makeSnippet('<span>Open Menu</span>');
		const children = makeSnippet('<div>Item</div>');

		render(Dropdown, { trigger, children });

		await expect.element(page.getByText('Open Menu')).toBeVisible();
	});

	it('menu is hidden initially', async () => {
		const trigger = makeSnippet('<span>Trigger</span>');
		const children = makeSnippet('<div data-testid="menu-item">Hidden Item</div>');

		render(Dropdown, { trigger, children });

		expect(page.getByTestId('menu-item').query()).toBeNull();
	});

	it('opens the menu when trigger is clicked', async () => {
		const trigger = makeSnippet('<span>Open</span>');
		const children = makeSnippet('<div data-testid="menu-content">Visible Item</div>');

		render(Dropdown, { trigger, children });

		await page.getByText('Open').click();

		await expect.element(page.getByTestId('menu-content')).toBeVisible();
	});

	it('closes the menu when trigger is clicked again', async () => {
		const trigger = makeSnippet('<span>Toggle</span>');
		const children = makeSnippet('<div data-testid="toggle-item">Item</div>');

		render(Dropdown, { trigger, children });

		await page.getByText('Toggle').click();
		await expect.element(page.getByTestId('toggle-item')).toBeVisible();

		await page.getByText('Toggle').click();
		expect(page.getByTestId('toggle-item').query()).toBeNull();
	});

	it('sets aria-expanded on trigger', async () => {
		const trigger = makeSnippet('<span>Aria</span>');
		const children = makeSnippet('<div>Content</div>');

		render(Dropdown, { trigger, children });

		const triggerBtn = page.getByRole('button');
		await expect.element(triggerBtn).toHaveAttribute('aria-expanded', 'false');

		await triggerBtn.click();
		await expect.element(triggerBtn).toHaveAttribute('aria-expanded', 'true');
	});
});
