import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const start = 3; // 시작 ID
		const end = 3; // 끝 ID
		// TODO; 아무래도 로그인 기능 없이 운영하는 웹페이지라
		// 불필요한 트래픽을 최소한으로 해야함.
		// 1. rate limit : 분 당 호출할 수 있는 최대 api 갯수
		// 2. 요청 범위 제한. 페이지는 1~16만을 fetch 하는데, 1~100 fetch api 가 요청되는 경우
		// 3. 캐싱 적용 <<--- 중요!!!
		// 4. CORS <-- 아직 정확히 어느 기능을 수행하는지는 모르겠음.
		const response = await fetch(`/api/music?start=${start}&end=${end}`);
		const musics = await response.json();

		return {
			musics
		};
	} catch (error) {
		console.error('Failed to load musics:', error);
		return {
			musics: []
		};
	}
};
