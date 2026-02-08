<script lang="ts">
	import { goto } from '$app/navigation';

	interface Props {
		photo: Photo;
	}

	let { photo }: Props = $props();
</script>

<button
	class="photo-card"
	class:landscape={photo.orientation === 'landscape'}
	class:portrait={photo.orientation === 'portrait'}
	onclick={() => goto(`/photos/${photo.id}`)}
>
	<img src={photo.src} alt={photo.alt ?? ''} />
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
		background: none;
		cursor: pointer;
		border-radius: 4px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		transition: box-shadow 0.2s ease;
	}

	.photo-card:hover {
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
	}

	.landscape img {
		height: 100%;
		max-width: 100%;
		object-fit: cover;
	}

	.portrait img {
		width: 100%;
		height: auto;
		object-fit: contain;
	}
</style>
