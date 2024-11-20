<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import LangDrop from './components/lang-drop.svelte';
	import { page } from '$app/stores';
	import '../app.css';

	let currentTheme = 'dark';

	const submitUpdateTheme: SubmitFunction = ({ action }) => {
		const theme = action.searchParams.get('theme');

		if (theme) {
			document.documentElement.setAttribute('data-theme', theme);
			currentTheme = theme;
		}
	};
</script>

<div class="bg-base-300 min-h-screen">
	<div class="navbar bg-base-100 h-[8vh] px-6">
		<div id="logo-text" class="flex-1">
			<a href="/" class="ml-5 text-xl font-bold">IDOLY MUSICS</a>
		</div>
		<div id="change-lang-theme" class="flex-none">
			<LangDrop />
			<ul class="menu menu-horizontal z-50 px-1">
				<form method="POST" use:enhance={submitUpdateTheme}>
					<button
						formaction="/?/setTheme&theme={currentTheme === 'light'
							? 'dark'
							: 'light'}&redirectTo={$page.url.pathname}"
						class="btn"
					>
						{#if currentTheme === 'light'}
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
	<div id="body-bg" class="min-h-[calc(92vh)]">
		<slot />
	</div>
</div>
