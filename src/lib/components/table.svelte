<script>
	export let data;
	export let cache;
	export let type;

	import { group_images, album_images, artist_images, selectedBlock } from '$lib/stores';
	import { get } from 'svelte/store';

	let imageSources = {};
	let firstColumn = [];
	let secondColumn = [];
	let thirdColumn = [];
	let activeIndices = {};

	$: imageStore =
		type === 'group' ? $group_images : type === 'album' ? $album_images : $artist_images;

    $: albums = data.musics.albumCache;
	$: musics = data.musics.results;
	$: columns = [firstColumn, secondColumn, thirdColumn];

	$: if (cache) {
		const chunkSize = Math.ceil(cache.length / 3);
		firstColumn = cache.slice(0, chunkSize);
		secondColumn = cache.slice(chunkSize, chunkSize * 2);
		thirdColumn = cache.slice(chunkSize * 2);
	}

	function handleClick(id) {
		if ($selectedBlock === id) {
			$selectedBlock = null;
		} else {
			$selectedBlock = id;
		}
	}

	function load_image(id) {
		const imagePath = `/src/images/${type}/${id}.webp`;
		const exists = imageStore[imagePath];
		return exists ? exists.default : imageStore[`/src/images/${type}/0.webp`].default;
	}

	function getMusics(name) {
		return musics.filter((music) => {
			switch (type) {
				case 'artist':
					return music.artists.some((artist) => artist.name === name);
				case 'group':
					return music.groups.some((group) => group.name === name);
				case 'album':
					return music.albums.some((album) => album.name === name);
				default:
					return false;
			}
		});
	}
    
    // function getAlbumDate(id) {
    //     console.log(albums);
    //     albums.forEach((album) => {
    //         if (album.id === id) {
    //             return album.release_date;
    //         }
    //     });
    // }
</script>

<div id="table-wrapper" class="p-6">
	<div id="table-main" class="mx-auto grid max-w-[1600px] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each columns as column}
			<div class="flex flex-col gap-4">
				{#each column as item}
					<div
						class="collapse collapse-plus rounded-xl bg-base-200 shadow-md transition-all duration-500 ease-in-out hover:shadow-lg"
					>
						<input
							type="checkbox"
							checked={activeIndices[item.id]}
							on:change={() => {
								activeIndices[item.id] = !activeIndices[item.id];
								activeIndices = activeIndices;
							}}
						/>
						<div
							class="collapse-title flex flex-row items-center p-2 text-xl font-medium"
							
						>
							<img
								src={load_image(item.id)}
								class="h-20 w-20 rounded-lg object-contain transition-opacity duration-200"
								alt={item.name || 'thumbnail'}
							/>
							<span class="p-2 flex flex-col">
                                <span class="font-bold">{item.name}</span>
                                <span class="text-sm">{(item.release_date == '0000-00-00') ? null : item.release_date || null}</span>
							</span>
						</div>
						<div class="collapse-content">
							<div class="flex flex-col gap-4">
								<div
									class="scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-100 max-h-48 overflow-y-auto"
								>
									<table class="table-hover table table-sm bg-base-100">
										<tbody>
											{#each getMusics(item.name) as music, i}
												<tr
													class="item hover:bg-base-200"
													on:click={() => {
														handleClick(music.id);
													}}
												>
													<th>{i + 1}</th>
													<td>{music.music_name}</td>
													<td>{music.announce_date}</td>
												</tr>
											{/each}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/each}
	</div>
</div>

<style>
	.item:hover {
		cursor: pointer;
		transition: transform 0.2s ease;
	}

	.item:active {
		transform: scale(0.95);
	}
</style>
