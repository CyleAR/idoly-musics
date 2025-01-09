<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import { onMount } from 'svelte';
	import LangDrop from '$lib/components/lang-drop.svelte';
	import { page } from '$app/stores';
	import {
		global_theme,
		artistFilter,
        groupFilter,
        albumFilter,
        isFilterEmpty,
        resetFilters,
		currentLanguage,
		view_mode,
		current_page,
		selectedBlock
	} from '$lib/stores';
	import { language_table } from '$lib/lang.ts';
	import '../app.css';

	onMount(() => {
		const savedTheme =
			localStorage.getItem('theme') ||
			(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
		document.documentElement.setAttribute('data-theme', savedTheme);
		$global_theme = savedTheme;
	});

	const submitUpdateTheme: SubmitFunction = ({ action }) => {
		const theme = action.searchParams.get('theme');
		if (theme) {
			document.documentElement.setAttribute('data-theme', theme);
			$global_theme = theme;
			localStorage.setItem('theme', theme);

			resetFilters(); // 테마 변경시 필터 초기화
			view_mode.set('');
			selectedBlock.set(null);
		}
	};

	$: content_lang = language_table[$currentLanguage]['sideNav'];

	function reset() {
        resetFilters();
        view_mode.set('');
		current_page.set(1);
	}

    const commitHash = __COMMIT_HASH__.slice(0, 7);
    const commitLink = `https://github.com/CyleAR/idoly-musics/tree/${__COMMIT_HASH__}`;
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore element_invalid_self_closing_tag -->
<div class="flex min-h-screen flex-col bg-base-300">
	<div class="navbar fixed top-0 z-[100] w-full bg-base-100 px-3 lg:px-6 shadow-md">
		<div id="logo-text" class="flex-1">
			<div class="z-[52]">
				<label for="my-drawer" class="drawer-button">
					<svg
						on:click={() => {
							selectedBlock.set(null);
						}}
						xmlns="http://www.w3.org/2000/svg"
						class="drawer-menu drawer-button h-8 w-8"
						viewBox="0 0 24 24"
						fill="none"
						role="button"
						tabindex="0"
					>
						<path d="M4 18L20 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
						<path d="M4 12L20 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
						<path d="M4 6L20 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
					</svg></label>
				<div class="drawer">
					<input id="my-drawer" type="checkbox" class="drawer-toggle" />
					<div class="drawer-content"></div>
					<div class="drawer-side">
						<label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
						<ul class="menu min-h-full w-80 bg-base-200 p-4 text-base text-base-content">
							<li>
								<button
									on:click={() => {
										view_mode.set('viewByGroup');
									}}
									class="text-left"
								>
									{content_lang.viewByGroup}
								</button>
							</li>
							<li>
								<button
									on:click={() => {
										view_mode.set('viewByAlbums');
									}}
									class="text-left"
								>
									{content_lang.viewByAlbum}
								</button>
							</li>
							<li>
								<button
									on:click={() => {
										view_mode.set('viewByArtist');
									}}
									class="text-left"
								>
									{content_lang.viewByArtist}
								</button>
							</li>
						</ul>
					</div>
				</div>
			</div>
            <a on:click={reset} href="/" class="ml-5 font-bold text-base md:text-xl">IDOLY MUSICS</a>
		</div>
		<div id="change-lang-theme" class="z-[51] flex-none">
			<LangDrop/>
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
                            <span class="hidden sm:inline font-medium">Light Mode</span>
						{:else}
							<span class="text-lg">🌙</span>
							<span class="hidden sm:inline font-medium">Dark Mode</span>
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
		<p class="text-sm text-gray-400"><a href="https://github.com/CyleAR/idoly-musics" target="_blank" rel="noopener noreferrer">Source</a> @ <a href={commitLink} target="_blank rel="noopener noreferrer>{commitHash}</p>
	</footer>
</div>

<style>
	.drawer-menu:hover {
		cursor: pointer;
		transition: transform 0.2s ease;
	}
    .drawer-side {
        top: 5rem; /* 네비게이션 바의 높이만큼 설정 */
    }
	.drawer-menu:active {
		transform: scale(0.95);
	}
</style>
