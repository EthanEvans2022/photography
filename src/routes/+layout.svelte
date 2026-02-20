<script lang="ts">
	import '@fontsource/inter/400.css';
	import '@fontsource/inter/500.css';
	import '@fontsource/inter/600.css';
	import '../app.css';
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import favicon from '$lib/assets/favicon.svg';
	import Dropdown from '$lib/components/ui/Dropdown.svelte';
	import { Grid, User, LogOut, Settings, ChevronRight } from 'lucide-svelte';
	import type { LayoutData } from './$types';

	let { children, data }: { children: import('svelte').Snippet; data: LayoutData } = $props();

	const SEGMENT_LABELS: Record<string, string> = {
		photos: 'Photos',
		albums: 'Albums',
		login: 'Login',
		demo: 'Demo'
	};

	const breadcrumbs = $derived.by(() => {
		const segments = page.url.pathname.split('/').filter(Boolean);
		const crumbs: { label: string; href: string }[] = [{ label: 'HomeHub', href: '/' }];
		let path = '';
		for (const seg of segments) {
			path += `/${seg}`;
			crumbs.push({ label: SEGMENT_LABELS[seg] ?? seg, href: path });
		}
		return crumbs;
	});

	const isLoginPage = $derived(page.url.pathname === '/login');
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="app-shell">
	<header class="site-header">
		<nav class="breadcrumb" aria-label="Breadcrumb">
			{#each breadcrumbs as crumb, i}
				{#if i > 0}
					<ChevronRight size={14} class="sep" aria-hidden="true" />
				{/if}
				{#if i === breadcrumbs.length - 1}
					<span class="crumb crumb-current">{crumb.label}</span>
				{:else}
					<a class="crumb crumb-link" href={crumb.href}>{crumb.label}</a>
				{/if}
			{/each}
		</nav>

		<div class="header-actions">
			<!-- Apps dropdown -->
			<Dropdown align="right">
				{#snippet trigger()}
					<Grid size={20} aria-label="Apps" />
				{/snippet}
				{#snippet children()}
					<ul class="dropdown-list" role="none">
						<li role="none">
							<a class="dropdown-item active" href="/photos" role="menuitem">
								<Grid size={16} aria-hidden="true" />
								Photos
							</a>
						</li>
					</ul>
				{/snippet}
			</Dropdown>

			<!-- Profile / sign-in -->
			{#if data.user}
				<Dropdown align="right">
					{#snippet trigger()}
						<div class="avatar" aria-label="Profile menu">
							{data.user.displayName.charAt(0).toUpperCase()}
						</div>
					{/snippet}
					{#snippet children()}
						<div class="dropdown-user-info">
							<span class="dropdown-user-name">{data.user.displayName}</span>
							<span class="dropdown-user-role">{data.user.role}</span>
						</div>
						<hr class="dropdown-divider" />
						<ul class="dropdown-list" role="none">
							<li role="none">
								<a class="dropdown-item" href="/settings" role="menuitem">
									<Settings size={16} aria-hidden="true" />
									Account Settings
								</a>
							</li>
							<li role="none">
								<form method="POST" action="/logout">
									<button class="dropdown-item danger" type="submit" role="menuitem">
										<LogOut size={16} aria-hidden="true" />
										Sign out
									</button>
								</form>
							</li>
						</ul>
					{/snippet}
				</Dropdown>
			{:else if !isLoginPage}
				<a class="sign-in-link" href="/login">Sign in</a>
			{/if}
		</div>
	</header>

	<main class="site-content">
		{@render children()}
	</main>
</div>

<!-- Paraglide locale links (hidden) -->
<div style="display:none">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>

<style>
	.app-shell {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	/* ─── Header ─── */
	.site-header {
		position: sticky;
		top: 0;
		z-index: 100;
		height: 52px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 var(--space-4);
		background-color: var(--clr-surface-tonal-a0);
		border-bottom: 1px solid var(--clr-surface-tonal-a10);
		gap: var(--space-4);
	}

	/* ─── Breadcrumb ─── */
	.breadcrumb {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		min-width: 0;
		overflow: hidden;
	}

	.crumb {
		font-size: var(--font-size-sm);
		white-space: nowrap;
	}

	.crumb-link {
		color: var(--clr-surface-a50);
		text-decoration: none;
	}

	.crumb-link:hover {
		color: var(--clr-primary-a40);
	}

	.crumb-current {
		color: var(--clr-light);
		font-weight: 500;
	}

	:global(.sep) {
		color: var(--clr-surface-a30);
		flex-shrink: 0;
	}

	/* ─── Header actions ─── */
	.header-actions {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		flex-shrink: 0;
	}

	.sign-in-link {
		font-size: var(--font-size-sm);
		color: var(--clr-primary-a30);
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-sm);
		text-decoration: none;
		transition: background-color 0.15s;
	}

	.sign-in-link:hover {
		background-color: var(--clr-surface-tonal-a10);
		color: var(--clr-primary-a40);
	}

	/* ─── Avatar ─── */
	.avatar {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background-color: var(--clr-primary-a0);
		color: var(--clr-light);
		font-size: var(--font-size-sm);
		font-weight: 600;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* ─── Dropdown internals ─── */
	:global(.dropdown-list) {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	:global(.dropdown-item) {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		font-size: var(--font-size-sm);
		color: var(--clr-light);
		text-decoration: none;
		width: 100%;
		text-align: left;
		transition: background-color 0.15s;
	}

	:global(.dropdown-item:hover) {
		background-color: var(--clr-surface-a20);
	}

	:global(.dropdown-item.active) {
		color: var(--clr-primary-a30);
	}

	:global(.dropdown-item.danger) {
		color: var(--clr-danger-a10);
	}

	:global(.dropdown-item.danger:hover) {
		background-color: color-mix(in srgb, var(--clr-danger-a0) 15%, transparent);
	}

	.dropdown-user-info {
		padding: var(--space-3) var(--space-4) var(--space-2);
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.dropdown-user-name {
		font-size: var(--font-size-sm);
		font-weight: 600;
		color: var(--clr-light);
	}

	.dropdown-user-role {
		font-size: 0.75rem;
		color: var(--clr-surface-a50);
		text-transform: capitalize;
	}

	.dropdown-divider {
		border: none;
		border-top: 1px solid var(--clr-surface-a20);
		margin: var(--space-1) 0;
	}

	/* ─── Main content ─── */
	.site-content {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
</style>
