<script lang="ts">
	import { global_theme } from '$lib/stores';

	export let texts: string[];
	export let color: string = null;
	export let sort_as_col: boolean = false;

	function hexToRgba(hex: string, opacity: number = 0.9) {
		if (!hex) return '';
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return `rgba(${r}, ${g}, ${b}, ${opacity})`;
	}
</script>

<div class="justify-left flex flex-wrap {sort_as_col ? 'flex-col' : ''}">
	{#each texts as item}
		<span
			style="background-color: {hexToRgba(color || item.color)}"
			class="m-1 inline-block truncate whitespace-nowrap rounded-lg px-2 py-1 text-center text-black"
		>
			{item.name}
		</span>
	{/each}
</div>
