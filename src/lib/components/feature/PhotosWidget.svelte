<script lang="ts">
	import type { Photo } from '$lib/types/photo';

	interface Props {
		photos: Photo[];
	}

	let { photos }: Props = $props();

	const preview = $derived(photos.slice(0, 8));
</script>

<article class="widget photos-widget">
	<header class="widget-header">
		<h2>Photos</h2>
		<a class="widget-link" href="/photos">View All →</a>
	</header>

	{#if preview.length === 0}
		<p class="empty">No photos available.</p>
	{:else}
		<div class="photo-grid">
			{#each preview as photo (photo.id)}
				<a class="thumb-link" href="/photos/{photo.id}" title={photo.metadata.datetime}>
					<img src={photo.src} alt="" loading="lazy" />
				</a>
			{/each}
		</div>
	{/if}
</article>

<style>
	.widget {
		background-color: var(--clr-surface-tonal-a0);
		border: 1px solid var(--clr-surface-tonal-a10);
		border-radius: var(--radius-lg);
		padding: var(--space-5);
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.widget-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.widget-header h2 {
		font-size: var(--font-size-h2);
		color: var(--clr-light);
	}

	.widget-link {
		font-size: var(--font-size-sm);
		color: var(--clr-primary-a30);
		text-decoration: none;
	}

	.widget-link:hover {
		color: var(--clr-primary-a40);
	}

	.photo-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(2, 1fr);
		gap: var(--space-2);
	}

	.thumb-link {
		aspect-ratio: 1;
		overflow: hidden;
		border-radius: var(--radius-sm);
		display: block;
	}

	.thumb-link img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.2s;
	}

	.thumb-link:hover img {
		transform: scale(1.05);
	}

	.empty {
		font-size: var(--font-size-sm);
		color: var(--clr-surface-a50);
	}
</style>
