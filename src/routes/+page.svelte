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
</script>

<div class="flex h-[2600px] flex-row px-36 py-12">
	<SideNavigation />
	<div id="seperator" class="p-3" />
	<Content {data} />
</div>
