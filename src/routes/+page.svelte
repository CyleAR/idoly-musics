<script lang="ts">
	import SideNavigation from '$lib/components/side-nav.svelte';
	import Content from '$lib/components/content.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex flex-row px-36 py-12">
	<SideNavigation />
	<div id="seperator" class="p-3"></div>
	<Content {data} />
</div>
