<script lang="ts">
	import { music_images, global_theme, selectedBlock } from '$lib/stores';

	import ColorTag from './tag.svelte';

	export let id: number;
	export let title: string;
	export let artists: string;
	export let groups: string;
	export let colorTag: string;
	export let included_albums: string;
	export let announce_date: string;

	function load_image() {
		const imagePath = `/src/images/music/${id}.webp`;
		const exists = $music_images[imagePath];
		return exists ? exists.default : $music_images[`/src/images/music/0.webp`].default;
	}

	function handleClick() {
		if ($selectedBlock === id) {
			$selectedBlock = null;
		} else {
			$selectedBlock = id;
		}
	}

	$: seperator_height = artists.length === 10 ? 'h-24' : 'h-20';
	$: block_height = artists.length === 10 ? 'h-[7rem]' : 'h-[6rem]';
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore element_invalid_self_closing_tag -->
<div
	id="block-main"
	class="btn flex w-full p-0 {block_height} flex-row rounded-xl {$global_theme === 'dark'
		? $selectedBlock === id
			? 'btn-neutral bg-base-300'
			: 'btn-neutral'
		: $selectedBlock === id
			? 'btn-ghost bg-base-200 shadow-md'
			: 'btn-ghost shadow-md'}"
	on:click={handleClick}
	role="button"
	tabindex="0"
>
	<!-- 컬러 태그 -->
	<div id="color-tag" class="h-full w-2 rounded-l-xl" style="background-color: {colorTag};"></div>

	<!-- 메인 콘텐츠 -->
	<div class="flex flex-1 items-center">
		<!-- 콘텐츠 그리드 -->
		<div class="flex flex-1 items-center">
			<!-- 썸네일 -->
			<div class="relative h-[5%] lg:w-[5%] sm:w-[30%] flex-shrink-0">
				<img
					src={load_image()}
					class="h-20 w-20 rounded-lg object-contain transition-opacity duration-200"
					alt="thumbnail"
				/>
			</div>

			<!-- 노래 제목 -->
			<div
				class="lg:w-[12%] sm:w-[30%] flex-shrink-0 overflow-hidden whitespace-pre-line px-4 text-base"
				style="max-height: 3rem;"
			>
				{title.replace(/[~(]/, '\n$&')}
			</div>

			<div class="seperator {$global_theme == 'dark' ? 'border-base-100' : 'border-base-300'} {seperator_height}"/>

			<!-- 그룹 -->
			<div class="lg:w-[10%] sm:w-[39%] flex-shrink-0 px-4">
				<ColorTag texts={groups} />
			</div>

			<div class="seperator {$global_theme == 'dark' ? 'border-base-100' : 'border-base-300'} {seperator_height} hidden md:flex"/>

			<!-- 아티스트 -->
			<div class="w-[33%] flex-shrink-0 px-4 hidden md:flex">
				<ColorTag texts={artists} />
			</div>

			<div class="seperator {$global_theme == 'dark' ? 'border-base-100' : 'border-base-300'} {seperator_height} hidden lg:flex"/>

			<!-- 수록 앨범 -->
			<div class="w-[25%] flex-shrink-0 px-4 hidden lg:flex">
				<ColorTag texts={included_albums} />
			</div>

			<div class="seperator {$global_theme == 'dark' ? 'border-base-100' : 'border-base-300'} {seperator_height} hidden lg:flex"/>

			<!-- 공개일 -->
            <div class="lg:w-[14%] flex-shrink-0 px-4 hidden lg:flex items-center justify-center">
                {announce_date}
            </div>
		</div>
	</div>
</div>

<style>
	.seperator {
		@apply border-r-4;
	}
</style>

<!-- 
소형(폰) sm(640px) : 썸네일, 제목, 그룹 30% 30% 39%
중형(태블릿) md(768px) : 썸네일, 제목, 그룹, 아티스트 20% 25
대형(데스크탑) xl(1280px) : 썸네일, 제목, 그룹, 아티스트, 수록앨범, 공개일 5% 12% 33% 25% 14%
-->