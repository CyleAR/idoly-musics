<script lang="ts">
	export let data;
	export let type;
	import { global_theme, filter, group_images, album_images, artist_images } from '$lib/stores';
	import { onMount } from 'svelte';

	let selectedArtists: boolean[] = [];
	let img_src: { [key: string]: string } = {};

	$: imageStore =
		type === 'group' ? $group_images : type === 'album' ? $album_images : $artist_images;

	$: cache = data;

	$: if (cache) {
		img_src = Object.fromEntries(
			cache.map((item) => {
				const imagePath = `/src/images/${type}/${item.id}.webp`;
				const exists = imageStore[imagePath];
				return [
					item.id,
					exists ? exists.default : imageStore[`/src/images/${type}/0.webp`].default
				];
			})
		);
	}

	function handleImageError(id) {
		img_src[id] = images[`/src/images/${type}/0.webp`].default;
		img_src = { ...img_src };
	}

	function toggleSelection(index) {
		selectedArtists[index] = !selectedArtists[index];
		selectedArtists = [...selectedArtists];

		const selectedNames = cache.filter((_, i) => selectedArtists[i]).map((artist) => artist.name);
		filter.set(selectedNames);
	}
</script>

<div class="flex flex-wrap justify-center gap-4">
	{#each cache || [] as item, i}
		{#if item?.id && item?.name}
			<button
				on:click={() => toggleSelection(i)}
				class="btn relative h-32 w-32 border-none bg-transparent p-0 transition-all duration-200 hover:-translate-y-1"
			>
				<div class="relative h-full w-full">
					{#if !selectedArtists[i]}
						<div
							class="absolute inset-0 z-10 rounded-lg {$global_theme === 'dark'
								? 'bg-black/60'
								: 'bg-black/30'} transition-opacity duration-200"
						/>
					{/if}
					<img
						src={img_src[item.id]}
						on:error={() => handleImageError(item.id)}
						class="h-full w-full rounded-lg object-cover transition-opacity duration-200
                        {selectedArtists[i] && $global_theme === 'dark' ? 'brightness-125' : ''}"
						alt={item.name || ''}
					/>

					<div
						class="absolute bottom-0 left-0 right-0 h-12 rounded-b-lg bg-gradient-to-t from-black/70 to-transparent"
					/>
					<span
						class="absolute bottom-2 left-0 right-0 z-20 text-center font-medium text-white drop-shadow-lg"
					>
						{item.name}
					</span>
				</div>
			</button>
		{/if}
	{/each}
</div>
