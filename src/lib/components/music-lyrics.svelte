<script lang="ts">
	import { onMount } from 'svelte';
	import { currentLanguage } from '$lib/stores';

	export let musicId: number;

	let lyrics = '';
	let furigana = '';
	let loading = true;
	let failed = false;
	let controller: AbortController | undefined;

	const messages = {
		ko: { loading: '가사를 불러오는 중…', error: '가사를 불러오지 못했습니다.', retry: '다시 시도' },
		ja: { loading: '歌詞を読み込み中…', error: '歌詞を読み込めませんでした。', retry: '再試行' },
		en: { loading: 'Loading lyrics…', error: 'Could not load lyrics.', retry: 'Retry' },
		zh: { loading: '正在載入歌詞…', error: '無法載入歌詞。', retry: '重試' }
	};
	$: labels = messages[$currentLanguage as keyof typeof messages] ?? messages.en;
	$: furiganaLines = furigana.split('\n');

	async function loadLyrics() {
		controller?.abort();
		const requestController = new AbortController();
		controller = requestController;
		loading = true;
		failed = false;
		try {
			const response = await fetch(`/api/music/${musicId}/lyrics`, {
				signal: requestController.signal,
				cache: 'no-cache'
			});
			if (!response.ok) throw new Error(`Lyrics request failed: ${response.status}`);
			const result = await response.json();
			if (requestController.signal.aborted) return;
			lyrics = result.lyrics;
			furigana = result.furigana_ko;
		} catch {
			if (!requestController.signal.aborted) failed = true;
		} finally {
			if (!requestController.signal.aborted) loading = false;
		}
	}

	onMount(() => {
		void loadLyrics();
		return () => controller?.abort();
	});
</script>

<div
	id="music-drawer-lyrics"
	class="w-full whitespace-pre-line rounded-xl bg-base-200 p-4 text-base font-bold sm:text-lg"
	aria-busy={loading}
>
	{#if loading}
		<span role="status" class="text-base-content/60">{labels.loading}</span>
	{:else if failed}
		<div role="alert" class="flex flex-wrap items-center gap-2">
			<span class="text-base-content/60">{labels.error}</span>
			<button type="button" class="btn btn-sm" on:click={loadLyrics}>{labels.retry}</button>
		</div>
	{:else if lyrics}
		{#each lyrics.split('\n') as line, i}
			{#if line.trim() === ''}
				<p>&nbsp;</p>
			{:else}
				<p>{line}</p>
				{#if furigana && $currentLanguage === 'ko'}
					<p class="text-md text-gray-500">{furiganaLines[i]}</p>
				{/if}
			{/if}
		{/each}
	{:else}
		<span class="text-gray-500">NO LYRICS DATA</span>
	{/if}
</div>
