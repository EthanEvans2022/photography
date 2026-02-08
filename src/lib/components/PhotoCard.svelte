<script lang="ts">
	interface Props {
		photo: Photo;
	}

	let { photo }: Props = $props();
</script>

<div
	class="photo-card"
	class:landscape={photo.orientation === 'landscape'}
	class:portrait={photo.orientation === 'portrait'}
>
	<img src={photo.src} alt={photo.alt ?? ''} />
</div>

<style>
	.photo-card {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-shrink: 0;
		height: 250px;
		width: 250px;
		overflow: hidden;
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
