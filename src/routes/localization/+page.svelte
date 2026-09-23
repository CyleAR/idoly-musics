<script context="module" lang="ts">
	declare const __COMMIT_HASH__: string;
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { patchGuides } from '$lib/patch-guide';
	import SiteNavigation from '$lib/components/site-navigation.svelte';
	export let data: PageData;

	let selected = 'android';
	let dark = false;
	let isDrawerOpen = false;
	const commitHash = __COMMIT_HASH__.slice(0, 7);
	const commitLink = `https://github.com/CyleAR/idoly-musics/tree/${__COMMIT_HASH__}`;
	$: guide = patchGuides.find((item) => item.id === selected) ?? patchGuides[0];

	onMount(() => {
		dark = (localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark';
		document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
		const syncPlatform = () => { selected = location.hash === '#ios' ? 'ios' : 'android'; };
		syncPlatform();
		window.addEventListener('hashchange', syncPlatform);
		return () => window.removeEventListener('hashchange', syncPlatform);
	});
	function toggleTheme() {
		dark = !dark;
		const theme = dark ? 'dark' : 'light';
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
	}
	function selectPlatform(id: string) {
		selected = id;
		isDrawerOpen = false;
		location.hash = id;
	}
	function changedSegments(before: string, after: string) {
		const oldChars = Array.from(before);
		const newChars = Array.from(after);
		let start = 0;
		while (start < oldChars.length && start < newChars.length && oldChars[start] === newChars[start]) start++;
		let end = 0;
		while (end < oldChars.length - start && end < newChars.length - start && oldChars[oldChars.length - end - 1] === newChars[newChars.length - end - 1]) end++;
		return {
			prefix: oldChars.slice(0, start).join(''),
			before: oldChars.slice(start, oldChars.length - end).join(''),
			after: newChars.slice(start, newChars.length - end).join(''),
			suffix: oldChars.slice(oldChars.length - end).join('')
		};
	}
</script>

<svelte:window on:keydown={(event) => { if (event.key === 'Escape') isDrawerOpen = false; }} />

<svelte:head>
	<title>IDOLY PRIDE 한글패치</title>
	<meta name="description" content="IDOLY PRIDE 안드로이드·iOS 한글패치 다운로드와 설치 안내" />
	<meta property="og:title" content="IDOLY PRIDE 한글패치" />
	<meta property="og:description" content="기기에 맞는 한글패치를 다운로드하고 설치 방법을 확인하세요." />
</svelte:head>

<div class="patch-page flex min-h-screen flex-col bg-base-300 text-base-content">
	<header class="navbar fixed top-0 z-[100] h-16 w-full bg-base-100 px-3 text-base-content shadow-md lg:px-6">
		<nav class="flex w-full items-center" aria-label="메인 메뉴">
			<div class="flex min-w-0 flex-1 items-center">
				<div class="drawer w-auto">
					<input id="patch-menu" type="checkbox" class="drawer-toggle" bind:checked={isDrawerOpen} />
					<div class="drawer-content flex">
						<button class="flex h-8 w-8 items-center justify-center" on:click={() => isDrawerOpen = !isDrawerOpen} aria-label={isDrawerOpen ? '메뉴 닫기' : '메뉴 열기'} aria-expanded={isDrawerOpen} aria-controls="patch-navigation">
							<svg class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
								{#if isDrawerOpen}<path d="M6 18L18 6M6 6l12 12" />{:else}<path d="M4 18h16M4 12h16M4 6h16" />{/if}
							</svg>
						</button>
					</div>
					<div class="drawer-side patch-drawer">
						<label for="patch-menu" aria-label="메뉴 닫기" class="drawer-overlay"></label>
						<ul id="patch-navigation" class="menu min-h-full w-80 max-w-[85vw] bg-base-200 p-4 text-base text-base-content">
							<SiteNavigation onNavigate={() => isDrawerOpen = false} />
						</ul>
					</div>
				</div>
				<a href="/localization" class="ml-5 truncate text-base font-bold md:text-xl">IDOLY PRIDE</a>
			</div>
			<div class="menu menu-horizontal shrink-0 px-1">
				<button class="btn" on:click={toggleTheme} aria-label={dark ? '밝은 테마로 전환' : '어두운 테마로 전환'}>
					<span class="text-lg">{dark ? '🌙' : '☀️'}</span>
					<span class="hidden font-medium sm:inline">{dark ? 'Dark Mode' : 'Light Mode'}</span>
				</button>
			</div>
		</nav>
	</header>

	<main class="mx-auto w-full max-w-6xl flex-1 px-3 pb-8 pt-20 lg:px-6">
		<div class="mb-6">
			<h1 class="text-xl font-bold md:text-2xl">한글패치 다운로드 및 설치</h1>
			<p class="mt-2 text-base leading-7 opacity-70">사용 중인 기기를 선택해 설치 순서를 확인하세요.</p>
		</div>

		<section aria-labelledby="platform-heading">
			<h2 id="platform-heading" class="mb-3 font-bold">기기 선택</h2>
			<div class="grid gap-3 sm:grid-cols-2">
				{#each patchGuides as platform}
					<button
						class="platform-card rounded-xl border-2 bg-base-100 p-4 text-left transition-colors"
						class:border-primary={selected === platform.id}
						class:border-transparent={selected !== platform.id}
						aria-pressed={selected === platform.id}
						aria-controls="install-guide"
						on:click={() => selectPlatform(platform.id)}
					>
						<span class="flex items-center justify-between gap-2">
							<span class="text-base font-bold">{platform.name}</span>
							<span class="badge" class:badge-primary={selected === platform.id}>{selected === platform.id ? '선택됨' : platform.badge}</span>
						</span>
						<span class="mt-2 block text-sm opacity-60">{platform.device}</span>
					</button>
				{/each}
			</div>
		</section>

		<section id="install-guide" class="mt-4 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]" aria-labelledby="guide-heading">
			<div class="rounded-xl bg-base-100 p-4 sm:p-6">
				<div class="mb-6 border-b border-base-200 pb-4">
					<h2 id="guide-heading" class="text-lg font-bold">{guide.name} 설치 방법</h2>
					<p class="mt-2 text-base leading-7 opacity-70">{guide.summary}</p>
				</div>
				<ol class="space-y-6">
					{#each guide.steps as step, index}
						<li class="flex gap-4">
							<span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{index + 1}</span>
							<div class="min-w-0">
								<h3 class="pt-1 font-bold">{step.title}</h3>
								<p class="mt-2 whitespace-pre-line break-words text-base leading-8 opacity-75">{step.text}</p>
								{#if index === 0 && guide.preparation}
									<a class="link link-primary mt-3 inline-block text-sm" href={guide.preparation.url} target="_blank" rel="noopener noreferrer">{guide.preparation.label} ↗</a>
								{/if}
								{#if index === 0 && guide.alternativePreparation}
									<a class="link link-primary ml-4 mt-3 inline-block text-sm" href={guide.alternativePreparation.url} target="_blank" rel="noopener noreferrer">{guide.alternativePreparation.label} ↗</a>
								{/if}
							</div>
						</li>
					{/each}
				</ol>
			</div>

			<aside class="space-y-4" aria-label="다운로드 및 주의사항">
				<div class="rounded-xl bg-base-100 p-4 sm:p-6">
					<h2 class="text-lg font-bold">다운로드</h2>
					{#each guide.downloads as download}
						<p class="mb-4 mt-2 text-base leading-7 opacity-70">{download.detail}</p>
						<a class="btn btn-primary w-full" href={download.url} target="_blank" rel="noopener noreferrer">{download.label} ↗</a>
					{/each}
					{#if guide.files.length}
						<ul class="mt-4 space-y-2 text-xs opacity-65">
							{#each guide.files as file}<li class="break-all">{file}</li>{/each}
						</ul>
					{/if}
					<p class="mt-4 text-xs leading-5 opacity-50">외부 배포 페이지 또는 파일이 새 탭에서 열립니다.</p>
				</div>
				<div class="rounded-xl bg-base-200 p-4 sm:p-6">
					<h2 class="mb-3 font-bold">설치 전에 알아두세요</h2>
					<ul class="list-disc space-y-3 pl-4 text-base leading-7 opacity-75">
						{#each guide.notes as note}<li>{note}</li>{/each}
					</ul>
				</div>
			</aside>
		</section>

		<section class="mt-4 rounded-xl bg-base-100 p-4 sm:p-6" aria-labelledby="recent-work-heading">
			<div class="flex flex-wrap items-center justify-between gap-3">
				<h2 id="recent-work-heading" class="text-lg font-bold">최근 번역</h2>
				<a href="https://hoshimistation.cyle.me/" target="_blank" rel="noopener noreferrer" class="link link-primary text-sm">번역 대시보드 열기 ↗</a>
			</div>
			{#if data.recentWork.length}
				<ul class="mt-4 divide-y divide-base-200">
					{#each data.recentWork as item (item.id)}
						{@const diff = changedSegments(item.previous_text ?? '', item.translation_text)}
						<li class="py-4 first:pt-0 last:pb-0">
							<div class="flex flex-wrap items-center justify-between gap-1">
								<strong>{item.translator_name}</strong>
								<time class="text-xs opacity-70" datetime={item.changed_at.replace(' ', 'T')}>{item.changed_at}</time>
							</div>
							{#if item.scope_type && item.scope_id}<p class="mt-1 break-all text-xs opacity-70">{item.scope_type} · {item.scope_id}</p>{/if}
							<p class="mt-2 break-all text-xs opacity-70">{item.category} · {item.source_file} · {item.field_path}</p>
							<p class="my-3 whitespace-pre-wrap break-words text-sm leading-6">{item.original_text}</p>
							<div class="space-y-2">
								<div class="rounded-r-lg border-l-2 border-warning bg-base-200 p-3">
									<p class="text-xs opacity-70">변경 전 · 이전 번역자: {item.previous_translator_name ?? '기록 없음'}</p>
									<p class="mt-1 whitespace-pre-wrap break-words text-base leading-7">{#if item.previous_text === null}이전 번역 없음{:else}{diff.prefix}{#if diff.before}<mark class="rounded bg-warning/30 text-inherit">{diff.before}</mark>{/if}{diff.suffix}{/if}</p>
								</div>
								<div class="rounded-r-lg border-l-2 border-success bg-base-200 p-3">
									<p class="text-xs opacity-70">변경 후 · 번역자: {item.translator_name}</p>
									<p class="mt-1 whitespace-pre-wrap break-words text-base font-semibold leading-7">{diff.prefix}{#if diff.after}<mark class="rounded bg-success/30 text-inherit">{diff.after}</mark>{/if}{diff.suffix}</p>
								</div>
							</div>
						</li>
					{/each}
				</ul>
			{:else if data.recentWorkAvailable}
				<p class="mt-3 text-sm">표시할 최근 번역이 없습니다.</p>
			{:else}
				<p class="mt-3 text-sm">최근 번역을 불러오지 못했습니다. 번역 대시보드에서 확인해 주세요.</p>
			{/if}
		</section>
	</main>
	<footer class="mt-auto bg-base-100 px-3 py-4 text-center text-sm text-gray-400 shadow-inner">
		<p>[<a class="link link-hover link-primary" href="https://github.com/CyleAR/idoly-musics" target="_blank" rel="noopener noreferrer">Source</a> @ <a class="link link-hover link-primary" href={commitLink} target="_blank" rel="noopener noreferrer">{commitHash}</a>]</p>
		<p>This site is a fan site of <a class="link link-hover link-primary" href="https://idolypride.jp" target="_blank" rel="noopener noreferrer">IDOLY PRIDE</a></p>
		<p>한글패치는 비공식 수정 앱입니다. 설치 전 주의사항을 확인해 주세요.</p>
		<p>Contents © QualiArts and its associates</p>
	</footer>
</div>

<style>
	.patch-drawer { top: 4rem; }
	.platform-card:hover { border-color: oklch(var(--p) / 0.5); }
	.platform-card:focus-visible { outline: 2px solid oklch(var(--p)); outline-offset: 4px; }
	:global([data-theme='dark']) .patch-page { color: #e3e8f2; }
	:global([data-theme='dark']) .patch-page :global(.opacity-50),
	:global([data-theme='dark']) .patch-page :global(.opacity-60),
	:global([data-theme='dark']) .patch-page :global(.opacity-65),
	:global([data-theme='dark']) .patch-page :global(.opacity-70),
	:global([data-theme='dark']) .patch-page :global(.opacity-75) { opacity: 0.92; }
	:global([data-theme='dark']) .patch-page footer { color: inherit; }
</style>
