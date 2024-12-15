<script>
	export let data;
	export let cache;
	export let type;

	let isLoading = {};
	let imageSources = {};
	let firstColumn = [];
	let secondColumn = [];
	let thirdColumn = [];
	let activeIndices = {};

	$: musics = data.musics.results;
	$: columns = [firstColumn, secondColumn, thirdColumn];

	$: if (cache) {
		const chunkSize = Math.ceil(cache.length / 3);
		firstColumn = cache.slice(0, chunkSize);
		secondColumn = cache.slice(chunkSize, chunkSize * 2);
		thirdColumn = cache.slice(chunkSize * 2);
		cache.forEach((item) => {
			isLoading[item.id] = true;
			imageSources[item.id] = `/images/${type}/${item.id}.webp`;
		});
	}

	function load_image(id) {
		if (!imageSources[id]) {
			imageSources[id] = `/images/${type}/${id}.webp`;
		}
		return imageSources[id];
	}

	function handleImageError(id) {
		return () => {
			imageSources[id] = `/images/${type}/0.webp`;
			imageSources = { ...imageSources };
			isLoading[id] = false;
			isLoading = { ...isLoading };
		};
	}

	function handleImageLoad(id) {
		return () => {
			isLoading[id] = false;
			isLoading = { ...isLoading };
		};
	}

	function getMusics(name) {
		return musics.filter(
			(music) =>
				music.groups.some((group) => group.name === name) ||
				music.artists.some((artist) => artist.name === name) ||
				music.albums.some((album) => album.name === name)
		);
	}
</script>

<div class="p-6">
	<div class="mx-auto grid max-w-[1600px] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each columns as column}
			<div class="flex flex-col gap-4">
				{#each column as item}
					<div
						class="collapse collapse-plus rounded-xl bg-base-200 shadow-md transition-all duration-500 ease-in-out hover:shadow-lg"
					>
						<input
							type="checkbox"
							checked={activeIndices[item.name]}
							on:change={() => {
								activeIndices[item.name] = !activeIndices[item.name];
								activeIndices = activeIndices;
							}}
						/>
						<div
							class="collapse-title flex flex-row items-center p-2 text-xl font-medium"
							style="color: {item.color}"
						>
							{#if isLoading[item.id]}
								<div class="flex h-20 w-20 items-center justify-center">
									<span class="loading loading-spinner loading-md"></span>
								</div>
							{/if}
							<img
								src={load_image(item.id)}
								class="h-20 w-20 rounded-lg object-contain transition-opacity duration-200
                                    {isLoading[item.id] ? 'opacity-0' : 'opacity-100'}"
								alt={item.name || 'thumbnail'}
								on:error={handleImageError(item.id)}
								on:load={handleImageLoad(item.id)}
							/>
							<span class="p-2">
								{item.name}
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
												<tr class="cursor-pointer">
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
