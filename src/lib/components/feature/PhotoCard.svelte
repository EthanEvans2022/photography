<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Photo } from '$lib/types/photo';

	interface Props {
		photo: Photo;
	}

	let { photo }: Props = $props();
</script>

<button
	class="photo-card"
	onclick={() => goto(`/photos/${photo.id}`)}
>
	<img src={photo.src} alt={photo.id} />
</button>

<style>
	.photo-card {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		aspect-ratio: 1 / 1;
		overflow: hidden;
		border: none;
		padding: 0;
		background: var(--clr-surface-a10);
		cursor: pointer;
		border-radius: var(--radius-sm);
		box-shadow: 0 2px 8px color-mix(in srgb, var(--clr-surface-tonal-a30) 40%, transparent);
		transition: box-shadow 0.2s ease;
	}

	.photo-card:hover {
		box-shadow: 0 4px 16px color-mix(in srgb, var(--clr-surface-tonal-a30) 70%, transparent);
	}

	.photo-card img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
