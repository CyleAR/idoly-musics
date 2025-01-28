<script lang="ts">
	import {
		global_theme,
		currentLanguage,
		artistFilter,
		groupFilter,
		albumFilter,
        youtubeFilter,
        mvFilter,
        liveFilter,
		isFilterEmpty,
		searchInputValue,
		resetFilters,
		view_mode,
		selectedBlock,
		current_page
	} from '$lib/stores';
	import { language_table } from '$lib/lang.ts';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	import Profile from './profile.svelte';
	import Table from './table.svelte';
	import Block from './block.svelte';

	export let data: PageData;
	export let itemsPerPage = 16; // 페이지당 표시할 항목 수
	export let onHeightChange: (height: number) => void;

	onMount(() => {
		const initialState = { page: $current_page };
		history.replaceState(initialState, '', window.location.href);

		window.addEventListener('popstate', handlePopState);

		return () => {
			window.removeEventListener('popstate', handlePopState);
		};
	});

	$: blocks_info = data.musics.results;
	$: groupCache = data.musics.groupCache;
	$: artistCache = data.musics.artistCache;
	$: albumCache = data.musics.albumCache;

	$: content_lang = language_table[$currentLanguage]['content'];

	$: filteredBlocks = blocks_info.filter((block) => {
		// filter가 비어있으면 모든 블록 표시
		if ($isFilterEmpty && $searchInputValue === '' && (!$youtubeFilter && !$mvFilter && !$liveFilter)) return true;

		$current_page = 1;

        const videoFilterMatch = () => {
            if ($youtubeFilter && !block.stream_url) return false;
            if ($mvFilter && !block.mv_url) return false;
            if ($liveFilter && !block.live_url) return false;
            
            return true;
        }


		// 검색어 필터 적용
		const nameMatch = block.music_name.toLowerCase().includes($searchInputValue.toLowerCase());
		// 각 카테고리별 필터 적용
		const groupMatch =
			$groupFilter.length === 0 ||
			$groupFilter.every((id) => block.groups.some((group) => group.id === id));
		const artistMatch =
			$artistFilter.length === 0 ||
			$artistFilter.every((id) => block.artists.some((artist) => artist.id === id));
		const albumMatch =
			$albumFilter.length === 0 ||
			$albumFilter.every((id) => block.albums.some((album) => album.id === id));
        
        if ($youtubeFilter || $mvFilter || $liveFilter) {
            return artistMatch && groupMatch && albumMatch && nameMatch && videoFilterMatch();
        }
		return artistMatch && groupMatch && albumMatch && nameMatch;
	});

	// 전체 페이지 수 계산
	$: totalPages = Math.ceil(filteredBlocks.length / itemsPerPage);

	// 필터링 된 blocks 에서 16개씩 가져오기
	$: paginatedBlocks = filteredBlocks.slice(
		($current_page - 1) * itemsPerPage,
		$current_page * itemsPerPage
	);

	function handlePopState(event: PopStateEvent) {
		if (event.state?.page) {
			$current_page = event.state.page;
			document.getElementById('content-main')?.scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});
		}
	}

	function goToPage(page: number) {
		if (page !== $current_page) {
			$current_page = page;
			// 새로운 페이지 상태를 history에 추가
			const newState = { page: page };
			const newUrl = new URL(window.location.href);
			newUrl.searchParams.set('page', page.toString());
			history.pushState(newState, '', newUrl);

			// 스크롤 위치 조정
			document.getElementById('content-main')?.scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});
		}
	}

	function calculateBlockHeight(block: { artists: string[]; groups: string[] }): string {
		const artistCount = block.artists.length;
		const groupCount = block.groups.length;

		if (artistCount >= 9 || groupCount >= 5) {
			return 'h-[7rem]'; // 큰 높이
		}
		return 'h-[6rem]'; // 중간 높이
	}

	$: contentHeight = paginatedBlocks.reduce((height, block) => {
		const blockHeight = parseFloat(calculateBlockHeight(block).match(/\d+/)[0]);
		if ($view_mode.startsWith('viewBy')) {
			return height + blockHeight + 2;
		}
		return height + blockHeight + 0.4; // 0.5rem 여백
	}, 0);

	// 계산된 Height 를 상위 컴포넌트로 전파 ( +page.svelte )
	$: onHeightChange(contentHeight);

	function getColorTag(block: typeof data) {
		return block.groups[0].id === 8 ? block.artists[0]?.color : block.groups[0]?.color;
	}

	const HEADERS = [
		{ class: 'w-24 flex-shrink-0', text: ' ' },
		{ class: 'flex-grow', text: 'songName' },
		{ class: 'w-[40%] sm:w-[25%] md:w-[20%] lg:w-[15%] flex-shrink-0', text: 'group' },
		{
			class: 'w-[40%] sm:w-[40%] md:w-[35%] lg:w-[31%] flex-shrink-1 hidden sm:flex',
			text: 'artist'
		},
		{ class: 'w-[20%] flex-shrink-0 hidden md:flex', text: 'album' },
		{ class: 'w-[10%] flex-shrink-0 hidden lg:flex', text: 'releaseDate' }
	];

	$: sideNav_lang = language_table[$currentLanguage]['sideNav'];

	function showModal(id: string) {
		const modal = document.getElementById(id) as HTMLDialogElement;
		if (modal) {
			modal.showModal();
		}
	}

	function toggleFilter(filter) {
        filter.update(value => !value);
    }

	const FILTER_ICON = {
		viewBox: '0 0 24 24',
		paths: ['M4 18H10', 'M4 12L16 12', 'M4 6L20 6']
	};
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div id="contents-wrapper" class="duration-50 flex transition-all">
	<div
		id="content-main"
		style="height: {contentHeight + 5}rem"
		class="w-full rounded-lg bg-base-100 shadow-lg"
	>
		{#if $view_mode == 'viewByAlbums'}
			<Table {data} cache={albumCache} type={'album'} />
		{:else if $view_mode == 'viewByGroup'}
			<Table {data} cache={groupCache} type={'group'} />
		{:else if $view_mode == 'viewByArtist'}
			<Table {data} cache={artistCache} type={'artist'} />
		{:else}
			<div id="content-header" class="flex flex w-full text-center">
				{#each HEADERS as header}
					<div id="header-wrapper" class={`flex ${header.class} items-center justify-center py-1`}>
						{#if header.text}
							<div
								class="header-text flex items-center gap-1"
								role="button"
								tabindex="0"
								on:click={() => showModal(header.text)}
							>
								<span>{content_lang[header.text]}</span>
                                {#if header.text === 'songName'}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 16 16"
                                        fill="currentColor"
                                        class="h-4 w-4"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                            clip-rule="evenodd"
                                        />
                                    </svg>
                                {/if}
                                {#if header.text === ' '}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        class="h-4 w-4">
                                        <path fill-rule="evenodd"
                                        d="M3.792 2.938A49.069 49.069 0 0 1 12 2.25c2.797 0 5.54.236 8.209.688a1.857 1.857 0 0 1 1.541 1.836v1.044a3 3 0 0 1-.879 2.121l-6.182 6.182a1.5 1.5 0 0 0-.439 1.061v2.927a3 3 0 0 1-1.658 2.684l-1.757.878A.75.75 0 0 1 9.75 21v-5.818a1.5 1.5 0 0 0-.44-1.06L3.13 7.938a3 3 0 0 1-.879-2.121V4.774c0-.897.64-1.683 1.542-1.836Z"
                                        clip-rule="evenodd"
                                        />
                                    </svg>
                                {/if}
								{#if header.text !== 'songName' && header.text !== 'releaseDate' && header.text !== ' '}
									<svg
										class="h-4 w-4"
										xmlns="http://www.w3.org/2000/svg"
										viewBox={FILTER_ICON.viewBox}
										fill="currentColor"
									>
										{#each FILTER_ICON.paths as path}
											<path
												d={path}
												stroke="currentColor"
												stroke-width="2"
												stroke-linecap="round"
											/>
										{/each}
									</svg>
								{/if}
							</div>
						{/if}
					</div>
				{/each}
			</div>
			<div id="content-blocks" class="gap flex h-full w-full flex-col">
				{#each paginatedBlocks as block}
					<div class="flex w-[100%] p-1">
						<Block
							id={block.id}
							title={block.music_name}
							artists={block.artists}
							groups={block.groups}
							colorTag={getColorTag(block)}
							included_albums={block.albums}
							announce_date={block.announce_date || '?'}
						/>
					</div>
				{/each}
			</div>

			<div id="content-pagination" class="flex flex-wrap justify-center gap-2 p-4">
				{#if $current_page > 1}
					<button class="btn btn-circle btn-sm" on:click={() => goToPage($current_page - 1)}>
						«
					</button>
				{/if}

				{#each Array(totalPages) as _, i}
					<button
						class="btn btn-circle btn-sm {$current_page === i + 1 ? 'btn-primary' : ''}"
						on:click={() => goToPage(i + 1)}
					>
						{i + 1}
					</button>
				{/each}

				{#if $current_page < totalPages}
					<button class="btn btn-circle btn-sm" on:click={() => goToPage($current_page + 1)}>
						»
					</button>
				{/if}
			</div>
		{/if}
	</div>
</div>

<!-- 필터링 모달 -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- 요소 필터링창 -->
<dialog id=" " class="modal">
	<div id="modal-filter" class="modal-box flex flex-col max-w-lg items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8">
        <div class="form-control">
            <label class="label cursor-pointer">
                <span class="label-text">Youtube</span>
                <input type="checkbox" class="checkbox checkbox" bind:checked={$youtubeFilter}/>
            </label>
        </div>
        <div class="form-control">
            <label class="label cursor-pointer">
                <span class="label-text">MV </span>
                <input type="checkbox" class="checkbox" bind:checked={$mvFilter}/>
            </label>
        </div>
        <div class="form-control">
            <label class="label cursor-pointer">
                <span class="label-text">3DMV</span>
                <input type="checkbox" class="checkbox" bind:checked={$liveFilter}/>
            </label>
        </div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<!-- 이름 검색창 -->
<dialog id="songName" class="modal">
	<div id="modal-title" class="modal-box flex max-w-lg items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8">
		<input
			type="search"
			placeholder="ex) song for you"
			class="input input-bordered w-full"
			bind:value={$searchInputValue}
		/>
		<!-- <button
			class="btn btn-circle btn-outline btn-xs absolute right-[1rem]"
			on:click={() => ($searchInputValue = '')}>X</button
		> -->
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<!-- 그룹 -->
<dialog id="group" class="modal">
	<div id="modal-group"class="modal-box max-w-6xl p-2 sm:p-4 md:p-6 lg:p-8">
		<div class="mb-4 text-center text-lg font-bold">{sideNav_lang['viewByGroupModal'].title}</div>
		<Profile data={groupCache} type={'group'} />
		<div class="modal-action flex justify-center">
			<form method="dialog">
				<button class="btn">{sideNav_lang['viewByGroupModal'].close}</button>
			</form>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<!-- 아티스트 -->
<dialog id="artist" class="modal">
	<div id="modal-artist" class="modal-box max-w-6xl p-2 sm:p-4 md:p-6 lg:p-8">
		<div class="mb-4 text-center text-lg font-bold">{sideNav_lang['viewByArtistModal'].title}</div>
		<Profile data={artistCache} type={'artist'} />
		<div class="modal-action flex justify-center">
			<form method="dialog">
				<button class="btn">{sideNav_lang['viewByArtistModal'].close}</button>
			</form>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<!-- 앨범 -->
<dialog id="album" class="modal">
	<div id="modal-album" class="modal-box max-w-6xl p-2 sm:p-4 md:p-6 lg:p-8">
		<div class="mb-4 text-center text-lg font-bold">{sideNav_lang['viewByAlbumModal'].title}</div>
		<Profile data={albumCache} type={'album'} />
		<div class="modal-action flex justify-center">
			<form method="dialog">
				<button class="btn">{sideNav_lang['viewByAlbumModal'].close}</button>
			</form>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<style lang="postcss">
	.header-text:hover {
		cursor: pointer;
		transition: transform 0.2s ease;
	}

	.header-text:active {
		transform: scale(0.95);
	}

	.icon-white {
		-webkit-filter: brightness(0) invert(1);
		filter: brightness(0) invert(1);
	}

	.icon-black {
		-webkit-filter: brightness(0);
		filter: brightness(0);
	}
</style>
