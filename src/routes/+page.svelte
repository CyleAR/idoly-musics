<script lang="ts">
	import type { PageData } from '../../routes/$types';
	import {
        global_theme,
		currentLanguage,
		selectedBlock,
		view_mode,
		group_images,
		album_images,
		artist_images,
		music_images
	} from '$lib/stores';
	import { language_table } from '$lib/lang.ts';
	import SideNavigation from '$lib/components/side-nav.svelte';
	import Content from '$lib/components/content.svelte';
	import { browser } from '$app/environment';
	import { invalidateAll } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	export let data: PageData;

	$: info_type = 'jacket';
	$: content_lang = language_table[$currentLanguage]['page'];
	$: mvId = '';
	$: streamId = '';
	$: disable_youtube_btn_flag = false;
	$: disable_mv_btn_flag = false;
	$: if ($selectedBlock >= 1) {
		// console.log($selectedBlock - 1);
		// console.log(data.musics.results[$selectedBlock - 1]);
		let _mvid = data.musics.results[$selectedBlock - 1].mv_url;
		let _streamid = data.musics.results[$selectedBlock - 1].stream_url;

		disable_mv_btn_flag = _mvid == '' ? true : false;
		disable_youtube_btn_flag = _streamid == '' ? true : false;

		mvId = _mvid.split('/').pop();
		streamId = _streamid.split('/').pop();
		info_type = 'jacket';
	}

	$group_images = import.meta.glob('/src/images/group/*.webp', { eager: true });
	$album_images = import.meta.glob('/src/images/album/*.webp', { eager: true });
	$artist_images = import.meta.glob('/src/images/idol/*.webp', { eager: true });
	$music_images = import.meta.glob('/src/images/music/*.webp', { eager: true });

	function load_image() {
		// console.log(data.musics.results[$selectedBlock - 1]);
		const imagePath = `/src/images/music/${$selectedBlock}.webp`;
		const exists = $music_images[imagePath];
		return exists ? exists.default : $music_images[`/src/images/music/0.webp`].default;
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

<svelte:head>
	<title>IDOLY MUSICS</title>
</svelte:head>

<div
	class="relative flex flex-row px-0.5 lg:px-18 2xl:px-36 py-12"
	style="height: {contentHeight + 5}rem"
>
	<div
        id="page-main"
		class="flex-1"
	>
		<Content {data} onHeightChange={updateContentHeight} />
	</div>

	{#if isDrawerOpen}
        <div
            class="fixed right-1.5 z-50 flex h-[90%] w-[75%] sm:w-[60%] md:w-[45%] lg:w-[35%] xl:w-[30%] flex-col overflow-y-auto rounded-xl bg-base-100 p-4 shadow-xl"
            style="transition: top 0.2s ease-out;"
            transition:fly={{ x: 600, duration: 300, easing: quintOut }}
        >
			{#if info_type == 'jacket'}
				<!-- 앨범 이미지 섹션 -->
				<div class="relative mb-2 flex w-full justify-center rounded-xl bg-base-200 p-4">
					<img
						src={load_image()}
						class="aspect-square w-[50%] rounded-lg object-cover"
						alt="Album cover"
					/>
				</div>
			{:else if info_type == 'youtube'}
				<!-- 유튜브 섹션 -->
				<div class="aspect-w-16 aspect-h-9">
					<iframe
						class="h-full w-full rounded-lg"
						src={`https://www.youtube.com/embed/${streamId}`}
						title="YouTube video player"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen
					></iframe>
				</div>
			{:else if info_type == 'mv'}
				<!-- MV 섹션 -->
				<div class="aspect-w-16 aspect-h-9">
					<iframe
						class="h-full w-full rounded-lg"
						src={`https://www.youtube.com/embed/${mvId}`}
						title="YouTube video player"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen
					></iframe>
				</div>
			{/if}
			<!-- selectedBlock은 1부터 시작하는 id이고 results는 0부터 세는 배열이라서 -1 해줌  -->
			<!-- 제목 섹션 -->
			<div class="font-bold text-base md:text-lg lg:text-xl ">
				<span> {data.musics.results[$selectedBlock - 1].music_name} </span>
			</div>

			<!-- 태그 섹션 -->
			<div class="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm md:text-base lg:text-lg">
				<div>
					{data.musics.results[$selectedBlock - 1].groups[0].name}
				</div>
				<div>
					<button
						class="btn !h-8 !min-h-0 {$global_theme == 'dark'
							? 'bg-blue-700'
							: 'bg-blue-500'} text-white hover:bg-blue-600"
						on:click={() => {
							info_type = 'jacket';
						}}
					>
						{content_lang['drawer']['jacket']}
					</button>
					<button
						class="btn !h-8 !min-h-0"
						disabled={disable_youtube_btn_flag}
						on:click={() => {
							info_type = 'youtube';
						}}
					>
						{content_lang['drawer']['youtube']}
					</button>
					<button
						class="btn !h-8 !min-h-0"
						disabled={disable_mv_btn_flag}
						on:click={() => {
							info_type = 'mv';
						}}
					>
						MV
					</button>
				</div>
			</div>

			<!-- 가사 섹션 -->
			<div
				class="min-h-[40%] w-full overflow-y-scroll whitespace-pre-line rounded-xl bg-base-200 p-4 font-bold scrollbar-hide text-base sm:text-lg"
			>
				{data.musics.results[$selectedBlock - 1].lyrics}
			</div>
		</div>
	{/if}
</div>
