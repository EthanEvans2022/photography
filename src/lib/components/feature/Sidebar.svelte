<script lang="ts">
	import { page } from '$app/state';
	import { Image, Star, FolderOpen } from 'lucide-svelte';

	interface Props {
		open: boolean;
	}

	let { open = $bindable() }: Props = $props();

	const navItems = [
		{ label: 'Library', href: '/photos', icon: Image },
		{ label: 'Favorites', href: '/photos?favorites=1', icon: Star },
		{ label: 'Albums', href: '/photos/albums', icon: FolderOpen }
	];

	function isActive(href: string): boolean {
		const url = page.url;
		if (href === '/photos') {
			return url.pathname === '/photos' && !url.searchParams.has('favorites');
		}
		if (href === '/photos?favorites=1') {
			return url.pathname === '/photos' && url.searchParams.get('favorites') === '1';
		}
		return url.pathname.startsWith(href);
	}
</script>

{#if open}
	<aside class="sidebar" aria-label="Photo library navigation">
		<nav>
			<ul class="nav-list" role="list">
				{#each navItems as item}
					<li>
						<a
							class="nav-item"
							class:active={isActive(item.href)}
							href={item.href}
							aria-current={isActive(item.href) ? 'page' : undefined}
						>
							<item.icon size={18} aria-hidden="true" />
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</aside>
{/if}

<style>
	.sidebar {
		width: 200px;
		flex-shrink: 0;
		background-color: var(--clr-surface-tonal-a0);
		border-right: 1px solid var(--clr-surface-tonal-a10);
		padding: var(--space-4) var(--space-2);
	}

	.nav-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-sm);
		font-size: var(--font-size-sm);
		color: var(--clr-surface-a50);
		text-decoration: none;
		transition: background-color 0.15s, color 0.15s;
	}

	.nav-item:hover {
		background-color: var(--clr-surface-tonal-a10);
		color: var(--clr-light);
	}

	.nav-item.active {
		background-color: color-mix(in srgb, var(--clr-primary-a0) 20%, transparent);
		color: var(--clr-primary-a30);
	}

	@media (max-width: 639px) {
		.sidebar {
			width: 100%;
			border-right: none;
			border-bottom: 1px solid var(--clr-surface-tonal-a10);
		}

		.nav-list {
			flex-direction: row;
			overflow-x: auto;
		}
	}
</style>
