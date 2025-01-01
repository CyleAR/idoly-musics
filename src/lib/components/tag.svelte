<script lang="ts">
	import { global_theme } from '$lib/stores';

	export let texts: string[];
	export let sort_as_col: boolean = false;

	function hexToRgba(hex: string, opacity: number = 0.95) {
		if (!hex) return '';
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return `rgba(${r}, ${g}, ${b}, ${opacity})`;
	}

    function getBrightness(hex: string) {
        if (!hex) return 0;
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        // sRGB 표준 공식
		return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
    function getTextColor(hex: string) {
        return getBrightness(hex) > 80 ? 'black' : 'white';
    }
</script>

<style>
    .tag-container {
        max-height: calc(3 * 2rem); /* 3줄의 높이로 제한 */
        overflow-y: auto;
    }
</style>

<div class="tag-container justify-left flex flex-wrap {sort_as_col ? 'flex-col' : ''}">
    {#each texts as item}
        <span
            style="background-color: {hexToRgba(item.color)}; color : {getTextColor(item.color)}"
            class="m-1 inline-block truncate whitespace-nowrap rounded-lg px-2 py-1 text-center text-black"
        >
            {item.name}
        </span>
    {/each}
</div>