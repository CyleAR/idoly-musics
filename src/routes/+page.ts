import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const start = 3; // 시작 ID
		const end = 3; // 끝 ID
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
