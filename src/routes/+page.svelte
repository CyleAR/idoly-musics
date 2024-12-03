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

	let imgSrc = '/images/music/0.webp';
	let base = '/images/music/0.webp';
	let isLoading = true;

	$: if (selectedBlock) {
		imgSrc = `/images/music/${$selectedBlock}.webp`;
		isLoading = true;
	}

	function handleImageError() {
		imgSrc = base;
		isLoading = false;
	}

	function handleImageLoad() {
		isLoading = false;
	}

	$: isDrawerOpen = $selectedBlock !== null;

	$: if ($currentLanguage && browser) {
		invalidateAll();
	}

	let contentHeight = 0;

	// 하위 컴포넌트로( content.svelte ) 전달하는 callback 함수.
	// Height 를 전달 받음.
	function updateContentHeight(height: number) {
		contentHeight = height + 13; // 13 은 페이지 여백
	}
</script>

<div
	class="relative flex flex-row {isDrawerOpen ? 'px-0' : 'px-36'} py-12"
	style="height: {contentHeight + 5}rem"
>
	{#if !isDrawerOpen}
		<div class="fixed top-[110] z-50">
			<SideNavigation {data} />
		</div>
	{/if}
	<div
		class="{isDrawerOpen
			? 'ml-[1%] mr-[30%] px-4' // drawer 열린 경우
			: 'ml-[calc(10vh+3rem)]'} flex-1"
	>
		<Content {data} onHeightChange={updateContentHeight} />
	</div>

	{#if isDrawerOpen}
		<div
			class="fixed right-1.5 z-50 flex h-[90%] w-[30%] flex-col overflow-y-auto rounded-xl bg-base-100 p-4 shadow-xl"
			style="transition: top 0.2s ease-out;"
			transition:fly={{ x: 600, duration: 300, easing: quintOut }}
		>
			<!-- 앨범 이미지 섹션 -->
			<div class="relative mb-2 flex w-full justify-center rounded-xl bg-base-200 p-4">
				{#if isLoading}
					<div class="absolute inset-0 flex items-center justify-center">
						<span class="loading loading-spinner loading-md"></span>
					</div>
				{/if}
				<img
					src={imgSrc}
					class="aspect-square w-[50%] rounded-lg object-cover {isLoading
						? 'opacity-0'
						: 'opacity-100'}"
					alt="Album cover"
					on:error={handleImageError}
					on:load={handleImageLoad}
				/>
			</div>
			<!-- selectedBlock은 1부터 시작하는 id이고 results는 0부터 세는 배열이라서 -1 해줌  -->
			<!-- 제목 섹션 -->
			<div class="text-2xl font-bold">
				<span> {data.musics.results[$selectedBlock - 1].music_name} </span>
			</div>

			<!-- 태그 섹션 -->
			<div class="mb-2 flex flex-wrap items-center justify-between gap-2 text-lg">
				<div class="">
					{data.musics.results[$selectedBlock - 1].groups[0].name}
				</div>
				<div>
					<div
						class="btn !h-8 !min-h-0 {$currentLanguage == 'dark'
							? 'bg-blue-700'
							: 'bg-blue-500'} text-black"
					>
						자켓
					</div>
					<div class="btn !h-8 !min-h-0">유튜브</div>
					<div class="btn !h-8 !min-h-0">MV</div>
				</div>
			</div>

			<!-- 가사 섹션 -->
			<div
				class="scrollbar-hide text-bas4 min-h-[40%] w-full overflow-y-scroll whitespace-pre-line rounded-xl bg-base-200 p-6 text-lg font-bold"
			>
				{data.musics.results[$selectedBlock - 1].lyrics}
			</div>
		</div>
	{/if}
</div>
