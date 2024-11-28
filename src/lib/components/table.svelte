<script>
	export let data;

	$: musics = data.musics.results;
	$: groups = [
		{ id: 0, name: '그 외' },
		{ id: 1, name: '달의 템페스트' },
		{ id: 2, name: '서니 피스' },
		{ id: 3, name: 'TRINITYAiLE' },
		{ id: 4, name: 'LizNoir' },
		{ id: 5, name: 'IIIX' },
		{ id: 6, name: '나가세 마나' },
		{ id: 7, name: '호시미 프로덕션' },
		{ id: 8, name: '솔로' },
		{ id: 9, name: '듀엣' },
		{ id: 10, name: '콜라보' },
		{ id: 11, name: '도리큥' },
		{ id: 12, name: '파자파!' },
		{ id: 13, name: '커버' },
		{ id: 14, name: '만우절' }
	];

	// $: groups = data.musics.artistCache;

	$: if (groups) {
		// groups 배열을 3등분
		const chunkSize = Math.ceil(groups.length / 3);
		firstColumn = groups.slice(0, chunkSize);
		secondColumn = groups.slice(chunkSize, chunkSize * 2);
		thirdColumn = groups.slice(chunkSize * 2);
	}

	function getMusicsByGroup(groupName) {
		return musics.filter((music) => music.groups.some((group) => group.name === groupName));
	}

	let firstColumn = [];
	let secondColumn = [];
	let thirdColumn = [];
	let activeIndices = {};
	let carouselIndices = {};
</script>

<div class="p-6">
	<div class="mx-auto grid max-w-[1600px] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
		<!-- 첫 번째 열 -->
		<div class="flex flex-col gap-4">
			{#each firstColumn as group}
				<div
					class="collapse collapse-plus rounded-xl bg-base-200 shadow-md transition-all duration-500 ease-in-out hover:shadow-lg"
				>
					<input
						type="checkbox"
						checked={activeIndices[group.name]}
						on:change={() => {
							activeIndices[group.name] = !activeIndices[group.name];
							activeIndices = activeIndices;
						}}
					/>
					<div class="collapse-title text-xl font-medium" style="color: {group.color}">
						{group.name}
					</div>
					<div class="collapse-content">
						<div class="flex flex-col gap-4">
							<!-- Carousel -->
							<div class="relative aspect-square w-full overflow-hidden rounded-box">
								{#each ['photo-1559703248-dcaaec9fab78', 'photo-1565098772267-60af42b81ef2', 'photo-1494253109108-2e30c049369b'] as img, i}
									<div
										class="absolute h-full w-full transition-all duration-300 ease-in-out"
										style="transform: translateX({(i - (carouselIndices[group.name] || 0)) * 100}%)"
									>
										<img
											src="https://img.daisyui.com/images/stock/{img}.webp"
											class="h-full w-full object-cover"
											alt="Carousel item {i + 1}"
										/>
									</div>
								{/each}
							</div>

							<!-- Table -->
							<div
								class="scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-100 max-h-48 overflow-y-auto"
							>
								<table class="table-hover table table-sm bg-base-100">
									<thead class="sticky top-0 z-10 bg-base-100">
										<tr>
											<th></th>
											<th>Music Name</th>
											<th>Date</th>
										</tr>
									</thead>
									<tbody>
										{#each getMusicsByGroup(group.name) as music, i}
											<tr
												class="cursor-pointer"
												on:click={() => {
													carouselIndices[group.name] = i;
													carouselIndices = carouselIndices;
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

		<!-- 두 번째 열 -->
		<div class="flex flex-col gap-4">
			{#each secondColumn as group}
				<div
					class="collapse collapse-plus rounded-xl bg-base-200 shadow-md transition-all duration-500 ease-in-out hover:shadow-lg"
				>
					<input
						type="checkbox"
						checked={activeIndices[group.name]}
						on:change={() => {
							activeIndices[group.name] = !activeIndices[group.name];
							activeIndices = activeIndices;
						}}
					/>
					<div class="collapse-title text-xl font-medium" style="color: {group.color}">
						{group.name}
					</div>
					<div class="collapse-content">
						<div class="flex flex-col gap-4">
							<!-- Carousel -->
							<div class="relative aspect-square w-full overflow-hidden rounded-box">
								{#each ['photo-1559703248-dcaaec9fab78', 'photo-1565098772267-60af42b81ef2'] as img, i}
									<div
										class="absolute h-full w-full transition-all duration-300 ease-in-out"
										style="transform: translateX({(i - (carouselIndices[group.name] || 0)) * 100}%)"
									>
										<img
											src="https://img.daisyui.com/images/stock/{img}.webp"
											class="h-full w-full object-cover"
											alt="Carousel item {i + 1}"
										/>
									</div>
								{/each}
							</div>

							<!-- Table -->
							<div
								class="scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-100 max-h-48 overflow-y-auto"
							>
								<table class="table-hover table table-sm bg-base-100">
									<thead class="sticky top-0 z-10 bg-base-100">
										<tr>
											<th></th>
											<th>Music Name</th>
											<th>Date</th>
										</tr>
									</thead>
									<tbody>
										{#each getMusicsByGroup(group.name) as music, i}
											<tr
												class="cursor-pointer"
												on:click={() => {
													carouselIndices[group.name] = i;
													carouselIndices = carouselIndices;
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

		<!-- 세 번째 열 -->
		<div class="flex flex-col gap-4">
			{#each thirdColumn as group}
				<div
					class="collapse collapse-plus rounded-xl bg-base-200 shadow-md transition-all duration-500 ease-in-out hover:shadow-lg"
				>
					<input
						type="checkbox"
						checked={activeIndices[group.name]}
						on:change={() => {
							activeIndices[group.name] = !activeIndices[group.name];
							activeIndices = activeIndices;
						}}
					/>
					<div class="collapse-title text-xl font-medium" style="color: {group.color}">
						{group.name}
					</div>
					<div class="collapse-content">
						<div class="flex flex-col gap-4">
							<!-- Carousel -->
							<div class="relative aspect-square w-full overflow-hidden rounded-box">
								{#each (['photo-1559703248-dcaaec9fab78'], ['photo-1559703248-dcaaec9fab78']) as img, i}
									<div
										class="absolute h-full w-full transition-all duration-300 ease-in-out"
										style="transform: translateX({(i - (carouselIndices[group.name] || 0)) * 100}%)"
									>
										<img
											src="https://img.daisyui.com/images/stock/{img}.webp"
											class="h-full w-full object-cover"
											alt="Carousel item {i + 1}"
										/>
									</div>
								{/each}
							</div>

							<!-- Table -->
							<div
								class="scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-100 max-h-48 overflow-y-auto"
							>
								<table class="table-hover table table-sm bg-base-100">
									<thead class="sticky top-0 z-10 bg-base-100">
										<tr>
											<th></th>
											<th>Music Name</th>
											<th>Date</th>
										</tr>
									</thead>
									<tbody>
										{#each getMusicsByGroup(group.name) as music, i}
											<tr
												class="cursor-pointer"
												on:click={() => {
													carouselIndices[group.name] = i;
													carouselIndices = carouselIndices;
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
	</div>
</div>
