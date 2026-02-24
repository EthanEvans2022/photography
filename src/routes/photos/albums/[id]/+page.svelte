<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowLeft, Download } from 'lucide-svelte';
	import type { PageData } from './$types';
	import type { Photo } from '$lib/types/photo';

	let { data }: { data: PageData } = $props();

	const isOwner = $derived(data.user?.role === 'owner');
	let columns = $state(4);

	function handlePhotoClick(photo: Photo) {
		goto(`/photos/${photo.id}`);
	}
</script>

<div class="album-detail">
	<div class="page-header">
		<a class="icon-btn back-btn" href="/photos/albums" aria-label="Back to Albums">
			<ArrowLeft size={20} aria-hidden="true" />
		</a>
		<div class="header-info">
			<h1>{data.album.name}</h1>
			<span class="count">
				{data.album.photos.length} photo{data.album.photos.length !== 1 ? 's' : ''}
			</span>
		</div>
		<div class="header-actions">
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

	{#if data.album.photos.length === 0}
		<p class="empty">This album has no photos.</p>
	{:else}
		<div class="photo-grid" style="--cols: {columns}" role="list" aria-label="Album photos">
			{#each data.album.photos as photo (photo.id)}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<div
					class="photo-item"
					role="listitem"
					tabindex="0"
					onclick={() => handlePhotoClick(photo)}
					onkeydown={(e) => e.key === 'Enter' && handlePhotoClick(photo)}
					aria-label={photo.id}
				>
					<img src={photo.src} alt="" loading="lazy" />
					<div class="photo-overlay">
						<a
							class="download-btn"
							href={photo.src}
							download={photo.src.split('/').pop()}
							onclick={(e) => e.stopPropagation()}
							aria-label="Download {photo.id}"
						>
							<Download size={16} aria-hidden="true" />
						</a>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.album-detail {
		padding: var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		height: calc(100vh - 52px);
		overflow-y: auto;
	}

	.page-header {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		flex-shrink: 0;
	}

	.header-info {
		display: flex;
		align-items: baseline;
		gap: var(--space-3);
		flex: 1;
	}

	.header-info h1 {
		font-size: var(--font-size-h1);
	}

	.count {
		font-size: var(--font-size-sm);
		color: var(--clr-surface-a50);
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.icon-btn {
		display: flex;
		align-items: center;
		padding: var(--space-2);
		border-radius: var(--radius-sm);
		color: var(--clr-surface-a50);
		text-decoration: none;
		transition: color 0.15s, background-color 0.15s;
	}

	.icon-btn:hover {
		color: var(--clr-light);
		background-color: var(--clr-surface-a10);
	}

	.back-btn {
		color: var(--clr-light);
	}

	.zoom-slider {
		width: 80px;
		accent-color: var(--clr-primary-a30);
		cursor: pointer;
	}

	.empty {
		color: var(--clr-surface-a50);
		font-size: var(--font-size-sm);
	}

	/* Photo grid */
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
	}

	.photo-item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.2s;
		pointer-events: none;
	}

	.photo-item:hover img {
		transform: scale(1.03);
	}

	/* Overlay with download button */
	.photo-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
		padding: var(--space-2);
		background: linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, transparent 50%);
		opacity: 0;
		transition: opacity 0.2s;
	}

	.photo-item:hover .photo-overlay {
		opacity: 1;
	}

	.download-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: var(--radius-sm);
		background-color: rgba(0, 0, 0, 0.6);
		color: var(--clr-light);
		text-decoration: none;
		transition: background-color 0.15s;
	}

	.download-btn:hover {
		background-color: var(--clr-primary-a0);
	}
</style>
