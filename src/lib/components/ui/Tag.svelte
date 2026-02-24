<script lang="ts">
	import { X } from 'lucide-svelte';

	interface Props {
		label: string;
		onremove?: () => void;
	}

	let { label, onremove }: Props = $props();
</script>

<span class="tag">
	<span class="tag-label">{label}</span>
	{#if onremove}
		<button class="tag-remove" onclick={onremove} aria-label="Remove {label}" type="button">
			<X size={12} aria-hidden="true" />
		</button>
	{/if}
</span>

<style>
	.tag {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		padding: 2px var(--space-2);
		background-color: var(--clr-surface-tonal-a20);
		border-radius: var(--radius-sm);
		font-size: var(--font-size-sm);
		color: var(--clr-light);
		white-space: nowrap;
	}

	.tag-label {
		line-height: 1.4;
	}

	.tag-remove {
		display: flex;
		align-items: center;
		padding: 1px;
		color: var(--clr-surface-a50);
		border-radius: 2px;
		transition: color 0.1s, background-color 0.1s;
	}

	.tag-remove:hover {
		color: var(--clr-light);
		background-color: var(--clr-surface-a30);
	}
</style>
