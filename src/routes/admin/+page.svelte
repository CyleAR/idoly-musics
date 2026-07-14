<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;
	let selectedId = -1;
	let selectedAlbumId = -1;
	$: selected = data.musics.find((music) => music.id === selectedId);
	$: selectedAlbum = data.albums.find((album) => album.id === selectedAlbumId);
	$: relationSets = [
		{ key: 'artists' as const, label: '아티스트', items: data.artists },
		{ key: 'groups' as const, label: '그룹', items: data.groups },
		{ key: 'albums' as const, label: '앨범', items: data.albums }
	];
	const value = (key: string) => String(selected?.[key] ?? '');
	const albumValue = (key: string) => String(selectedAlbum?.[key] ?? '');
</script>

<svelte:head><title>음악 데이터 관리 | IDOLY MUSICS</title></svelte:head>

<main class="mx-auto max-w-7xl p-4 lg:p-8">
	<header class="mb-6 flex flex-wrap items-end justify-between gap-3">
		<div><h1 class="text-3xl font-bold">음악 데이터 관리</h1><p class="text-sm opacity-60">접속 IP: {data.clientIp}</p></div>
		<a class="btn" href="/">사이트로 돌아가기</a>
	</header>

	{#if form?.message}<div class="alert mb-5" class:alert-success={form.success} class:alert-error={!form.success}>{form.message}</div>{/if}

	<div class="grid gap-6 lg:grid-cols-[20rem_1fr]">
		<aside class="rounded-box bg-base-100 p-3 shadow">
			<button class="btn btn-primary mb-3 w-full" type="button" on:click={() => selectedId = -1}>+ 새 곡</button>
			<div class="max-h-[70vh] overflow-y-auto">
				{#each data.musics as music}
					<button class="btn btn-ghost h-auto min-h-10 w-full justify-start py-2 text-left" class:btn-active={selectedId === music.id} type="button" on:click={() => selectedId = music.id}>#{music.id} {music.name_ja}</button>
				{/each}
			</div>
		</aside>

		<section class="rounded-box bg-base-100 p-5 shadow">
			<h2 class="mb-4 text-xl font-bold">{selected ? `#${selected.id} 수정` : '새 곡 등록'}</h2>
			{#key selectedId}
				<form method="POST" action="?/save" use:enhance class="space-y-5">
					<input type="hidden" name="id" value={selected?.id ?? ''} />
					<div class="grid gap-3 md:grid-cols-2">
						{#each [['name_ja','곡명 (일본어) *'],['name_ko','곡명 (한국어)'],['name_en','곡명 (영어)'],['name_zh','곡명 (중국어)']] as field}
							<label class="form-control"><span class="label-text mb-1">{field[1]}</span><input class="input input-bordered" name={field[0]} value={value(field[0])} required={field[0] === 'name_ja'} /></label>
						{/each}
						<label class="form-control"><span class="label-text mb-1">발표일</span><input class="input input-bordered" type="date" name="announce_date" value={value('announce_date')} /></label>
						<label class="form-control"><span class="label-text mb-1">길이(초)</span><input class="input input-bordered" type="number" min="0" name="length" value={value('length')} /></label>
						{#each [['stream_url','YouTube URL (해외)'],['stream_url_ja','YouTube URL (일본)'],['mv_url','MV URL'],['live_url','3D Live URL']] as field}
							<label class="form-control"><span class="label-text mb-1">{field[1]}</span><input class="input input-bordered" type="url" name={field[0]} value={value(field[0])} /></label>
						{/each}
					</div>

					<div class="grid gap-4 xl:grid-cols-3">
						{#each relationSets as relation}
							<fieldset class="rounded-box border border-base-300 p-3"><legend class="px-2 font-bold">{relation.label}</legend><div class="max-h-52 overflow-y-auto">
								{#each relation.items as item}<label class="label cursor-pointer justify-start gap-2"><input class="checkbox checkbox-sm" type="checkbox" name={relation.key} value={item.id} checked={(selected?.[relation.key] ?? []).includes(item.id)} /><span>{item.name_ko || item.name_ja}</span></label>{/each}
							</div></fieldset>
						{/each}
					</div>

					<label class="form-control"><span class="label-text mb-1">일본어 가사</span><textarea class="textarea textarea-bordered h-48" name="lyrics_ja">{value('lyrics_ja')}</textarea></label>
					<label class="form-control"><span class="label-text mb-1">한국어 후리가나</span><textarea class="textarea textarea-bordered h-32" name="furigana_ko">{value('furigana_ko')}</textarea></label>
					<label class="form-control"><span class="label-text mb-1">관리 메모</span><textarea class="textarea textarea-bordered" name="comment">{value('comment')}</textarea></label>
					<button class="btn btn-primary" type="submit">저장</button>
				</form>
			{/key}

			{#if selected}
				<form class="mt-8 border-t border-error/30 pt-5" method="POST" action="?/delete" use:enhance on:submit={(event) => { if (!confirm(`곡 #${selected.id}을 정말 삭제할까요?`)) event.preventDefault(); }}>
					<input type="hidden" name="id" value={selected.id} /><button class="btn btn-error btn-outline" type="submit">이 곡 삭제</button>
				</form>
			{/if}
		</section>
	</div>

	<section class="mt-8 rounded-box bg-base-100 p-5 shadow">
		<div class="mb-4 flex flex-wrap items-center justify-between gap-3">
			<div><h2 class="text-2xl font-bold">앨범 관리</h2><p class="text-sm opacity-60">새 앨범을 추가하거나 기존 앨범 정보를 수정합니다.</p></div>
			<button class="btn btn-primary" type="button" on:click={() => selectedAlbumId = -1}>+ 새 앨범</button>
		</div>

		<div class="grid gap-5 lg:grid-cols-[20rem_1fr]">
			<div class="max-h-80 overflow-y-auto rounded-box border border-base-300 p-2">
				{#each data.albums as album}
					<button class="btn btn-ghost h-auto min-h-10 w-full justify-start py-2 text-left" class:btn-active={selectedAlbumId === album.id} type="button" on:click={() => selectedAlbumId = album.id}>#{album.id} {album.name_ko || album.name_ja}</button>
				{/each}
			</div>

			{#key selectedAlbumId}
				<form method="POST" action="?/saveAlbum" use:enhance class="space-y-4">
					<input type="hidden" name="id" value={selectedAlbum?.id ?? ''} />
					<h3 class="text-lg font-bold">{selectedAlbum ? `#${selectedAlbum.id} 수정` : '새 앨범 등록'}</h3>
					<div class="grid gap-3 md:grid-cols-2">
						{#each [['name_ja','앨범명 (일본어) *'],['name_ko','앨범명 (한국어)'],['name_en','앨범명 (영어)'],['name_zh','앨범명 (중국어)']] as field}
							<label class="form-control"><span class="label-text mb-1">{field[1]}</span><input class="input input-bordered" name={field[0]} value={albumValue(field[0])} required={field[0] === 'name_ja'} /></label>
						{/each}
						<label class="form-control"><span class="label-text mb-1">발매일</span><input class="input input-bordered" type="date" name="release_date" value={albumValue('release_date')} /></label>
						<label class="form-control"><span class="label-text mb-1">표시 색상</span><input class="input input-bordered h-12" type="color" name="color" value={albumValue('color') || '#000000'} /></label>
					</div>
					<label class="form-control"><span class="label-text mb-1">관리 메모</span><textarea class="textarea textarea-bordered" name="comment">{albumValue('comment')}</textarea></label>
					<button class="btn btn-primary" type="submit">앨범 저장</button>
				</form>
			{/key}
		</div>
	</section>
</main>
