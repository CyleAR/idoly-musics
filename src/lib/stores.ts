import { writable, derived } from 'svelte/store';

export const currentLanguage = writable('en');
export const global_theme = writable('light');

export const artistFilter = writable<number[]>([]);
export const groupFilter = writable<number[]>([]);
export const albumFilter = writable<number[]>([]);
export const youtubeFilter = writable(false);
export const mvFilter = writable(false);
export const liveFilter = writable(false);
export const searchInputValue = writable('');
export const isFilterEmpty = derived(
    [artistFilter, groupFilter, albumFilter],
    ([$artistFilter, $groupFilter, $albumFilter]) =>
        $artistFilter.length === 0 && $groupFilter.length === 0 && $albumFilter.length === 0
);

export const view_mode = writable('');

export const selectedBlock = writable<number | null>(null);

export const current_page = writable(1);

export const group_images = writable('');
export const album_images = writable('');
export const artist_images = writable('');
export const music_images = writable('');

export function resetFilters() {
    searchInputValue.set('');
    artistFilter.set([]);
    groupFilter.set([]);
    albumFilter.set([]);
    youtubeFilter.set(false);
    mvFilter.set(false);
    liveFilter.set(false);
}