<script lang="ts">
	import type { PageData } from '../../routes/$types';
	import { currentLanguage, selectedBlock } from '$lib/stores';
	import SideNavigation from '$lib/components/side-nav.svelte';
	import Content from '$lib/components/content.svelte';
	import { browser } from '$app/environment';
	import { invalidateAll } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	export let data: PageData;

	let scrollY: number;
	let drawerTop = 26;

	$: if (browser) {
		if (scrollY > 26) {
			drawerTop = Math.max(0, 26 - scrollY);
		} else {
			drawerTop = 110;
		}
	}

	let imgSrc = '/images/music/0.webp';
	let base = '/images/music/0.webp';

	$: if (selectedBlock) {
		imgSrc = `/images/music/${$selectedBlock}.webp`;
	}

	function handleImageError() {
		imgSrc = base;
	}

	$: isDrawerOpen = $selectedBlock !== null;

	$: if ($currentLanguage && browser) {
		invalidateAll();
	}
</script>

<svelte:window bind:scrollY />

<div class="relative flex h-[2600px] flex-row {isDrawerOpen ? 'px-0' : 'px-36'} py-12">
	{#if !isDrawerOpen}
		<SideNavigation {data} />
	{/if}
	<div id="seperator" class="p-3" />
	<Content {data} />

	{#if isDrawerOpen}
		<div
			class="fixed right-0 z-50 flex h-full w-[29%] flex-col overflow-y-auto rounded-xl bg-base-100 p-8 shadow-xl"
			style="top: {drawerTop}px; transition: top 0.2s ease-out;"
			transition:fly={{ x: 600, duration: 300, easing: quintOut }}
		>
			<!-- 앨범 이미지 섹션 -->
			<div class="relative mb-4 flex w-full justify-center rounded-xl bg-base-200 p-4">
				<img
					src={imgSrc}
					class="aspect-square w-96 rounded-lg object-cover"
					alt="Album cover"
					on:error={handleImageError}
				/>
			</div>

			<!-- 제목 섹션 -->
			<div class="mb-2 text-2xl font-bold">
				<span> {data.musics.results[$selectedBlock].music_name} </span>
			</div>

			<!-- 태그 섹션 -->
			<div class="mb-4 flex flex-wrap gap-2">
				<div class="">{data.musics.results[$selectedBlock].groups[0].name}</div>
				<div class="btn h-2">자켓</div>
				<div class="btn h-2">유튜브</div>
				<div class="btn h-2">MV</div>
			</div>

			<!-- 가사 섹션 -->
			<div class="h-full w-full whitespace-pre-line rounded-xl bg-base-200 text-base"></div>
		</div>
	{/if}
</div>
