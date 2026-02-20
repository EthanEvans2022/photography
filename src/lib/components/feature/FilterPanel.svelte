<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Plus, X } from 'lucide-svelte';
	import Tag from '$lib/components/ui/Tag.svelte';

	interface Props {
		allTags: string[];
		allPeople: string[];
		isAuthenticated: boolean;
	}

	let { allTags, allPeople, isAuthenticated }: Props = $props();

	// Read current filter state from URL
	const dateFrom = $derived(page.url.searchParams.get('dateFrom') ?? '');
	const dateTo = $derived(page.url.searchParams.get('dateTo') ?? '');
	const activeTags = $derived(page.url.searchParams.getAll('tag'));
	const activePeople = $derived(page.url.searchParams.getAll('person'));

	// Tag search state
	let tagSearchValue = $state('');
	let showTagSearch = $state(false);
	let personSearchValue = $state('');
	let showPersonSearch = $state(false);

	const tagSuggestions = $derived(
		tagSearchValue
			? allTags
					.filter(
						(t) => t.toLowerCase().includes(tagSearchValue.toLowerCase()) && !activeTags.includes(t)
					)
					.slice(0, 3)
			: []
	);

	const peopleSuggestions = $derived(
		personSearchValue
			? allPeople
					.filter(
						(p) =>
							p.toLowerCase().includes(personSearchValue.toLowerCase()) &&
							!activePeople.includes(p)
					)
					.slice(0, 3)
			: []
	);

	function updateParams(updates: Record<string, string | string[] | null>) {
		const params = new URLSearchParams(page.url.searchParams);

		for (const [key, value] of Object.entries(updates)) {
			if (value === null || value === '') {
				params.delete(key);
			} else if (Array.isArray(value)) {
				params.delete(key);
				for (const v of value) params.append(key, v);
			} else {
				params.set(key, value);
			}
		}

		goto(`?${params.toString()}`, { replaceState: true, keepFocus: true });
	}

	function addTag(tag: string) {
		updateParams({ tag: [...activeTags, tag] });
		tagSearchValue = '';
		showTagSearch = false;
	}

	function removeTag(tag: string) {
		updateParams({ tag: activeTags.filter((t) => t !== tag) });
	}

	function clearTags() {
		updateParams({ tag: null });
	}

	function addPerson(person: string) {
		updateParams({ person: [...activePeople, person] });
		personSearchValue = '';
		showPersonSearch = false;
	}

	function removePerson(person: string) {
		updateParams({ person: activePeople.filter((p) => p !== person) });
	}

	function clearPeople() {
		updateParams({ person: null });
	}

	function clearAll() {
		goto('?', { replaceState: true });
	}
</script>

<div class="filter-panel" role="region" aria-label="Photo filters">
	<!-- Date range -->
	<section class="filter-section">
		<h3 class="section-title">Date Range</h3>
		<div class="date-inputs">
			<label class="date-label">
				<span class="sr-only">From</span>
				<input
					type="date"
					class="date-input"
					placeholder="From"
					value={dateFrom}
					onchange={(e) => updateParams({ dateFrom: e.currentTarget.value })}
					aria-label="Date from"
				/>
			</label>
			<span class="date-sep">—</span>
			<label class="date-label">
				<span class="sr-only">To</span>
				<input
					type="date"
					class="date-input"
					placeholder="To"
					value={dateTo}
					onchange={(e) => updateParams({ dateTo: e.currentTarget.value })}
					aria-label="Date to"
				/>
			</label>
		</div>
	</section>

	<!-- Tags -->
	<section class="filter-section">
		<div class="section-header">
			<h3 class="section-title">Tags</h3>
			<div class="section-actions">
				<button
					class="icon-action"
					onclick={() => (showTagSearch = !showTagSearch)}
					aria-label="Add tag filter"
					type="button"
				>
					<Plus size={14} aria-hidden="true" />
				</button>
				{#if activeTags.length > 0}
					<button class="icon-action" onclick={clearTags} aria-label="Clear all tag filters" type="button">
						<X size={14} aria-hidden="true" />
					</button>
				{/if}
			</div>
		</div>

		{#if showTagSearch}
			<div class="search-input-wrap">
				<input
					class="search-input"
					type="text"
					placeholder="Search tags…"
					bind:value={tagSearchValue}
					aria-label="Tag search"
					aria-autocomplete="list"
				/>
				{#if tagSuggestions.length > 0}
					<ul class="suggestions" role="listbox" aria-label="Tag suggestions">
						{#each tagSuggestions as suggestion}
							<li role="none">
								<button
									class="suggestion-item"
									role="option"
									aria-selected="false"
									type="button"
									onclick={() => addTag(suggestion)}
								>
									{suggestion}
								</button>
							</li>
						{/each}
					</ul>
				{:else if tagSearchValue}
					<p class="no-results">No matching tags</p>
				{/if}
			</div>
		{/if}

		<div class="active-filters" aria-label="Active tag filters">
			{#if activeTags.length === 0}
				<p class="empty-filters">No tags selected</p>
			{:else}
				{#each activeTags as tag}
					<Tag label={tag} onremove={() => removeTag(tag)} />
				{/each}
			{/if}
		</div>
	</section>

	<!-- People (authenticated only) -->
	{#if isAuthenticated}
		<section class="filter-section">
			<div class="section-header">
				<h3 class="section-title">People</h3>
				<div class="section-actions">
					<button
						class="icon-action"
						onclick={() => (showPersonSearch = !showPersonSearch)}
						aria-label="Add person filter"
						type="button"
					>
						<Plus size={14} aria-hidden="true" />
					</button>
					{#if activePeople.length > 0}
						<button
							class="icon-action"
							onclick={clearPeople}
							aria-label="Clear all people filters"
							type="button"
						>
							<X size={14} aria-hidden="true" />
						</button>
					{/if}
				</div>
			</div>

			{#if showPersonSearch}
				<div class="search-input-wrap">
					<input
						class="search-input"
						type="text"
						placeholder="Search people…"
						bind:value={personSearchValue}
						aria-label="Person search"
						aria-autocomplete="list"
					/>
					{#if peopleSuggestions.length > 0}
						<ul class="suggestions" role="listbox" aria-label="Person suggestions">
							{#each peopleSuggestions as suggestion}
								<li role="none">
									<button
										class="suggestion-item"
										role="option"
										aria-selected="false"
										type="button"
										onclick={() => addPerson(suggestion)}
									>
										{suggestion}
									</button>
								</li>
							{/each}
						</ul>
					{:else if personSearchValue}
						<p class="no-results">No matching people</p>
					{/if}
				</div>
			{/if}

			<div class="active-filters" aria-label="Active people filters">
				{#if activePeople.length === 0}
					<p class="empty-filters">No people selected</p>
				{:else}
					{#each activePeople as person}
						<Tag label={person} onremove={() => removePerson(person)} />
					{/each}
				{/if}
			</div>
		</section>
	{/if}

	<button class="clear-all" onclick={clearAll} type="button"> Clear all filters </button>
</div>

<style>
	.filter-panel {
		background-color: var(--clr-surface-tonal-a0);
		border-bottom: 1px solid var(--clr-surface-tonal-a10);
		padding: var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
	}

	.filter-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.section-title {
		font-size: var(--font-size-sm);
		font-weight: 600;
		color: var(--clr-surface-a50);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.section-actions {
		display: flex;
		gap: var(--space-1);
	}

	.icon-action {
		display: flex;
		align-items: center;
		padding: var(--space-1);
		border-radius: var(--radius-sm);
		color: var(--clr-surface-a50);
		transition: color 0.15s, background-color 0.15s;
	}

	.icon-action:hover {
		color: var(--clr-light);
		background-color: var(--clr-surface-a20);
	}

	/* Date inputs */
	.date-inputs {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.date-label {
		flex: 1;
	}

	.date-sep {
		color: var(--clr-surface-a40);
		font-size: var(--font-size-sm);
	}

	.date-input {
		width: 100%;
		background-color: var(--clr-surface-a10);
		border: 1px solid var(--clr-surface-a20);
		border-radius: var(--radius-sm);
		color: var(--clr-light);
		font-family: var(--font-family);
		font-size: var(--font-size-sm);
		padding: var(--space-2) var(--space-3);
		color-scheme: dark;
	}

	.date-input:focus {
		outline: 1px solid var(--clr-primary-a30);
		border-color: var(--clr-primary-a30);
	}

	/* Search */
	.search-input-wrap {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.search-input {
		background-color: var(--clr-surface-a10);
		border: 1px solid var(--clr-surface-a20);
		border-radius: var(--radius-sm);
		color: var(--clr-light);
		font-family: var(--font-family);
		font-size: var(--font-size-sm);
		padding: var(--space-2) var(--space-3);
		width: 100%;
	}

	.search-input:focus {
		outline: 1px solid var(--clr-primary-a30);
		border-color: var(--clr-primary-a30);
	}

	.suggestions {
		list-style: none;
		background-color: var(--clr-surface-a10);
		border: 1px solid var(--clr-surface-a20);
		border-radius: var(--radius-sm);
		overflow: hidden;
	}

	.suggestion-item {
		display: block;
		width: 100%;
		text-align: left;
		padding: var(--space-2) var(--space-3);
		font-size: var(--font-size-sm);
		color: var(--clr-light);
		transition: background-color 0.1s;
	}

	.suggestion-item:hover {
		background-color: var(--clr-surface-a20);
	}

	.no-results {
		font-size: var(--font-size-sm);
		color: var(--clr-surface-a40);
		padding: var(--space-2) 0;
	}

	/* Active filters */
	.active-filters {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.empty-filters {
		font-size: var(--font-size-sm);
		color: var(--clr-surface-a40);
	}

	/* Clear all */
	.clear-all {
		align-self: flex-start;
		font-size: var(--font-size-sm);
		color: var(--clr-danger-a10);
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-sm);
		transition: background-color 0.15s;
	}

	.clear-all:hover {
		background-color: color-mix(in srgb, var(--clr-danger-a0) 15%, transparent);
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
	}
</style>
