<script lang="ts">
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { ArrowLeft, Star, Trash2, Download, ChevronLeft, ChevronRight } from 'lucide-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const isOwner = $derived(data.user?.role === 'owner');
	let isFavorited = $state(data.photo.favorite);

	// Update local state when data changes (form action returns updated photo)
	$effect(() => {
		isFavorited = data.photo.favorite;
	});

	// Hover arrows
	let showArrows = $state(false);
	let arrowTimeout: ReturnType<typeof setTimeout> | null = null;

	function handleMouseMove() {
		showArrows = true;
		if (arrowTimeout) clearTimeout(arrowTimeout);
		arrowTimeout = setTimeout(() => {
			showArrows = false;
		}, 3000);
	}

	function navigatePrev() {
		if (data.prevId) goto(`/photos/${data.prevId}`);
	}

	function navigateNext() {
		if (data.nextId) goto(`/photos/${data.nextId}`);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft') navigatePrev();
		if (e.key === 'ArrowRight') navigateNext();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="detail-page">
	<!-- Top bar -->
	<div class="top-bar">
		<a class="icon-btn back-btn" href="/photos" aria-label="Back to Photos">
			<ArrowLeft size={20} aria-hidden="true" />
		</a>

		<div class="top-actions">
			<!-- Favorite -->
			<form
				method="POST"
				action="?/favorite"
				use:enhance={({ formElement }) => {
					return ({ result }) => {
						if (result.type === 'success' && result.data?.photo) {
							isFavorited = (result.data.photo as { favorite: boolean }).favorite;
						}
					};
				}}
			>
				<button
					class="icon-btn"
					class:favorited={isFavorited}
					type="submit"
					aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
					disabled={!data.user}
				>
					<Star size={20} aria-hidden="true" />
				</button>
			</form>

			<!-- Download -->
			<a
				class="icon-btn"
				href={data.photo.src}
				download={data.photo.src.split('/').pop()}
				aria-label="Download photo"
			>
				<Download size={20} aria-hidden="true" />
			</a>

			<!-- Delete (owner only) -->
			{#if isOwner}
				<form
					method="POST"
					action="?/delete"
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'success') {
								await goto('/photos');
							}
						};
					}}
				>
					<button class="icon-btn danger" type="submit" aria-label="Delete photo">
						<Trash2 size={20} aria-hidden="true" />
					</button>
				</form>
			{/if}
		</div>
	</div>

	<!-- Photo viewport -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="photo-viewport" onmousemove={handleMouseMove} role="img" aria-label={data.photo.id}>
		<img src={data.photo.src} alt={data.photo.id} />

		<!-- Prev arrow -->
		{#if data.prevId}
			<button
				class="nav-arrow prev"
				class:visible={showArrows}
				onclick={navigatePrev}
				aria-label="Previous photo"
				type="button"
			>
				<ChevronLeft size={32} aria-hidden="true" />
			</button>
		{/if}

		<!-- Next arrow -->
		{#if data.nextId}
			<button
				class="nav-arrow next"
				class:visible={showArrows}
				onclick={navigateNext}
				aria-label="Next photo"
				type="button"
			>
				<ChevronRight size={32} aria-hidden="true" />
			</button>
		{/if}
	</div>
</div>

<style>
	.detail-page {
		display: flex;
		flex-direction: column;
		height: calc(100vh - 52px);
		background-color: var(--clr-dark);
	}

	/* ─── Top bar ─── */
	.top-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-2) var(--space-4);
		background-color: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(8px);
		position: relative;
		z-index: 10;
		flex-shrink: 0;
	}

	.top-actions {
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
		border: none;
		background: none;
		cursor: pointer;
		transition: color 0.15s, background-color 0.15s;
		text-decoration: none;
	}

	.icon-btn:hover {
		color: var(--clr-light);
		background-color: rgba(255, 255, 255, 0.1);
	}

	.icon-btn:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}

	.icon-btn.favorited {
		color: var(--clr-warning-a10);
	}

	.icon-btn.danger {
		color: var(--clr-danger-a10);
	}

	.icon-btn.danger:hover {
		background-color: color-mix(in srgb, var(--clr-danger-a0) 20%, transparent);
	}

	.back-btn {
		color: var(--clr-light);
	}

	/* ─── Photo viewport ─── */
	.photo-viewport {
		position: relative;
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.photo-viewport img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}

	/* ─── Nav arrows ─── */
	.nav-arrow {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 80px;
		background-color: rgba(0, 0, 0, 0.45);
		border-radius: var(--radius-sm);
		color: var(--clr-light);
		border: none;
		cursor: pointer;
		opacity: 0;
		transition: opacity 0.3s;
	}

	.nav-arrow.visible {
		opacity: 1;
	}

	.nav-arrow:hover {
		background-color: rgba(0, 0, 0, 0.7);
	}

	.nav-arrow.prev {
		left: var(--space-4);
	}

	.nav-arrow.next {
		right: var(--space-4);
	}
</style>
