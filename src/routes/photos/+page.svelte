<script lang="ts">
	import PhotoWrapper from '$lib/components/PhotoWrapper.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="photos-container">
	{#each data.photos as photo}
		<PhotoWrapper {photo} />
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
</style>
