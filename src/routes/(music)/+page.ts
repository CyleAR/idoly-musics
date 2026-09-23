import type { PageLoad } from './$types';
import { get } from 'svelte/store';
import { currentLanguage } from '$lib/stores';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const start = 1;
		const end = 200; // 200개씩 가져옴, 현재 곡은 약 110개
		const lang = get(currentLanguage);
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
