<script lang="ts">
	interface User {
		id: string;
		displayName: string;
		username: string;
		role: string;
	}

	interface Props {
		user: User | null;
	}

	let { user }: Props = $props();

	const initials = $derived(
		user
			? user.displayName
					.split(' ')
					.map((w) => w[0])
					.join('')
					.slice(0, 2)
					.toUpperCase()
			: ''
	);
</script>

<article class="widget user-widget">
	{#if user}
		<div class="user-info">
			<div class="avatar" aria-hidden="true">{initials}</div>
			<div class="user-details">
				<span class="display-name">{user.displayName}</span>
				<span class="username">@{user.username}</span>
				<span class="role-badge">{user.role}</span>
			</div>
		</div>
		<div class="user-actions">
			<a class="action-link primary" href="/photos">My Photos</a>
		</div>
	{:else}
		<header class="widget-header">
			<h2>Welcome</h2>
		</header>
		<p class="welcome-text">Sign in to access your personal photo library.</p>
		<div class="auth-actions">
			<a class="action-link primary" href="/login">Sign in</a>
			<a class="action-link secondary" href="/login?tab=register">Create account</a>
		</div>
	{/if}
</article>

<style>
	.widget {
		background-color: var(--clr-surface-tonal-a0);
		border: 1px solid var(--clr-surface-tonal-a10);
		border-radius: var(--radius-lg);
		padding: var(--space-5);
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.widget-header h2 {
		font-size: var(--font-size-h2);
		color: var(--clr-light);
	}

	.welcome-text {
		font-size: var(--font-size-sm);
		color: var(--clr-surface-a50);
		line-height: 1.6;
	}

	/* Logged-in state */
	.user-info {
		display: flex;
		align-items: center;
		gap: var(--space-4);
	}

	.avatar {
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background-color: var(--clr-primary-a0);
		color: var(--clr-light);
		font-size: var(--font-size-h2);
		font-weight: 600;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.user-details {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		min-width: 0;
	}

	.display-name {
		font-size: var(--font-size-base);
		font-weight: 600;
		color: var(--clr-light);
	}

	.username {
		font-size: var(--font-size-sm);
		color: var(--clr-surface-a50);
	}

	.role-badge {
		font-size: 0.75rem;
		color: var(--clr-primary-a30);
		text-transform: capitalize;
		font-weight: 500;
	}

	/* Actions */
	.user-actions,
	.auth-actions {
		display: flex;
		gap: var(--space-3);
		flex-wrap: wrap;
	}

	.action-link {
		display: inline-flex;
		align-items: center;
		padding: var(--space-2) var(--space-4);
		border-radius: var(--radius-sm);
		font-size: var(--font-size-sm);
		font-weight: 500;
		text-decoration: none;
		transition: opacity 0.15s;
	}

	.action-link:hover {
		opacity: 0.85;
	}

	.action-link.primary {
		background-color: var(--clr-primary-a0);
		color: var(--clr-light);
	}

	.action-link.secondary {
		background-color: var(--clr-surface-a20);
		color: var(--clr-light);
	}
</style>
