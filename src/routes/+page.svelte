<script lang="ts">
	import PhotosWidget from '$lib/components/feature/PhotosWidget.svelte';
	import UserWidget from '$lib/components/feature/UserWidget.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="homehub">
	<div class="widget-grid">
		<PhotosWidget photos={data.previewPhotos} />
		<UserWidget user={data.user} />
	</div>
</div>

<style>
	.homehub {
		padding: var(--space-8) var(--space-4);
		max-width: var(--max-width);
		margin: 0 auto;
		width: 100%;
	}

	.widget-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-6);
	}

	@media (min-width: 1024px) {
		.widget-grid {
			grid-template-columns: 2fr 1fr;
		}
	}
</style>
