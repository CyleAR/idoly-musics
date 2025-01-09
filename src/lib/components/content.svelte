<script lang="ts">
	import {
		global_theme,
		currentLanguage,
        artistFilter,
        groupFilter,
        albumFilter,
        isFilterEmpty,
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

	$: isDrawerOpen = $selectedBlock !== null;
	$: content_lang = language_table[$currentLanguage]['content'];

	// 너무 무식한 방법이긴 한데..
	// 시간 너무 먹힌다
	// $: if (filteredBlocks) {
	// 	const selectedGroups = $filter.filter((name) =>
	// 		groupCache.some((group) => group.name === name)
	// 	);
	// 	// console.log(selectedGroups);
	// 	// console.log(filteredBlocks);
	// }

	$: filteredBlocks = blocks_info.filter((block) => {
		// filter가 비어있으면 모든 블록 표시
		if ($isFilterEmpty) return true;

		$current_page = 1;

        // 각 카테고리별 필터 적용
        const groupMatch = $groupFilter.length === 0 || $groupFilter.every((id) =>
            block.groups.some((group) => group.id === id)
        );
        const artistMatch = $artistFilter.length === 0 || $artistFilter.every((id) => 
            block.artists.some((artist) => artist.id === id)
        );
        const albumMatch = $albumFilter.length === 0 || $albumFilter.every((id) =>
            block.albums.some((album) => album.id === id)
        );

        return artistMatch && groupMatch && albumMatch;
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
		if ($view_mode == 'artist') {
			return height + blockHeight + 15;
		}
		return height + blockHeight + 0.7; // 0.5rem 여백
	}, 0);

	// 계산된 Height 를 상위 컴포넌트로 전파 ( +page.svelte )
	$: onHeightChange(contentHeight);

	function getColorTag(block: typeof data) {
		return block.groups[0].id === 8 ? block.artists[0]?.color : block.groups[0]?.color;
	}

	const HEADERS = [
		{ class: 'w-24 flex-shrink-0', text: '' },
		{ class: 'flex-grow', text: 'songName' },
		{ class: 'w-[40%] sm:w-[25%] md:w-[20%] lg:w-[15%] flex-shrink-0', text: 'group' },
		{ class: 'w-[40%] sm:w-[40%] md:w-[35%] lg:w-[31%] flex-shrink-1 hidden sm:flex', text: 'artist' },
		{ class: 'w-[20%] flex-shrink-0 hidden md:flex', text: 'album' },
		{ class: 'w-[10%] flex-shrink-0 hidden lg:flex', text: 'releaseDate' }
	];

	$: sideNav_lang = language_table[$currentLanguage]['sideNav'];

	function showModal(id: string) {
		const modal = document.getElementById(id) as HTMLDialogElement;
		if (modal) {
			//filter_type.set(id);
			modal.showModal();
			
		}

		// 이거 왜 넣었더라?
		$view_mode = id;
	}

	const FILTER_ICON = {
		viewBox: '0 0 24 24',
		paths: ['M4 18H10', 'M4 12L16 12', 'M4 6L20 6']
	};
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="duration-50 flex transition-all">
	<div
		id="contents-wrapper"
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
			<div id="header-wrapper" class="flex w-full flex text-center">
				{#each HEADERS as header}
					<div class={`flex ${header.class} py-1 items-center justify-center`}>
						{#if header.text}
							<div
								class="header-text flex items-center gap-1"
                                role="button"
                                tabindex="0"
								on:click={() => showModal(header.text)}
							>
								<span>{content_lang[header.text]}</span>
								{#if header.text !== 'songName' && header.text !== 'releaseDate'}
									<svg
										class="h-4 w-4"
										xmlns="http://www.w3.org/2000/svg"
										viewBox={FILTER_ICON.viewBox}
										fill="none"
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
			<div id="blocks" class="gap flex h-full w-full flex-col">
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

			<div class="flex flex-wrap justify-center gap-2 p-4">
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
<!-- 그룹 -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog id="group" class="modal" on:click|self={() => document.getElementById('group').close()}>
	<div class="modal-box max-w-5xl">
		<h3 class="mb-4 text-lg font-bold text-center">{sideNav_lang['viewByGroupModal'].title}</h3>
		<Profile data={groupCache} type={'group'} />
		<div class="modal-action">
			<form method="dialog">
				<button class="btn">{sideNav_lang['viewByGroupModal'].close}</button>
			</form>
		</div>
	</div>
</dialog>

<!-- 아티스트 -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog id="artist" class="modal" on:click|self={() => document.getElementById('artist').close()}>
	<div class="modal-box max-w-5xl">
		<h3 class="mb-4 text-lg font-bold text-center">{sideNav_lang['viewByArtistModal'].title}</h3>
		<Profile data={artistCache} type={'artist'} />
		<div class="modal-action text-center">
			<form method="dialog">
				<button class="btn">{sideNav_lang['viewByArtistModal'].close}</button>
			</form>
		</div>
	</div>
</dialog>

<!-- 앨범 -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog id="album" class="modal" on:click|self={() => document.getElementById('album').close()}>
	<div class="modal-box max-w-5xl">
		<h3 class="mb-4 text-lg font-bold text-center">{sideNav_lang['viewByAlbumModal'].title}</h3>
		<Profile data={albumCache} type={'album'} />
		<div class="modal-action">
			<form method="dialog">
				<button class="btn">{sideNav_lang['viewByAlbumModal'].close}</button>
			</form>
		</div>
	</div>
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
