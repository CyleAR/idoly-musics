<script lang="ts">
	import { global_theme } from '$lib/stores';

	export let texts: string[];
	export let color: string = null;
	export let sort_as_col: bool = false;

	// opacity 값 조절 가능
	function hexToRgba(hex: string, opacity: number = 0.8) {
		if (!hex) return '';
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return `rgba(${r}, ${g}, ${b}, ${opacity})`;
	}
</script>

<div class="grid {sort_as_col ? 'grid-cols-1' : 'grid-cols-3'} gap-1">
	{#each texts as item}
		<span
			style="background-color: {hexToRgba(color || item.color)}"
			class="m-1 rounded-lg text-center text-black"
		>
			{item.name}
		</span>
	{/each}
</div>
