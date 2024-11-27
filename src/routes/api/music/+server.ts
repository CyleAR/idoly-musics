import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import Database from 'better-sqlite3';
import { get } from 'svelte/store';
import { currentLanguage } from '$lib/stores';
import { dev } from '$app/environment';

const dbPath = dev ? './static/music.db' : './music.db';

interface MusicRow {
	jacket_directory: string;
	music_name: string;
	announce_date: string;
}

interface MusicData {
	jacket_directory: string;
	music_name: string;
	groups:
		| {
				name: string;
				color: string;
				icon_directory: string;
		  }[]
		| null;
	artists: {
		name: string;
		color: string;
		icon_directory: string;
	}[];
	albums: {
		name: string;
		color: string;
		jacket_directory: string;
		release_date: string;
	}[];
	announce_date: string;
}

interface ArtistRow {
	name: string;
	color: string | null;
	icon_directory: string | null;
}

interface GroupRow {
	name: string;
	color: string | null;
	icon_directory: string | null;
}

interface AlbumRow {
	name: string;
	color: string | null;
	jacket_directory: string | null;
	release_date: string | null;
}
// 캐시 타입 정의
type CacheType = {
	[key in 'en' | 'ja' | 'ko' | 'zh']: MusicData[];
};

// 전역 캐시 객체
const cache: CacheType = {
	en: [],
	ja: [],
	ko: [],
	zh: []
};

// 데이터베이스에서 특정 언어의 데이터를 로드하는 함수
function loadLanguageData(db: any, lang: keyof CacheType): MusicData[] {
	const nameColumn = {
		ko: 'name_ko',
		ja: 'name_ja',
		en: 'name_en',
		zh: 'name_zh'
	}[lang];

	const musicQuery = db.prepare(`
        SELECT
            id,
            jacket_directory,
            COALESCE(${nameColumn}, name_ja) as music_name,
            announce_date
        FROM musics
        ORDER BY id
    `);

	const artistQuery = db.prepare(`
        SELECT 
            ma.music_id,
            COALESCE(a.${nameColumn}, a.name_ja) as name,
            a.color,
            a.icon_directory
        FROM music_artists ma
        JOIN artists a ON ma.artist_id = a.id
    `);

	const groupQuery = db.prepare(`
        SELECT 
            mg.music_id,
            COALESCE(g.${nameColumn}, g.name_ja) as name,
            g.color,
            g.icon_directory
        FROM music_groups mg
        JOIN groups g ON mg.group_id = g.id
    `);

	const albumQuery = db.prepare(`
        SELECT 
            ma.music_id,
            COALESCE(al.${nameColumn}, al.name_ja) as name,
            al.color,
            al.jacket_directory,
            al.release_date
        FROM music_albums ma
        JOIN albums al ON ma.album_id = al.id
    `);

	const musics = musicQuery.all() as (MusicRow & { id: number })[];
	const artists = artistQuery.all() as (ArtistRow & { music_id: number })[];
	const groups = groupQuery.all() as (GroupRow & { music_id: number })[];
	const albums = albumQuery.all() as (AlbumRow & { music_id: number })[];

	return musics.map((music) => ({
		jacket_directory: music.jacket_directory || '',
		music_name: music.music_name || '',
		groups: groups
			.filter((g) => g.music_id === music.id)
			.map((group) => ({
				name: group.name,
				color: group.color || '#000000',
				icon_directory: group.icon_directory || ''
			})),
		artists: artists
			.filter((a) => a.music_id === music.id)
			.map((artist) => ({
				name: artist.name,
				color: artist.color || '#000000',
				icon_directory: artist.icon_directory || ''
			})),
		albums: albums
			.filter((a) => a.music_id === music.id)
			.map((album) => ({
				name: album.name,
				color: album.color || '#000000',
				jacket_directory: album.jacket_directory || '',
				release_date: album.release_date || ''
			})),
		announce_date: music.announce_date || ''
	}));
}

// 서버 시작 시 모든 언어의 데이터를 캐시에 로드
function initializeCache() {
	const db = new Database(dbPath);
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

// 서버 시작 시 캐시 초기화
initializeCache();

export async function GET({ url }: RequestEvent) {
	const lang = String(url.searchParams.get('lang')) as keyof CacheType;
	const start = Number(url.searchParams.get('start')) || 1;
	const end = Number(url.searchParams.get('end')) || 16;

	// 캐시된 데이터에서 요청된 범위의 데이터만 반환
	const results = cache[lang].slice(start - 1, end);
	return json(results);
}
