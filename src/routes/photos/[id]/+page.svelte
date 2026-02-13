<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<div class="photo-detail">
	<img src={data.photo.src} alt={data.photo.id} />
</div>

<style>
	.photo-detail {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100vh;
		background: var(--clr-dark);
	}

	.photo-detail img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}
</style>
