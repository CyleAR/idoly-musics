<script lang="ts">
	import { currentLanguage } from '$lib/stores';
	import { language_table } from '$lib/lang.ts';

	$: sideNav_lang = language_table[$currentLanguage]['sideNav'];
</script>

<div
	id="container"
	class="flex h-[40vh] w-[10vh] flex-col justify-between rounded-lg bg-base-100 px-2 py-4"
>
	<button class="btn btn-ghost h-[7vh] w-full">{sideNav_lang['table']}</button>
	<button class="btn btn-ghost h-[7vh] w-full p-0">
		<span class="nav-text flex flex-col gap-1">
			<span>{sideNav_lang['viewByGroup']}</span>
		</span>
	</button>
	<button class="btn btn-ghost h-[7vh] w-full p-0">
		<span class="nav-text flex flex-col gap-1">
			<span>{sideNav_lang['viewByAlbum']}</span>
		</span>
	</button>
	<button class="btn btn-ghost h-[7vh] w-full p-0">
		<span class="nav-text flex flex-col gap-1">
			<span>{sideNav_lang['viewByCharacter']}</span>
		</span>
	</button>
</div>

<style lang="postcss">
	.nav-text {
		@apply whitespace-pre-line text-center; /* tailwind 사용 시 */
	}
</style>
