<script lang="ts">
	export let data;
	export let type: 'group' | 'album' | 'artist';
	import {
		global_theme,
        artistFilter,
        groupFilter,
        albumFilter,
        isFilterEmpty,
        resetFilters,
        group_images,
		album_images,
		artist_images,
		currentLanguage
	} from '$lib/stores';
	import { language_table } from '$lib/lang.ts';
	import { onMount } from 'svelte';

	let selectedItems: boolean[] = [];
	let img_src: { [key: string]: string } = {};

	$: imageStore =
		type === 'group' ? $group_images : type === 'album' ? $album_images : $artist_images;

	$: if (data) {
		img_src = Object.fromEntries(
			data.map((item) => {
				const imagePath = `/src/images/${type}/${item.id}.webp`;
				const exists = imageStore[imagePath];
				return [
					item.id,
					exists ? exists.default : imageStore[`/src/images/${type}/0.webp`].default
				];
			})
		);
	}

	function handleImageError(id: number) {
		img_src[id] = images[`/src/images/${type}/0.webp`].default;
		img_src = { ...img_src };
	}

	function toggleSelection(index: number) {
        switch (type) {
            case 'group':
                const groupId = $groupFilter.indexOf(index);
                if(groupId > -1) {
                    groupFilter.update((value) => {
                        value.splice(groupId, 1);
                        return value;
                    });
                } else {
                    groupFilter.update((value) => {
                        value.push(index);
                        return value;
                    });
                }
                break;
            case 'album':
                const albumId = $albumFilter.indexOf(index);
                if(albumId > -1) {
                    albumFilter.update((value) => {
                        value.splice(albumId, 1);
                        return value;
                    });
                } else {
                    albumFilter.update((value) => {
                        value.push(index);
                        return value;
                    });
                }
                break;
            case 'artist':
                const artistId = $artistFilter.indexOf(index);
                if(artistId > -1) {
                    artistFilter.update((value) => {
                        value.splice(artistId, 1);
                        return value;
                    });
                } else {
                    artistFilter.update((value) => {
                        value.push(index);
                        return value;
                    });
                }
                break;
        }
	}

</script>

<div class="flex flex-wrap justify-center gap-1 sm:gap-2 md:gap-3 lg:gap-4">
	{#each data as item}
        <button
            on:click={() => toggleSelection(item.id)}
            class="btn relative h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 border-none {$global_theme === 'dark'
                            ? 'bg-black/60'
                            : 'bg-black/10'} p-0 transition-all duration-200 hover:-translate-y-1 rounded-xl"
        >
            <div class="relative h-full w-full">
                {#if (type === 'group' ? $groupFilter : type === 'album' ? $albumFilter : $artistFilter).includes(item.id)}
                    <div
                        class="absolute inset-0 z-20 border-2 md:border-4 border-blue-600 transition-opacity duration-200 rounded-xl"
                    ></div>
                    {:else}
                    <div
                        class="absolute inset-0 z-20 bg-black bg-opacity-30 transparent-80 transition-opacity duration-200 rounded-xl"
                    ></div>
                {/if}
                <img
                    src={img_src[item.id]}
                    on:error={() => handleImageError(item.id)}
                    class="h-full w-full object-cover transition-opacity duration-200 rounded-xl"
                    alt={item.name || ''}
                />

                <div
                    class="absolute bottom-0 left-0 right-0 h-12 rounded-b-lg bg-gradient-to-t from-black/70 to-transparent"
                ></div>
                <span
                    class="absolute bottom-2 left-0 right-0 z-10 text-center font-medium text-white drop-shadow-lg"
                >
                    {item.name}
                </span>
            </div>
        </button>
	{/each}
</div>
