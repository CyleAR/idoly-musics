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
	<div id="color-tag" class="h-full w-[1%] md:w-1.5 flex-shrink-0 rounded-l-xl" style="background-color: {colorTag};"></div>

	<!-- 메인 콘텐츠 -->
	<div class="flex flex-1 items-center">
		<!-- 콘텐츠 그리드 -->
		<div class="flex flex-1 items-center">
            <!-- 
            sm(640px) 미만 : 썸네일, 제목, 그룹 | w-20고정 n% 40%
            sm(640px) 이상 : 썸네일, 제목, 그룹, 아티스트 | w-20고정 n% 20% 25% 40%
            md(768px) 이상 : 썸네일, 제목, 그룹, 아티스트, 수록앨범 | w-20고정 n% 20% 35% 20%
            lg(1024px) 이상 : 썸네일, 제목, 그룹, 아티스트, 수록앨범, 공개일 | w-20고정 n% 15% 31% 20% 10%
            -->
			<!-- 썸네일 -->
			<div class="relative flex-shrink-0">
				<img
					src={load_image()}
					class="h-20 w-20 rounded-lg object-contain transition-opacity duration-200"
					alt="thumbnail"
				/>
			</div>

			<!-- 노래 제목 -->
			<div
				class="w-[20%] md:w-[14%] lg:w-[12%] flex-grow overflow-hidden whitespace-pre-line text-sm sm:text-base"
                style="max-height: 5rem;"
			>
				{title.replace(/[~(]/, '\n$&')}
			</div>

			<!-- 그룹 -->
			<div class="seperator {$global_theme == 'dark' ? 'border-base-100' : 'border-base-300'} {seperator_height}"/>
			<div class="w-[40%] sm:w-[25%] md:w-[20%] lg:w-[15%] flex-shrink-0 px-3">
				<ColorTag texts={groups} />
			</div>

			<!-- 아티스트 -->
			<div class="seperator {$global_theme == 'dark' ? 'border-base-100' : 'border-base-300'} {seperator_height} hidden sm:flex"/>
			<div class="w-[40%] sm:w-[40%] md:w-[35%] lg:w-[31%] flex-shrink-1 px-3 hidden sm:flex">
				<ColorTag texts={artists} />
			</div>

            
			<!-- 수록 앨범 -->
			<div class="seperator {$global_theme == 'dark' ? 'border-base-100' : 'border-base-300'} {seperator_height} hidden md:flex"/>
			<div class="w-[20%] flex-shrink-0 px-3 hidden md:flex">
				<ColorTag texts={included_albums} />
			</div>

            
			<!-- 공개일 -->
			<div class="seperator {$global_theme == 'dark' ? 'border-base-100' : 'border-base-300'} {seperator_height} hidden lg:flex"/>
            <div class="w-[10%] flex-shrink-0 px-3 hidden lg:flex items-center justify-center">
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
