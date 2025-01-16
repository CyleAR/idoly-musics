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

			view_mode.set('');
			//selectedBlock.set(null);
		}
	};

	$: content_lang = language_table[$currentLanguage]['sideNav'];

	function reset() {
        resetFilters();
        view_mode.set('');
		current_page.set(1);
        selectedBlock.set(null);
	}

    let isDrawerOpen = false;

    const commitHash = __COMMIT_HASH__.slice(0, 7);
    const commitLink = `https://github.com/CyleAR/idoly-musics/tree/${__COMMIT_HASH__}`;
</script>


<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="flex min-h-screen flex-col bg-base-300">
    <!-- 상단바 -->
	<div  id="navibar" class="navbar fixed top-0 z-[100] h-16 w-full bg-base-100 px-3 lg:px-6 shadow-md">
		<div id="logo" class="flex-1">
			<div id="left-drawer-wrapper" class="z-[52] flex">
                    <input id="left-drawer-checker" type="checkbox" class="drawer-toggle" bind:checked={isDrawerOpen}/>
                    <label for="left-drawer-checker" class="drawer-button flex justify-center">
                        <div id="left-drawer-button" class="swap swap-rotate">
                            <input id="left-drawer-checker" type="checkbox" class="drawer-toggle" bind:checked={isDrawerOpen}/>
                            
                            <!-- 햄버거 아이콘 -->
                            <svg
                                class="swap-off fill-current h-8 w-8"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <path d="M4 18L20 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                                <path d="M4 12L20 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                                <path d="M4 6L20 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                            </svg>
                
                            <!-- 닫기 아이콘 -->
                            <svg
                                aria-hidden="true"
                                aria-label="close sidebar"
                                class="swap-on fill-current h-8 w-8"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                            </svg>
                          </div>
                    </label>
					<div class="drawer-side">
						<label for="left-drawer-checker" aria-label="close sidebar" class="drawer-overlay"></label>
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
            <a id="logo-text" on:click={() => {reset(); isDrawerOpen = false;}} href="/" class="ml-5 font-bold text-base md:text-xl">IDOLY MUSICS</a>
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
	<div id="page" class="flex-1 pt-[4rem]">
		<slot /> <!-- 페이지 내용(+page.svelte) -->
	</div>
	<footer id="footer" class="mt-auto bg-base-100 py-4 text-center shadow-inner">
		<p class="text-sm text-gray-400">[<a class="link link-hover link-primary" href="https://github.com/CyleAR/idoly-musics" target="_blank" rel="noopener noreferrer">Source</a> @ <a class="link link-hover link-primary" href={commitLink} target="_blank" rel="noopener noreferrer">{commitHash}</a>]</p>
		<p class="text-sm text-gray-400">This site is a fan site of <a class="link link-hover link-primary" href="https://idolypride.jp" target="_blank" rel="noopener noreferrer">IDOLY PRIDE</a></p>
		<p class="text-sm text-gray-400">Some data may be inaccurate</p>
		<p class="text-sm text-gray-400">Contents © QualiArts and it's associates</p>
	</footer>
</div>

<style>
    .drawer-side {
        top: 4rem; /* 상단바의 높이만큼 설정 h-16=4rem */
    }
</style>
