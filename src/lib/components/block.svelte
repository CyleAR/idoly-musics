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
	<!-- TODO: 그룹명이 '솔로' 일 경우에만 artist 테이블에 color 가져오고 그 외의 경우엔 group테이블에서 색 가져오게 코딩해주심 되고 색 두께는 10px정도로 -->
	<div id="color-tag" class="h-full w-2 rounded-l-xl bg-blue-600"></div>
	<div class="flex flex-1">
		<div id="thumbnail" class="flex h-32 w-32 items-center justify-center p-2">
			<!-- TODO: 받은 이미지로 대체. 사이즈는 100x100으로 보이게 -->
			<img src="/note.png" class="h-24 w-24 object-contain" alt="thumbnail" />
		</div>
		<div id="title">{title} 🟦</div>
		<!-- <div class="ml-[8%] h-28 self-center border-r-4 border-white/10"></div> -->
		<div id="groups">{groups} 🟦</div>
		<!-- <div class="ml-[10%] h-28 self-center border-r-4 border-white/10"></div> -->
		<div id="artists">{artists} 🟦</div>
		<!-- <div class="ml-[34.5%] h-28 self-center border-r-4 border-white/10"></div> -->
		<div id="included-album">{included_albums} 🟦</div>
		<!-- <div class="ml-[20.5%] h-28 self-center border-r-4 border-white/10"></div> -->
		<div id="release-date">{announce_date}</div>
	</div>
</div>
