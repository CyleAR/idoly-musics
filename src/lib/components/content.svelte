<script lang="ts">
	import { global_theme, currentLanguage } from '$lib/stores';
	import { language_table } from '$lib/lang.ts';
	import type { PageData } from './$types';
	import Block from './block.svelte';

	export let data: PageData;

	// [{}] 형태이기 때문에 일단 이렇게 명시해둠.
	let blocks_info: [object] = data.musics;

	$: content_lang = language_table[$currentLanguage]['content'];
</script>

<div id="content-main" class="h-[80vh] w-[70vw] rounded-lg bg-base-100">
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
	<!-- 정렬 기능을 사용할 수 있게. 정보를 block 단위로 추상화 -->
	<div id="blocks" class="gap flex h-full w-full flex-col">
		{#each blocks_info as block}
			<div class="w-full p-2">
				<!-- TODO; 그룹명이 '솔로' 일 경우에만 artist 테이블에 color 가져오고 그 외의 경우엔 group테이블에서 색 가져오게 코딩해주심 되고 색 두께는 10px정도로 -->
				<Block
					title={block.music_name}
					artists={block.artists.map((a) => a.name).join(', ')}
					groups={block.groups.map((a) => a.name).join(', ') || '#'}
					colorTag={block.group?.color || block.artists[0]?.color || '#000000'}
					thumbnail={block.jacket_directory}
					included_albums={block.albums.map((a) => a.name).join(', ') || '#'}
					announce_date={block.announce_date || ', '}
				/>
			</div>
		{/each}
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
