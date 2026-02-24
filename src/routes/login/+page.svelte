<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let activeTab = $state(data.tab === 'register' ? 'register' : 'login');
</script>

<div class="login-page">
	<div class="login-card">
		<div class="card-header">
			<a class="brand" href="/">HomeHub</a>
			<p class="subtitle">
				{activeTab === 'login' ? 'Sign in to your account' : 'Create an account'}
			</p>
		</div>

		<!-- Tab switcher -->
		<div class="tabs" role="tablist">
			<button
				class="tab"
				class:active={activeTab === 'login'}
				role="tab"
				aria-selected={activeTab === 'login'}
				onclick={() => (activeTab = 'login')}
				type="button"
			>
				Sign in
			</button>
			<button
				class="tab"
				class:active={activeTab === 'register'}
				role="tab"
				aria-selected={activeTab === 'register'}
				onclick={() => (activeTab = 'register')}
				type="button"
			>
				Create account
			</button>
		</div>

		{#if form?.message}
			<p class="error-msg" role="alert">{form.message}</p>
		{/if}

		<!-- Login form -->
		{#if activeTab === 'login'}
			<form method="POST" action="?/login" use:enhance class="auth-form">
				<div class="field">
					<label for="login-username">Username</label>
					<input
						id="login-username"
						name="username"
						type="text"
						autocomplete="username"
						required
						placeholder="yourname"
					/>
				</div>
				<div class="field">
					<label for="login-password">Password</label>
					<input
						id="login-password"
						name="password"
						type="password"
						autocomplete="current-password"
						required
						placeholder="••••••••"
					/>
				</div>
				<button class="submit-btn" type="submit">Sign in</button>
			</form>
		{:else}
			<!-- Register form -->
			<form method="POST" action="?/register" use:enhance class="auth-form">
				<div class="field">
					<label for="reg-displayname">Display name</label>
					<input
						id="reg-displayname"
						name="displayName"
						type="text"
						autocomplete="name"
						placeholder="Jane Doe"
					/>
				</div>
				<div class="field">
					<label for="reg-username">Username</label>
					<input
						id="reg-username"
						name="username"
						type="text"
						autocomplete="username"
						required
						placeholder="janedoe"
					/>
				</div>
				<div class="field">
					<label for="reg-password">Password</label>
					<input
						id="reg-password"
						name="password"
						type="password"
						autocomplete="new-password"
						required
						placeholder="••••••••"
					/>
				</div>
				<button class="submit-btn" type="submit">Create account</button>
			</form>
		{/if}
	</div>
</div>

<style>
	.login-page {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: calc(100vh - 52px);
		padding: var(--space-4);
	}

	.login-card {
		width: 100%;
		max-width: 380px;
		background-color: var(--clr-surface-tonal-a0);
		border: 1px solid var(--clr-surface-tonal-a10);
		border-radius: var(--radius-lg);
		padding: var(--space-8);
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
	}

	.card-header {
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.brand {
		font-size: var(--font-size-h1);
		font-weight: 600;
		color: var(--clr-primary-a30);
		text-decoration: none;
	}

	.brand:hover {
		color: var(--clr-primary-a40);
	}

	.subtitle {
		font-size: var(--font-size-sm);
		color: var(--clr-surface-a50);
	}

	/* Tabs */
	.tabs {
		display: flex;
		border-bottom: 1px solid var(--clr-surface-a20);
	}

	.tab {
		flex: 1;
		padding: var(--space-3);
		font-size: var(--font-size-sm);
		font-weight: 500;
		color: var(--clr-surface-a50);
		border-bottom: 2px solid transparent;
		margin-bottom: -1px;
		transition: color 0.15s, border-color 0.15s;
	}

	.tab:hover {
		color: var(--clr-light);
	}

	.tab.active {
		color: var(--clr-primary-a30);
		border-bottom-color: var(--clr-primary-a30);
	}

	/* Error */
	.error-msg {
		font-size: var(--font-size-sm);
		color: var(--clr-danger-a10);
		background-color: color-mix(in srgb, var(--clr-danger-a0) 10%, transparent);
		border: 1px solid color-mix(in srgb, var(--clr-danger-a0) 30%, transparent);
		border-radius: var(--radius-sm);
		padding: var(--space-3) var(--space-4);
	}

	/* Form */
	.auth-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.field label {
		font-size: var(--font-size-sm);
		font-weight: 500;
		color: var(--clr-light);
	}

	.field input {
		background-color: var(--clr-surface-a10);
		border: 1px solid var(--clr-surface-a20);
		border-radius: var(--radius-sm);
		color: var(--clr-light);
		font-family: var(--font-family);
		font-size: var(--font-size-sm);
		padding: var(--space-3) var(--space-4);
		transition: border-color 0.15s;
	}

	.field input:focus {
		outline: none;
		border-color: var(--clr-primary-a30);
	}

	.field input::placeholder {
		color: var(--clr-surface-a30);
	}

	.submit-btn {
		width: 100%;
		padding: var(--space-3);
		background-color: var(--clr-primary-a0);
		color: var(--clr-light);
		border-radius: var(--radius-sm);
		font-size: var(--font-size-sm);
		font-weight: 500;
		transition: opacity 0.15s;
	}

	.submit-btn:hover {
		opacity: 0.85;
	}
</style>
