<script lang="ts">
	import { page } from '$app/stores';

	export let onNavigate: (destination: string) => void = () => {};
</script>

<li>
	<a href="/" data-sveltekit-reload class:active={$page.url.pathname === '/'} aria-current={$page.url.pathname === '/' ? 'page' : undefined} on:click={() => onNavigate('/')}>
		<svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" /></svg>
		<span>홈</span>
	</a>
</li>
<li>
	<a href="/localization" class:active={$page.url.pathname === '/localization'} aria-current={$page.url.pathname === '/localization' ? 'page' : undefined} on:click={() => onNavigate('/localization')}>
		<svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h12M10 4v2c0 6-2 10-6 13M6 10c1 3 4 6 7 8M14 21l4-10 4 10M16 17h4" /></svg>
		<span>한글패치</span>
	</a>
</li>
<li>
	<a href="https://hoshimistation.cyle.me" target="_blank" rel="noopener noreferrer" on:click={() => onNavigate('https://hoshimistation.cyle.me')}>
		<svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="8" height="8" rx="1" /><rect x="13" y="3" width="8" height="8" rx="1" /><rect x="3" y="13" width="8" height="8" rx="1" /><path d="M13 17h8m-4-4v8" /></svg>
		<span>번역 대시보드</span>
		<svg class="ml-auto h-4 w-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 5h6v6M19 5l-9 9M19 13v6H5V5h6" /></svg>
	</a>
</li>
