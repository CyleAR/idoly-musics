<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import { onMount } from 'svelte';
	import LangDrop from '$lib/components/lang-drop.svelte';
	import { page } from '$app/stores';
	import { global_theme, filter, current_filter_type, previous_filter_type } from '$lib/stores';
	import '../app.css';

	onMount(() => {
		const savedTheme =
			localStorage.getItem('theme') ||
			(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
		console.log(savedTheme);
		document.documentElement.setAttribute('data-theme', savedTheme);
		$global_theme = savedTheme;
	});

	const submitUpdateTheme: SubmitFunction = ({ action }) => {
		const theme = action.searchParams.get('theme');
		if (theme) {
			document.documentElement.setAttribute('data-theme', theme);
			filter.set([]);
			$global_theme = theme;
			localStorage.setItem('theme', theme);
		}
	};

	function reset() {
		filter.set([]);
		$current_filter_type.set('');
		$previous_filter_type.set('');
	}
</script>

<div class="flex min-h-screen flex-col bg-base-300">
	<div class="navbar fixed top-0 z-[100] w-full bg-base-100 px-6 shadow-md">
		<div id="logo-text" class="flex-1">
			<a on:click={reset} href="/" class="ml-5 text-xl font-bold">IDOLY MUSICS</a>
		</div>
		<div id="change-lang-theme" class="z-[51] flex-none">
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
	<div class="flex-1 pt-[4.5vh]">
		<slot />
	</div>
	<footer class="mt-auto bg-base-100 py-4 text-center shadow-inner">
		<p class="text-sm text-gray-400">This site is a fan project of IDOLYPRIDE</p>
		<p class="text-sm text-gray-400">Some data may be inaccurate</p>
		<p class="text-sm text-gray-400">Contents © QualiArts and associates</p>
	</footer>
</div>
