<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="photos-container">
	{#each data.photos as photo}
		<div
			class="photo-wrapper"
			class:landscape={photo.width > photo.height}
			class:portrait={photo.height >= photo.width}
		>
			<img src={photo.src} alt={photo.alt ?? ''} />
		</div>
	{/each}
</div>

<style>
	.photos-container {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 1rem;
		padding: 1rem;
	}

	.photo-wrapper {
		flex-shrink: 0;
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
