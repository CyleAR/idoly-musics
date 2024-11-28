<script lang="ts">
	import { currentLanguage, view_mode } from '$lib/stores';
	import { language_table } from '$lib/lang.ts';
	import Profile from './profile.svelte';

	export let data;

	$: sideNav_lang = language_table[$currentLanguage]['sideNav'];

	function showModal(id: string) {
		const modal = document.getElementById(id) as HTMLDialogElement;
		if (modal) modal.showModal();
		$view_mode = id;
	}
</script>

<div
	id="container"
	class="flex h-[40vh] w-[10vh] flex-col justify-between rounded-lg bg-base-100 px-2 py-4"
>
	<button class="btn btn-ghost h-[7vh] w-full" on:click={() => showModal('viewByList')}
		>{sideNav_lang['table']}</button
	>
	<button class="btn btn-ghost h-[7vh] w-full p-0" on:click={() => showModal('viewByGroup')}>
		<span class="nav-text flex flex-col gap-1">
			{#each sideNav_lang['viewByGroup'].split('\n') as item}
				<span>{item}</span>
			{/each}
		</span>
	</button>
	<button class="btn btn-ghost h-[7vh] w-full p-0" on:click={() => showModal('viewByAlbums')}>
		<span class="nav-text flex flex-col gap-1">
			{#each sideNav_lang['viewByAlbum'].split('\n') as item}
				<span>{item}</span>
			{/each}
		</span>
	</button>
	<button class="btn btn-ghost h-[7vh] w-full p-0" on:click={() => showModal('viewByCharacter')}>
		<span class="nav-text flex flex-col gap-1">
			{#each sideNav_lang['viewByCharacter'].split('\n') as item}
				<span>{item}</span>
			{/each}
		</span>
	</button>
</div>

<dialog
	id="viewByCharacter"
	class="modal"
	on:click|self={() => document.getElementById('viewByCharacter').close()}
>
	<div class="modal-box max-w-5xl">
		<h3 class="mb-4 text-lg font-bold">{sideNav_lang['viewByCharacterModal'].title}</h3>
		<!-- 캐릭터 카드 -->
		<Profile {data} />
		<div class="modal-action">
			<form method="dialog">
				<button class="btn">{sideNav_lang['viewByCharacterModal'].close}</button>
			</form>
		</div>
	</div>
</dialog>

<style lang="postcss">
	.nav-text {
		@apply whitespace-pre-line text-center; /* tailwind 사용 시 */
	}
</style>
