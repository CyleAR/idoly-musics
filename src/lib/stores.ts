import { writable } from 'svelte/store';

export const currentLanguage = writable('ko');

export const global_theme = writable('light');

export const character_filter = writable([]);

export const view_mode = writable('');

export const selectedBlock = writable<number | null>(null);

export const current_page = writable(0);
