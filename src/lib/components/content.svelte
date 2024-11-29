<script lang="ts">
	import {
		global_theme,
		currentLanguage,
		character_filter,
		view_mode,
		selectedBlock
	} from '$lib/stores';
	import { language_table } from '$lib/lang.ts';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import Table from './table.svelte';
	import Block from './block.svelte';
	import { invalidateAll } from '$app/navigation';
	export let data: PageData;
	export let itemsPerPage = 16; // 페이지당 표시할 항목 수

	// TODO;  필터링 적용했을 때, 페이지가 1로 다시 안가는 버그도 있음

	let current_page = 1;

	$: blocks_info = data.musics.results;
	$: content_lang = language_table[$currentLanguage]['content'];
	$: isDrawerOpen = $selectedBlock !== null;

	// 필터링된 블록을 계산하는 반응형 선언 추가
	$: filteredBlocks = blocks_info.filter((block) => {
		// character_filter가 비어있으면 모든 블록 표시
		if ($character_filter.length === 0 || $character_filter == undefined) return true;

		// block의 artists 중에서 character_filter에 포함된 id가 있는지 확인
		return block.artists.some((artist) => $character_filter.includes(artist.id));
	});

	$: totalPages = Math.ceil(filteredBlocks.length / itemsPerPage);

	$: paginatedBlocks = filteredBlocks.slice(
		(current_page - 1) * itemsPerPage,
		current_page * itemsPerPage
	);

	$: contentHeight = paginatedBlocks.reduce((height, block) => {
		const blockHeight = calculateBlockHeight(block);
		return height + blockHeight + 4;
	}, 12);

	$: contentHeightPx = contentHeight * itemsPerPage;

	onMount(() => {
		const initialState = { page: current_page };
		history.replaceState(initialState, '', window.location.href);

		window.addEventListener('popstate', handlePopState);

		return () => {
			window.removeEventListener('popstate', handlePopState);
		};
	});

	function handlePopState(event: PopStateEvent) {
		if (event.state?.page) {
			current_page = event.state.page;
			document.getElementById('content-main')?.scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});
		}
	}

	function goToPage(page: number) {
		console.log(data);
		if (page !== current_page) {
			current_page = page;
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

	// TODO; 하드코딩이라서 유연하지 않음
	// 적당한 방법으로 변경해야함..
	// 근데 적당한 방법이 안떠오름...
	function calculateBlockHeight(block: any) {
		const artistCount = block.artists.length;
		const groupCount = block.groups.length;

		// artist가 9개 이상이거나 group이 5개 이상인 경우
		if (artistCount >= 9) {
			return 9; // 큰 높이
		}
		return 3.4; // 중간 높이
	}

	function getActualIndex(pageIndex: number): number {
		return (current_page - 1) * itemsPerPage + pageIndex;
	}
</script>

<div class="duration-50 flex transition-all" style="margin-left: {isDrawerOpen ? '-30px' : '0'}">
	<div
		id="content-main"
		style="min-height: {contentHeightPx}px"
		class="w-full rounded-lg bg-base-100 shadow-lg"
	>
		{#if $view_mode == 'viewByAlbums'}
			<Table {data} />
		{:else if $view_mode == 'viewByGroup'}
			<Table {data} />
		{:else}
			<div class="flex w-full flex-col lg:flex-row">
				<div class="common-card w-[21%]">
					<div class="flex items-center gap-1 pl-6">
						<div class="h-4 w-4">
							<img
								src="/note.png"
								alt="로고"
								class="h-full w-full object-cover"
								class:icon-white={$global_theme === 'dark'}
								class:icon-black={$global_theme === 'light'}
							/>
						</div>
						<span>{content_lang['songName']}</span>
					</div>
				</div>
				<div class="common-card w-[10%]">{content_lang['group']}</div>
				<div class="common-card w-[32%]">{content_lang['artist']}</div>
				<div class="common-card w-[20%]">{content_lang['album']}</div>
				<div class="common-card">{content_lang['releaseDate']}</div>
			</div>
			<div id="blocks" class="gap flex h-full w-full flex-col">
				{#each paginatedBlocks as block, idx}
					<div class="w-[100%] p-4">
						<Block
							id={getActualIndex(idx)}
							title={block.music_name}
							artists={block.artists}
							groups={block.groups}
							colorTag={block.group?.color || block.artists[0]?.color || '#000000'}
							thumbnail={block.jacket_directory}
							included_albums={block.albums}
							announce_date={block.announce_date || '#'}
						/>
					</div>
				{/each}
			</div>

			<div class="flex justify-center gap-2 p-4">
				{#if current_page > 1}
					<button class="btn btn-circle btn-sm" on:click={() => goToPage(current_page - 1)}>
						«
					</button>
				{/if}

				{#each Array(totalPages) as _, i}
					<button
						class="btn btn-circle btn-sm {current_page === i + 1 ? 'btn-primary' : ''}"
						on:click={() => goToPage(i + 1)}
					>
						{i + 1}
					</button>
				{/each}

				{#if current_page < totalPages}
					<button class="btn btn-circle btn-sm" on:click={() => goToPage(current_page + 1)}>
						»
					</button>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	.common-card {
		@apply card grid h-14 items-center justify-start rounded-box bg-base-100 pt-4;
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
