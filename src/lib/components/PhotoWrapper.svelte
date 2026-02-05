<script lang="ts">
	interface Props {
		photo: Photo;
	}

	let { photo }: Props = $props();
</script>

<div
	class="photo-wrapper"
	class:landscape={photo.width > photo.height}
	class:portrait={photo.height >= photo.width}
>
	<img src={photo.src} alt={photo.alt ?? ''} />
</div>

<style>
	.photo-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-shrink: 0;
	}

	.photo-wrapper img {
		max-width: 100%;
		height: auto;
		object-fit: contain;
	}

	.landscape img {
		width: 100%;
	}

	.photo-wrapper.landscape {
		height: 300px;
	}

	.photo-wrapper.portrait {
		height: 400px;
	}

	.photo-wrapper img {
		height: 100%;
		width: auto;
		object-fit: contain;
		border-radius: 4px;
	}
</style>
