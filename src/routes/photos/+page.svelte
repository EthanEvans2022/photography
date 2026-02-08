<script lang="ts">
	import PhotoCard from '$lib/components/feature/PhotoCard.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="photos-container">
	{#each data.photos as photo}
		<PhotoCard {photo} />
	{/each}
</div>

<style>
	.photos-container {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 0.5rem;
		padding: 0.5rem;
	}

	/* Tablet */
	@media (min-width: 640px) {
		.photos-container {
			grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
			gap: 0.75rem;
			padding: 0.75rem;
		}
	}

	/* Desktop */
	@media (min-width: 1024px) {
		.photos-container {
			grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
			gap: 1rem;
			padding: 1rem;
		}
	}

	/* Large desktop */
	@media (min-width: 1440px) {
		.photos-container {
			grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
			gap: 1.25rem;
			padding: 1.25rem;
		}
	}
</style>
