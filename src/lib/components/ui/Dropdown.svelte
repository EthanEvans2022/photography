<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		trigger: Snippet;
		children: Snippet;
		align?: 'left' | 'right';
	}

	let { trigger, children, align = 'right' }: Props = $props();

	let open = $state(false);
	let containerEl: HTMLDivElement | undefined = $state();

	function handleOutsideClick(event: MouseEvent) {
		if (containerEl && !containerEl.contains(event.target as Node)) {
			open = false;
		}
	}

	$effect(() => {
		if (open) {
			window.addEventListener('click', handleOutsideClick);
			return () => window.removeEventListener('click', handleOutsideClick);
		}
	});
</script>

<div class="dropdown" bind:this={containerEl}>
	<button class="trigger" onclick={() => (open = !open)} aria-expanded={open} aria-haspopup="true">
		{@render trigger()}
	</button>

	{#if open}
		<div class="menu" class:align-left={align === 'left'} role="menu">
			{@render children()}
		</div>
	{/if}
</div>

<style>
	.dropdown {
		position: relative;
		display: inline-flex;
	}

	.trigger {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-2);
		border-radius: var(--radius-sm);
		color: var(--clr-light);
		transition: background-color 0.15s;
	}

	.trigger:hover {
		background-color: var(--clr-surface-tonal-a10);
	}

	.menu {
		position: absolute;
		top: calc(100% + var(--space-1, 4px));
		right: 0;
		min-width: 180px;
		background-color: var(--clr-surface-a10);
		border: 1px solid var(--clr-surface-a20);
		border-radius: var(--radius-md);
		padding: var(--space-1) 0;
		z-index: 200;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
	}

	.menu.align-left {
		right: auto;
		left: 0;
	}
</style>
