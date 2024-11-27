<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import LangDrop from '$lib/components/lang-drop.svelte';
	import { page } from '$app/stores';
	import { global_theme, character_filter } from '$lib/stores';
	import '../app.css';

	$global_theme = 'dark';

	const submitUpdateTheme: SubmitFunction = ({ action }) => {
		const theme = action.searchParams.get('theme');
		character_filter.set([]);
		if (theme) {
			document.documentElement.setAttribute('data-theme', theme);
			$global_theme = theme;
		}
	};
</script>

<div class="min-h-screen bg-base-300">
	<div class="navbar h-[8vh] bg-base-100 px-6">
		<div id="logo-text" class="flex-1">
			<a href="/" class="ml-5 text-xl font-bold">IDOLY MUSICS</a>
		</div>
		<div id="change-lang-theme" class="flex-none">
			<LangDrop />
			<ul class="menu menu-horizontal z-50 px-1">
				<form method="POST" use:enhance={submitUpdateTheme}>
					<button
						formaction="/?/setTheme&theme={$global_theme === 'light'
							? 'dark'
							: 'light'}&redirectTo={$page.url.pathname}"
						class="btn"
					>
						{#if $global_theme === 'light'}
							<span class="text-lg">☀️</span>
							<span class="font-medium">Light Mode</span>
						{:else}
							<span class="text-lg">🌙</span>
							<span class="font-medium">Dark Mode</span>
						{/if}
					</button>
				</form>
			</ul>
		</div>
	</div>
	<div id="body-bg">
		<slot />
	</div>
</div>
