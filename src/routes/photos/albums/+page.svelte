<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="albums-page">
	<header class="page-header">
		<h1>Albums</h1>
		<span class="count">{data.albums.length} album{data.albums.length !== 1 ? 's' : ''}</span>
	</header>

	{#if data.albums.length === 0}
		<p class="empty">No albums yet.</p>
	{:else}
		<div class="albums-grid">
			{#each data.albums as album (album.id)}
				<a class="album-card" href="/photos/albums/{album.id}" aria-label={album.name}>
					<div class="album-cover">
						{#if album.coverSrc}
							<img src={album.coverSrc} alt="" loading="lazy" />
						{:else}
							<div class="cover-placeholder"></div>
						{/if}
					</div>
					<div class="album-info">
						<span class="album-name">{album.name}</span>
						<span class="album-count">{album.photoCount} photo{album.photoCount !== 1 ? 's' : ''}</span>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>

<style>
	.albums-page {
		padding: var(--space-6) var(--space-4);
		max-width: var(--max-width);
		margin: 0 auto;
		width: 100%;
	}

	.page-header {
		display: flex;
		align-items: baseline;
		gap: var(--space-4);
		margin-bottom: var(--space-6);
	}

	.page-header h1 {
		font-size: var(--font-size-h1);
	}

	.count {
		font-size: var(--font-size-sm);
		color: var(--clr-surface-a50);
	}

	.empty {
		color: var(--clr-surface-a50);
		font-size: var(--font-size-sm);
	}

	.albums-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		gap: var(--space-4);
	}

	@media (min-width: 640px) {
		.albums-grid {
			grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		}
	}

	.album-card {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		text-decoration: none;
		border-radius: var(--radius-md);
		overflow: hidden;
		transition: transform 0.15s;
	}

	.album-card:hover {
		transform: translateY(-2px);
	}

	.album-cover {
		aspect-ratio: 1;
		overflow: hidden;
		border-radius: var(--radius-md);
		background-color: var(--clr-surface-a10);
	}

	.album-cover img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.2s;
	}

	.album-card:hover .album-cover img {
		transform: scale(1.03);
	}

	.cover-placeholder {
		width: 100%;
		height: 100%;
		background-color: var(--clr-surface-tonal-a10);
	}

	.album-info {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 0 var(--space-1);
	}

	.album-name {
		font-size: var(--font-size-sm);
		font-weight: 500;
		color: var(--clr-light);
	}

	.album-count {
		font-size: 0.75rem;
		color: var(--clr-surface-a50);
	}
</style>
