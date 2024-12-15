import { writable } from 'svelte/store';

export const currentLanguage = writable('en');

export const global_theme = writable('light');

export const filter = writable([]);

export const current_filter_type = writable('');

export const previous_filter_type = writable('');

export const view_mode = writable('');

export const selectedBlock = writable<number | null>(null);
