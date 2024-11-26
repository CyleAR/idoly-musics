<script lang="ts">
	import SideNavigation from '$lib/components/side-nav.svelte';
	import Content from '$lib/components/content.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	// 높이 계산 수정
	$: totalHeight = data.musics.reduce((height, block) => {
		const artistCount = block.artists.length;
		// 블록 높이 값 축소
		const blockHeight =
			artistCount >= 9
				? 20 // h-24 (원래 144)
				: artistCount === 5
					? 12 // h-20 (원래 96)
					: 6; // h-16 (원래 80)
		return height + blockHeight + 16; // padding 축소 (32 -> 16)
	}, 100); // 기본 높이 축소 (200 -> 100)
</script>

<div class="flex flex-row px-36 py-12" style="height: {totalHeight}px">
	<SideNavigation />
	<div id="seperator" class="p-3" />
	<Content {data} />
</div>
