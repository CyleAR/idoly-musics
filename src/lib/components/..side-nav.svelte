<script lang="ts">
	import { currentLanguage } from '$lib/stores';
	import { language_table } from '$lib/lang.ts';
    import DiaryViewer from './diaryViewer.svelte';

	$: sideNav_lang = language_table[$currentLanguage]['sideNav'];

    // 마나의 일기 관련 코드
    let isManaDiaryOpen = false;
    const totalDiaryPages = 446;
    const diaryDocImages = Array.from(
        { length: totalDiaryPages },
        (_, index) => `/src/images/diary/${index + 1}.webp`
    );
</script>

<div
	id="container"
	class="flex h-[50vh] w-[10vh] flex-col justify-between rounded-lg bg-base-100 px-2 py-4 shadow-md"
>
	<button class="btn btn-ghost h-[7vh] w-full" on:click={() => changeViewMode('viewByList')}
		>{sideNav_lang['table']}
    </button>
	<button class="btn btn-ghost h-[7vh] w-full p-0" on:click={() => changeViewMode('viewByGroup')}>
		<span class="nav-text flex flex-col gap-1">
			{#each sideNav_lang['viewByGroup'].split('\n') as item}
				<span>{item}</span>
			{/each}
		</span>
	</button>
	<button class="btn btn-ghost h-[7vh] w-full p-0" on:click={() => changeViewMode('viewByAlbums')}>
		<span class="nav-text flex flex-col gap-1">
			{#each sideNav_lang['viewByAlbum'].split('\n') as item}
				<span>{item}</span>
			{/each}
		</span>
	</button>
	<button class="btn btn-ghost h-[7vh] w-full p-0" on:click={() => changeViewMode('viewByCharacter')}>
		<span class="nav-text flex flex-col gap-1">
			{#each sideNav_lang['viewByCharacter'].split('\n') as item}
				<span>{item}</span>
			{/each}
		</span>
	</button>
    <button class="btn btn-ghost h-[7vh] w-full p-0" on:click={() => isManaDiaryOpen = true}>
       <span class="nav-text flex flex-col gap-1 text-pink-500">
			<span>마나</span>
			<span>다이어리</span>
		</span>
    </button>
</div>

<DiaryViewer bind:isOpen={isManaDiaryOpen} images={diaryDocImages} />

<style lang="postcss">
	.nav-text {
		@apply whitespace-pre-line text-center; /* tailwind 사용 시 */
	}
</style>
