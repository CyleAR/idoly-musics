import type { PageLoad } from './$types';
import { get } from 'svelte/store';
import { currentLanguage } from '$lib/stores';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const start = 1;
		const end = 100;
		const lang = get(currentLanguage); // store에서 현재 언어 값을 가져옴
		const response = await fetch(`/api/music?start=${start}&end=${end}&lang=${lang}`);
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
