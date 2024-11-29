import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import Database from 'better-sqlite3';
import { get } from 'svelte/store';
import { currentLanguage } from '$lib/stores';
import { dev } from '$app/environment';
import * as type from '$lib/types';

const dbPath = dev ? './static/music.db' : './music.db';

type ArtistCache = {
	[key in 'en' | 'ja' | 'ko' | 'zh']: { id: number; name: string }[];
};
type CacheType = {
	[key in 'en' | 'ja' | 'ko' | 'zh']: type.MusicData[];
};

const artistCache: ArtistCache = {
	en: [],
	ja: [],
	ko: [],
	zh: []
};

const cache: CacheType = {
	en: [],
	ja: [],
	ko: [],
	zh: []
};

function loadLanguageData(db: any, lang: keyof CacheType): type.MusicData[] {
	const nameColumn = {
		ko: 'name_ko',
		ja: 'name_ja',
		en: 'name_en',
		zh: 'name_zh'
	}[lang];

	const musicQuery = db.prepare(`
        SELECT
            id,
            COALESCE(${nameColumn}, name_ja) as music_name,
            announce_date
        FROM musics
        ORDER BY id
    `);

	const artistQuery = db.prepare(`
        SELECT 
            ma.music_id,
			a.id as artist_id,
            COALESCE(a.${nameColumn}, a.name_ja) as name,
            a.color
        FROM music_artists ma
        JOIN artists a ON ma.artist_id = a.id
    `);

	const groupQuery = db.prepare(`
        SELECT 
            mg.music_id,
            COALESCE(g.${nameColumn}, g.name_ja) as name,
            g.color
        FROM music_groups mg
        JOIN groups g ON mg.group_id = g.id
    `);

	const albumQuery = db.prepare(`
        SELECT 
            ma.music_id,
            COALESCE(al.${nameColumn}, al.name_ja) as name,
            al.color,
            al.release_date
        FROM music_albums ma
        JOIN albums al ON ma.album_id = al.id
    `);

	const musics = musicQuery.all() as (type.MusicRow & { id: number })[];
	const artists = artistQuery.all() as (type.ArtistRow & { music_id: number })[];
	const groups = groupQuery.all() as (type.GroupRow & { music_id: number })[];
	const albums = albumQuery.all() as (type.AlbumRow & { music_id: number })[];

	return musics.map((music) => ({
		music_name: music.music_name || '',
		groups: groups
			.filter((g) => g.music_id === music.id)
			.map((group) => ({
				name: group.name,
				color: group.color || '#000000'
			})),
		artists: artists
			.filter((a) => a.music_id === music.id)
			.map((artist) => ({
				id: artist.artist_id,
				name: artist.name,
				color: artist.color || '#000000'
			})),
		albums: albums
			.filter((a) => a.music_id === music.id)
			.map((album) => ({
				name: album.name,
				color: album.color || '#000000',
				release_date: album.release_date || ''
			})),
		announce_date: music.announce_date || ''
	}));
}

function initializeCache() {
	const db = new Database(dbPath);
	loadArtistCache(db);
	try {
		['en', 'ja', 'ko', 'zh'].forEach((lang) => {
			cache[lang as keyof CacheType] = loadLanguageData(db, lang as keyof CacheType);
		});
		console.log('Cache initialized successfully');
	} catch (error) {
		console.error('Failed to initialize cache:', error);
	} finally {
		db.close();
	}
}

function loadArtistCache(db: any) {
	const query = db.prepare(`
		SELECT id, name_ko, name_ja, name_en, name_zh FROM artists
	`);

	const artists = query.all();

	artists.forEach((artist: type.ArtistData) => {
		artistCache.ko.push({ id: artist.id, name: artist.name_ko });
		artistCache.ja.push({ id: artist.id, name: artist.name_ja });
		artistCache.en.push({ id: artist.id, name: artist.name_en });
		artistCache.zh.push({ id: artist.id, name: artist.name_zh });
	});

	console.log(artists);
}

initializeCache();

export async function GET({ url }: RequestEvent) {
	const lang = String(url.searchParams.get('lang')) as keyof CacheType;
	const start = Number(url.searchParams.get('start')) || 1;
	const end = Number(url.searchParams.get('end')) || 16;

	const results = cache[lang].slice(start - 1, end);
	return json({
		results,
		artistCache: artistCache[lang]
	});
}
