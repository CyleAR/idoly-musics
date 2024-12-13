import { writable } from 'svelte/store';

export const currentLanguage = writable('en');

export const global_theme = writable('light');

export const character_filter = writable([]);

export const view_mode = writable('');

export const selectedBlock = writable<number | null>(null);
