import { writable } from 'svelte/store';

export const currentLanguage = writable('en');

export const global_theme = writable('light');

export const filter = writable([]);

export const current_filter_type = writable('');

export const previous_filter_type = writable('');

export const view_mode = writable('');

export const selectedBlock = writable<number | null>(null);

export const filter_type = writable('');

export const group_images = writable('');
export const album_images = writable('');
export const artist_images = writable('');
export const music_images = writable('');
