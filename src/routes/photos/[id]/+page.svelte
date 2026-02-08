<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="photo-detail">
	<img
		class={data.photo.orientation}
		src={data.photo.src}
		alt={data.photo.alt ?? ''}
	/>

	<div class="photo-info">
		<h1>{data.photo.alt ?? 'Untitled'}</h1>
		<dl>
			<dt>ID</dt>
			<dd>{data.photo.id}</dd>
			<dt>Dimensions</dt>
			<dd>{data.photo.width} &times; {data.photo.height}</dd>
			<dt>Orientation</dt>
			<dd>{data.photo.orientation}</dd>
			<dt>Source</dt>
			<dd>{data.photo.src}</dd>
		</dl>
	</div>
</div>

<style>
	.photo-detail {
		max-width: 900px;
		margin: 0 auto;
		padding: 1rem;
	}

	.photo-detail img {
		border-radius: 4px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	}

	.photo-detail img.landscape {
		width: 100%;
		height: auto;
	}

	.photo-detail img.portrait {
		width: auto;
		max-height: 70vh;
		max-width: 100%;
		display: block;
		margin: 0 auto;
	}

	.photo-info {
		margin-top: 1.5rem;
	}

	.photo-info h1 {
		margin: 0 0 1rem;
		font-size: 1.5rem;
	}

	dl {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.5rem 1rem;
		margin: 0;
	}

	dt {
		font-weight: 600;
	}

	dd {
		margin: 0;
	}
</style>
