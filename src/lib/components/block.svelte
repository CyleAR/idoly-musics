<!-- 그리고 글자는 다 16px로 일단 해주시고 -->
<!-- 그룹,노래,아티스트 이름 다 _translations에 id랑 연결된 테이블 있는데 거기서 가져오시면 되는데 언어별로 가져오는게 다르거든요 그래서 언어별로 사이트 보이는게 달라야 해요
이건 그냥 kr,en,jp,zh(짱꺠어) 지정을 전역으로 하면 언어코드에 저장된 데이터 가져오면 될듯 (그래서 시안에 언어변경창이있는거)
그리고 태그에 배경색은 db에 다 아티스트 개인별, 그룹별, 앨범별 테이블에 color 지정되어있으니 id별로 연동된 색을 바탕색으로 쓸 수 있게 하면될듯 -->

<script lang="ts">
	export let title: string;
	export let artists: string;
	export let groups: string;
	export let colorTag: string;
	export let thumbnail: string;
	export let included_albums: string[];
	export let announce_date: string;
</script>

<!-- TODO: 위아래 길이 기준은 '아티스트' 태그 기준으로 아티스트 많아지면 위아래로 길쭉해지게 -->
<div id="block-main" class="flex h-32 w-full flex-row rounded-xl bg-base-300">
	<!-- 컬러 태그 -->
	<div id="color-tag" class="h-full w-2 rounded-l-xl" style="background-color: {colorTag};"></div>

	<!-- 메인 콘텐츠 -->
	<div class="flex flex-1 items-center">
		<!-- 콘텐츠 그리드 -->
		<div class="flex flex-1 items-center">
			<!-- 썸네일 -->
			<div class="h-[5%] w-[5%] flex-shrink-0 p-2">
				<img src={thumbnail || '/note.png'} class="h-24 w-24 object-contain" alt="thumbnail" />
			</div>
			<div class="w-[15%] flex-shrink-0 px-4">
				{title}
			</div>

			<div class="seperator" />

			<div class="w-[10%] flex-shrink-0 px-4">
				{groups}
			</div>

			<div class="seperator" />

			<div class="w-[33%] flex-shrink-0 px-4">
				{artists}
			</div>

			<div class="seperator" />

			<div class="w-[20%] flex-shrink-0 px-4">
				{included_albums}
			</div>

			<div class="seperator" />

			<div class="w-[17%] flex-shrink-0 px-4">
				{announce_date}
			</div>
		</div>
	</div>
</div>

<style>
	.seperator {
		@apply h-28 border-r border-white/10;
	}

	/* 모든 텍스트에 대한 기본 스타일 */
	#block-main {
		font-size: 16px;
		line-height: 1.5;
	}

	#block-main {
		font-size: 16px;
		line-height: 1.5;
	}
</style>
