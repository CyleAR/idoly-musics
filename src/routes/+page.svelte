<script lang="ts">
	import type { PageData } from '../../routes/$types';
	import { currentLanguage } from '$lib/stores';
	import SideNavigation from '$lib/components/side-nav.svelte';
	import Content from '$lib/components/content.svelte';
	import { browser } from '$app/environment';
	import { invalidateAll } from '$app/navigation';

	export let data: PageData;

	$: if ($currentLanguage && browser) {
		invalidateAll();
	}

	// TODO; 하드코딩이라서 유연하지 않음
	// 적당한 방법으로 변경해야함..
	$: totalHeight = data.musics.reduce((height, block) => {
		const artistCount = block.artists.length;
		const blockHeight = artistCount >= 9 ? 20 : artistCount === 5 ? 12 : 6;
		return height + blockHeight + 16;
	}, 100);
</script>

<div class="flex flex-row px-36 py-12" style="height: {totalHeight}px">
	<SideNavigation />
	<div id="seperator" class="p-3" />
	<Content {data} />
</div>
