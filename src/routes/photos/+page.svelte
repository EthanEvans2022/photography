<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { SlidersHorizontal, Menu, Star, Trash2, Download, Loader2 } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import Sidebar from '$lib/components/feature/Sidebar.svelte';
	import FilterPanel from '$lib/components/feature/FilterPanel.svelte';
	import type { PageData } from './$types';
	import type { Photo } from '$lib/types/photo';

	let { data }: { data: PageData } = $props();

	// Layout state
	let sidebarOpen = $state(true);
	let filterOpen = $state(false);
	let columns = $state(4);

	// Selection state
	let selectedIds = $state<Set<string>>(new Set());
	const hasSelection = $derived(selectedIds.size > 0);
	const isOwner = $derived(data.user?.role === 'owner');

	// Infinite scroll
	let allPhotos = $state<Photo[]>(data.photos);
	let hasMore = $state(data.hasMore);
	let loadingMore = $state(false);
	let sentinel: HTMLDivElement | undefined = $state();

	// When server-side data changes (filter/sort), reset local state
	$effect(() => {
		allPhotos = data.photos;
		hasMore = data.hasMore;
		selectedIds = new Set();
	});

	// Intersection observer for infinite scroll
	$effect(() => {
		if (!sentinel) return;
		const obs = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore && !loadingMore) {
					loadMore();
				}
			},
			{ threshold: 0.1 }
		);
		obs.observe(sentinel);
		return () => obs.disconnect();
	});

	async function loadMore() {
		if (loadingMore || !hasMore) return;
		loadingMore = true;

		try {
			const params = new URLSearchParams(page.url.searchParams);
			params.set('offset', String(allPhotos.length));
			const res = await fetch(`/photos/more?${params.toString()}`);
			if (res.ok) {
				const { photos, hasMore: more } = (await res.json()) as {
					photos: Photo[];
					hasMore: boolean;
				};
				allPhotos = [...allPhotos, ...photos];
				hasMore = more;
			}
		} finally {
			loadingMore = false;
		}
	}

	// Selection logic
	function handlePhotoClick(photo: Photo) {
		if (isOwner) {
			if (selectedIds.has(photo.id)) {
				// Second click on selected = navigate to detail
				goto(`/photos/${photo.id}`);
			} else {
				selectedIds = new Set([...selectedIds, photo.id]);
			}
		} else {
			// Viewer: navigate directly
			goto(`/photos/${photo.id}`);
		}
	}

	function toggleSelect(photo: Photo, e: Event) {
		e.stopPropagation();
		const next = new Set(selectedIds);
		if (next.has(photo.id)) {
			next.delete(photo.id);
		} else {
			next.add(photo.id);
		}
		selectedIds = next;
	}

	function deselectAll() {
		selectedIds = new Set();
	}

	// Favorite toggle: determine next state from majority
	const allSelectedFavorited = $derived(
		hasSelection && [...selectedIds].every((id) => allPhotos.find((p) => p.id === id)?.favorite)
	);

	// Keyboard shortcut: Escape to deselect
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') deselectAll();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="photos-page" class:sidebar-open={sidebarOpen}>
	<Sidebar bind:open={sidebarOpen} />

	<div class="main" role="main">
		<!-- Toolbar -->
		<div class="toolbar" role="toolbar" aria-label="Photo actions">
			<div class="toolbar-left">
				<button
					class="icon-btn"
					onclick={() => (sidebarOpen = !sidebarOpen)}
					aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
					type="button"
				>
					<Menu size={20} aria-hidden="true" />
				</button>

				<button
					class="icon-btn"
					class:active={filterOpen}
					onclick={() => (filterOpen = !filterOpen)}
					aria-label={filterOpen ? 'Close filters' : 'Open filters'}
					aria-expanded={filterOpen}
					type="button"
				>
					<SlidersHorizontal size={20} aria-hidden="true" />
				</button>

				<div class="zoom-control">
					<input
						type="range"
						min="2"
						max="8"
						step="1"
						bind:value={columns}
						aria-label="Grid zoom"
						class="zoom-slider"
					/>
				</div>
			</div>

			<div class="toolbar-right">
				{#if hasSelection}
					<span class="selection-count">{selectedIds.size} selected</span>
				{/if}

				<!-- Favorite -->
				<form method="POST" action="?/favorite" use:enhance>
					{#each [...selectedIds] as id}
						<input type="hidden" name="id" value={id} />
					{/each}
					<input type="hidden" name="favorite" value={allSelectedFavorited ? 'false' : 'true'} />
					<button
						class="icon-btn action-btn"
						class:active={allSelectedFavorited}
						disabled={!hasSelection || !data.user}
						aria-label={allSelectedFavorited ? 'Unfavorite selected' : 'Favorite selected'}
						type="submit"
					>
						<Star size={20} aria-hidden="true" />
					</button>
				</form>

				<!-- Download (per selected photo) -->
				{#if hasSelection}
					{#each [...selectedIds] as id}
						{@const photo = allPhotos.find((p) => p.id === id)}
						{#if photo}
							<a
								class="icon-btn action-btn"
								href={photo.src}
								download={photo.src.split('/').pop()}
								aria-label="Download {photo.id}"
							>
								<Download size={20} aria-hidden="true" />
							</a>
						{/if}
					{/each}
				{:else}
					<button
						class="icon-btn action-btn"
						disabled
						aria-label="Download selected (none selected)"
						type="button"
					>
						<Download size={20} aria-hidden="true" />
					</button>
				{/if}

				<!-- Delete (owner only) -->
				{#if isOwner}
					<form method="POST" action="?/delete" use:enhance>
						{#each [...selectedIds] as id}
							<input type="hidden" name="id" value={id} />
						{/each}
						<button
							class="icon-btn action-btn danger"
							disabled={!hasSelection}
							aria-label="Delete selected"
							type="submit"
						>
							<Trash2 size={20} aria-hidden="true" />
						</button>
					</form>
				{/if}
			</div>
		</div>

		<!-- Filter panel -->
		{#if filterOpen}
			<FilterPanel
				allTags={data.allTags}
				allPeople={data.allPeople}
				isAuthenticated={!!data.user}
			/>
		{/if}

		<!-- Photo grid -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="grid-wrapper"
			onclick={(e) => {
				if ((e.target as HTMLElement).closest('.photo-item') === null) deselectAll();
			}}
		>
			<div class="photo-grid" style="--cols: {columns}" role="list" aria-label="Photo grid">
				{#if allPhotos.length === 0}
					<p class="empty-state">No photos found.</p>
				{/if}

				{#each allPhotos as photo (photo.id)}
					{@const selected = selectedIds.has(photo.id)}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<div
						class="photo-item"
						class:selected
						role="listitem"
						tabindex="0"
						aria-label={photo.id}
						aria-selected={selected}
						onclick={() => handlePhotoClick(photo)}
						onkeydown={(e) => e.key === 'Enter' && handlePhotoClick(photo)}
					>
						<img src={photo.src} alt="" loading="lazy" />

						<!-- Checkbox for viewer multi-select (hover-revealed) -->
						{#if !isOwner && data.user}
							<button
								class="select-check"
								class:checked={selected}
								onclick={(e) => toggleSelect(photo, e)}
								aria-label={selected ? 'Deselect' : 'Select'}
								type="button"
							>
								{#if selected}✓{/if}
							</button>
						{/if}

						{#if photo.favorite}
							<span class="favorite-badge" aria-label="Favorited">
								<Star size={12} aria-hidden="true" />
							</span>
						{/if}
					</div>
				{/each}

				<!-- Skeleton placeholders during load -->
				{#if loadingMore}
					{#each { length: 10 } as _, i (i)}
						<div class="photo-item skeleton" aria-hidden="true"></div>
					{/each}
				{/if}
			</div>

			<!-- Infinite scroll sentinel -->
			{#if hasMore}
				<div bind:this={sentinel} class="sentinel" aria-hidden="true">
					{#if loadingMore}
						<Loader2 size={24} class="spin" />
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.photos-page {
		display: flex;
		flex: 1;
		height: calc(100vh - 52px);
		overflow: hidden;
	}

	.main {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: hidden;
	}

	/* ─── Toolbar ─── */
	.toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-2) var(--space-3);
		border-bottom: 1px solid var(--clr-surface-a10);
		background-color: var(--clr-surface-tonal-a0);
		gap: var(--space-3);
		flex-shrink: 0;
	}

	.toolbar-left,
	.toolbar-right {
		display: flex;
		align-items: center;
		gap: var(--space-1);
	}

	.icon-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-2);
		border-radius: var(--radius-sm);
		color: var(--clr-surface-a50);
		transition: color 0.15s, background-color 0.15s;
		border: none;
		background: none;
		cursor: pointer;
	}

	.icon-btn:hover:not(:disabled) {
		color: var(--clr-light);
		background-color: var(--clr-surface-a10);
	}

	.icon-btn.active {
		color: var(--clr-primary-a30);
	}

	.icon-btn:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}

	.action-btn {
		color: var(--clr-primary-a0);
		text-decoration: none;
	}

	.action-btn:hover:not(:disabled) {
		color: var(--clr-primary-a20);
	}

	.action-btn.active {
		color: var(--clr-warning-a10);
	}

	.action-btn.danger {
		color: var(--clr-danger-a10);
	}

	.action-btn.danger:hover:not(:disabled) {
		background-color: color-mix(in srgb, var(--clr-danger-a0) 15%, transparent);
	}

	.zoom-control {
		display: flex;
		align-items: center;
	}

	.zoom-slider {
		width: 80px;
		accent-color: var(--clr-primary-a30);
		cursor: pointer;
	}

	.selection-count {
		font-size: var(--font-size-sm);
		color: var(--clr-surface-a50);
		padding: 0 var(--space-2);
	}

	/* ─── Grid wrapper ─── */
	.grid-wrapper {
		flex: 1;
		overflow-y: auto;
		padding: var(--space-3);
	}

	/* ─── Photo grid ─── */
	.photo-grid {
		display: grid;
		grid-template-columns: repeat(var(--cols, 4), 1fr);
		gap: var(--space-2);
	}

	.photo-item {
		position: relative;
		aspect-ratio: 1;
		overflow: hidden;
		border-radius: var(--radius-sm);
		cursor: pointer;
		background-color: var(--clr-surface-a10);
		outline: 2px solid transparent;
		outline-offset: 2px;
		transition: outline-color 0.1s;
	}

	.photo-item:hover {
		outline-color: var(--clr-surface-a30);
	}

	.photo-item.selected {
		outline-color: var(--clr-primary-a30);
		outline-width: 3px;
	}

	.photo-item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		pointer-events: none;
	}

	/* Skeleton shimmer */
	.photo-item.skeleton {
		background: linear-gradient(
			90deg,
			var(--clr-surface-a10) 25%,
			var(--clr-surface-a20) 50%,
			var(--clr-surface-a10) 75%
		);
		background-size: 200% 100%;
		animation: shimmer 1.5s infinite;
	}

	@keyframes shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	/* Viewer select checkbox */
	.select-check {
		position: absolute;
		top: var(--space-1);
		left: var(--space-1);
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: 2px solid rgba(255, 255, 255, 0.7);
		background-color: rgba(0, 0, 0, 0.4);
		color: var(--clr-light);
		font-size: 11px;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transition: opacity 0.15s;
	}

	.photo-item:hover .select-check,
	.select-check.checked {
		opacity: 1;
	}

	.select-check.checked {
		background-color: var(--clr-primary-a0);
		border-color: var(--clr-primary-a0);
	}

	/* Favorite badge */
	.favorite-badge {
		position: absolute;
		bottom: var(--space-1);
		right: var(--space-1);
		color: var(--clr-warning-a10);
		background-color: rgba(0, 0, 0, 0.5);
		border-radius: 50%;
		padding: 2px;
		display: flex;
	}

	/* Empty state */
	.empty-state {
		grid-column: 1 / -1;
		text-align: center;
		color: var(--clr-surface-a40);
		font-size: var(--font-size-sm);
		padding: var(--space-12) 0;
	}

	/* Sentinel */
	.sentinel {
		display: flex;
		justify-content: center;
		padding: var(--space-6);
	}

	:global(.spin) {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	/* Mobile */
	@media (max-width: 639px) {
		.photos-page {
			flex-direction: column;
		}
	}
</style>
