<!-- 그리고 글자는 다 16px로 일단 해주시고 -->
<!-- 그룹,노래,아티스트 이름 다 _translations에 id랑 연결된 테이블 있는데 거기서 가져오시면 되는데 언어별로 가져오는게 다르거든요 그래서 언어별로 사이트 보이는게 달라야 해요
이건 그냥 kr,en,jp,zh(짱꺠어) 지정을 전역으로 하면 언어코드에 저장된 데이터 가져오면 될듯 (그래서 시안에 언어변경창이있는거)
그리고 태그에 배경색은 db에 다 아티스트 개인별, 그룹별, 앨범별 테이블에 color 지정되어있으니 id별로 연동된 색을 바탕색으로 쓸 수 있게 하면될듯 -->

<script lang="ts">
	import { global_theme, selectedBlock } from '$lib/stores';
	import ColorTag from './tag.svelte';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	export let id: number;
	export let title: string;
	export let artists: string;
	export let groups: string;
	export let colorTag: string;
	export let included_albums: string;
	export let announce_date: string;

	let imgSrc = '/images/music/0.webp';

	$: if (browser && id !== undefined) {
		imgSrc = `/images/music/${id}.webp`;
	}

	function handleImageError() {
		imgSrc = '/images/music/0.webp';
	}

	function handleClick() {
		if ($selectedBlock === id) {
			$selectedBlock = null;
		} else {
			console.log(id);
			$selectedBlock = id;
		}
	}

	$: seperator_height = artists.length === 10 ? 'h-32' : 'h-28';

	$: block_height =
		artists.length === 10 ? 'h-[9rem]' : artists.length < 9 && groups.length >= 3 ? 'h-32' : 'h-28';
</script>

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
			<div class="h-[7%] w-[7%] flex-shrink-0">
				<img
					src={imgSrc}
					class="h-24 w-24 object-contain"
					alt="thumbnail"
					on:error={handleImageError}
				/>
			</div>
			<div class="w-[12%] flex-shrink-0 whitespace-pre-line px-4">
				{title.replace(/[~(]/, '\n$&')}
			</div>

			<div
				class="seperator {$global_theme == 'dark'
					? 'border-base-100'
					: 'border-base-300'} {seperator_height}"
			/>
			<div class="w-[10%] flex-shrink-0 px-4">
				<ColorTag texts={groups} />
			</div>

			<div
				class="seperator {$global_theme == 'dark'
					? 'border-base-100'
					: 'border-base-300'} {seperator_height}"
			/>
			<div class="w-[33%] flex-shrink-0 px-4">
					<ColorTag texts={artists} />
			</div>

			<div
				class="seperator {$global_theme == 'dark'
					? 'border-base-100'
					: 'border-base-300'} {seperator_height}"
			/>

			<div class="w-[20%] flex-shrink-0 px-4">
				<ColorTag texts={included_albums} />
			</div>

			<div
				class="seperator {$global_theme == 'dark'
					? 'border-base-100'
					: 'border-base-300'} {seperator_height}"
			/>

			<div class="w-[17%] flex-shrink-0 px-4">
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
