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
		music_images,
        artistFilter,
	} from '$lib/stores';
	import { language_table } from '$lib/lang.ts';
	import SideNavigation from '$lib/components/side-nav.svelte';
	import Content from '$lib/components/content.svelte';
	import { browser } from '$app/environment';
	import { invalidateAll } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	export let data: PageData;

	$: info_type = 'jacket';
	$: content_lang = language_table[$currentLanguage]['page'];
	$: mvId = '';
	$: streamId = '';
	$: liveId = '';
	$: disable_youtube_btn_flag = true;
	$: disable_mv_btn_flag = true;
	$: disable_live_btn_flag = true;
	$: if ($selectedBlock >= 1) {
		// console.log($selectedBlock - 1);
		// console.log(data.musics.results[$selectedBlock - 1]);
		let _mvid = data.musics.results[$selectedBlock - 1].mv_url;
		let _streamid = data.musics.results[$selectedBlock - 1].stream_url;
		let _liveid = data.musics.results[$selectedBlock - 1]?.live_url;

		disable_mv_btn_flag = _mvid == '' ? true : false;
		disable_live_btn_flag = _liveid == '' ? true : false;
		disable_youtube_btn_flag = _streamid == '' ? true : false;

		mvId = _mvid.split('/').pop();
		liveId = _liveid.split('/').pop();
		streamId = _streamid.split('/').pop();
		info_type = 'jacket';
	}

	$group_images = import.meta.glob('/src/images/group/*.webp', { eager: true });
	$album_images = import.meta.glob('/src/images/album/*.webp', { eager: true });
	$artist_images = import.meta.glob('/src/images/artist/*.webp', { eager: true });
	$music_images = import.meta.glob('/src/images/music/*.webp', { eager: true });

	// 이미지 타입에 따라 적절한 이미지 객체를 반환하는 함수
	function getImageCollection(type) {
		switch (type) {
			case 'group':
				return $group_images;
			case 'album':
				return $album_images;
			case 'artist':
				return $artist_images;
			case 'music':
				return $music_images;
			default:
				return {};
		}
	}

	// 이미지 로드 함수
	function loadImage(type, id) {
		const images = getImageCollection(type);
		const imagePath = `/src/images/${type}/${id}.webp`;
		const exists = images[imagePath];
		return exists ? exists.default : images[`/src/images/${type}/0.webp`].default;
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

	function getSoloArtist() {
		return data.musics.results[$selectedBlock - 1].groups[0]?.id === 8
			? data.musics.results[$selectedBlock - 1].artists[0]?.name
			: data.musics.results[$selectedBlock - 1].groups[0]?.name;
	}
</script>

<svelte:head>
	<title>IDOLY MUSICS</title>
</svelte:head>

<div id="page-wrapper" class="relative flex flex-row" style="height: {contentHeight}rem">
	<div id="page-main" class="flex-1 pt-2">
		<Content {data} onHeightChange={updateContentHeight} />
	</div>
	<style>
		#page-main {
			padding-left: 0;
			padding-right: 0;
		}

		@media (min-width: 1280px) {
			#page-main {
				padding-left: 4rem;
				padding-right: 4rem;
			}
		}

		@media (min-width: 1536px) {
			#page-main {
				padding-left: 8rem;
				padding-right: 8rem;
			}
		}

		@media (min-width: 1920px) {
			#page-main {
				padding-left: 16rem;
				padding-right: 16rem;
			}
		}
	</style>

	<!-- 블록 선택 시 나타나는 Drawer -->
	{#if isDrawerOpen}
		<div
			id="music-drawer"
			class="fixed right-1 top-[4rem] z-[40] mt-2 flex h-[93.5%] w-[75%] flex-col overflow-y-auto rounded-xl bg-base-100 p-3 shadow-xl scrollbar-hide sm:w-[66%] md:w-[55%] lg:w-[41.25%] xl:w-[33%] 2xl:w-[27.5%]"
			style="transition: top 0.2s ease-out;"
			transition:fly={{ x: 600, duration: 300, easing: quintOut }}
		>
			<!-- 버튼 섹션 -->
			<div class="m-2 flex flex-wrap items-center justify-between text-sm sm:text-base lg:text-lg">
				<div>
					<button
						class="btn btn-xs sm:btn-sm {info_type === 'jacket'
							? $global_theme === 'dark'
								? 'bg-blue-700 text-white'
								: 'bg-blue-500 text-white'
							: ''} hover:bg-blue-600"
						on:click={() => {
							info_type = 'jacket';
						}}
					>
						{content_lang['drawer']['jacket']}
					</button>
					<button
						class="btn btn-xs sm:btn-sm {info_type === 'youtube'
							? $global_theme === 'dark'
								? 'bg-blue-700 text-white'
								: 'bg-blue-500 text-white'
							: ''} hover:bg-blue-600"
						disabled={disable_youtube_btn_flag}
						on:click={() => {
							info_type = 'youtube';
						}}
					>
						{content_lang['drawer']['youtube']}
					</button>
					<button
						class="btn btn-xs sm:btn-sm {info_type === 'mv'
							? $global_theme === 'dark'
								? 'bg-blue-700 text-white'
								: 'bg-blue-500 text-white'
							: ''} hover:bg-blue-600"
						disabled={disable_mv_btn_flag}
						on:click={() => {
							info_type = 'mv';
						}}
					>
						MV
					</button>
					<button
						class="btn btn-xs sm:btn-sm {info_type === 'live'
							? $global_theme === 'dark'
								? 'bg-blue-700 text-white'
								: 'bg-blue-500 text-white'
							: ''} hover:bg-blue-600"
						disabled={disable_live_btn_flag}
						on:click={() => {
							info_type = 'live';
						}}
					>
						3DMV
					</button>
					<!-- 닫기 버튼 -->
					<button
						class="btn btn-circle btn-outline btn-xs absolute right-3 sm:btn-sm"
						on:click={() => {
							selectedBlock.set(null);
						}}
					>
						X
					</button>
				</div>
			</div>
			{#if info_type == 'jacket'}
				<!-- 앨범 이미지 섹션 -->
				<div
					id="music-drawer-jacket"
					class="relative flex w-full justify-center rounded-xl bg-base-200 p-2"
				>
					<img
						src={loadImage('music', $selectedBlock)}
						class="aspect-square w-full rounded-lg rounded-xl object-cover"
						alt="Album cover"
					/>
				</div>
			{:else if info_type == 'youtube'}
				<!-- 유튜브 섹션 -->
				<div id="music-drawer-youtue" class="aspect-h-9 aspect-w-16">
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
				<div id="music-drawer-mv" class="aspect-h-9 aspect-w-16">
					<iframe
						class="h-full w-full rounded-lg"
						src={`https://www.youtube.com/embed/${mvId}`}
						title="YouTube video player"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen
					></iframe>
				</div>
			{:else if info_type == 'live'}
				<!-- 3D라이브 섹션 -->
				<div id="music-drawer-3dlive" class="aspect-h-9 aspect-w-16">
					<iframe
						class="h-full w-full rounded-lg"
						src={`https://www.youtube.com/embed/${liveId}`}
						title="YouTube video player"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen
					></iframe>
				</div>
			{/if}
			<!-- 제목 섹션 -->
			<!-- selectedBlock은 1부터 시작하는 id이고 results는 0부터 세는 배열이라서 -1 해줌  -->
			<div id="music-drawer-title" class="mt-1 pl-2 text-lg font-bold sm:text-xl lg:text-2xl">
				<span> {data.musics.results[$selectedBlock - 1].music_name} </span>
			</div>
			<!-- 그룹 섹션 -->
			<div id="music-drawer-group" class="pl-2 text-base sm:text-lg lg:text-xl">
				{getSoloArtist()}
			</div>
			<!-- 아티스트 정보 섹션 -->
			<div id="music-drawer-artists" class="mb-1 mt-1 flex flex-wrap gap-1 pl-2">
                {#each data.musics.results[$selectedBlock - 1].artists as artist}
                    <button
                        on:click={() => {
                            view_mode.set('');
							artistFilter.set([artist.id]);
                        }}
                        class="btn btn-circle border-none hover:-translate-y-1 btn-xs sm:btn-sm md:btn-md"
                        style="background-image: url({loadImage('artist', artist.id)}); background-size: cover; background-position: center;"
						aria-label="artist"
                    >
                    </button>
                {/each}
			</div>
			<!-- 가사 섹션 -->
			<div
				id="music-drawer-lyrics"
				class="w-full whitespace-pre-line rounded-xl bg-base-200 p-4 text-base font-bold sm:text-lg"
			>
				{#if data.musics.results[$selectedBlock - 1].lyrics}
					{data.musics.results[$selectedBlock - 1].lyrics}
				{:else}
					<span class="text-gray-500">NO LYRICS DATA</span>
				{/if}
			</div>
			<!-- 앨범 정보 섹션 -->
			<div id="music-drawer-albums" class="mt-4 flex flex-wrap gap-1 rounded-xl bg-base-200 p-4">
				{#each data.musics.results[$selectedBlock - 1].albums as album}
					<div class="flex flex-col items-center">
						<img
							src={loadImage('album', album.id)}
							class="h-20 w-20 rounded-lg object-cover sm:h-24 sm:w-24 lg:h-28 lg:w-28"
							alt="album"
						/>
						<span class="text-xs sm:text-sm lg:text-base">{album.name}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
