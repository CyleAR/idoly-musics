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
	group: {
		name: string;
		color: string;
		icon_directory: string;
	} | null;
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

export async function GET({ url }: RequestEvent) {
	const db = new Database(dbPath);
	const lang = get(currentLanguage);
	const start = Number(url.searchParams.get('start')) || 1;
	const end = Number(url.searchParams.get('end')) || 16;

	try {
		const results: MusicData[] = [];
		// 언어 컬럼 설정
		const nameColumn =
			{
				ko: 'name_kr',
				en: 'name_en',
				zh: 'name_zh'
			}[lang] || 'name_kr';

		// 기본 음악 정보 쿼리
		const musicQuery = db.prepare(`
		SELECT
			jacket_directory as jacket_directory,
			COALESCE(${nameColumn}, name_jp) as music_name,
			announce_date
		FROM musics
		WHERE id = ?
	`);

		// 아티스트 정보 쿼리
		const artistQuery = db.prepare(`
		SELECT 
			COALESCE(a.${nameColumn}, a.name_jp) as name,
			a.color,
			a.icon_directory
		FROM music_artists ma
		JOIN artists a ON ma.artist_id = a.id
		WHERE ma.music_id = ?
	`);

		// 그룹 정보 쿼리
		const groupQuery = db.prepare(`
		SELECT 
			COALESCE(g.${nameColumn}, g.name_jp) as name,
			g.color,
			g.icon_directory
		FROM music_groups mg
		JOIN groups g ON mg.group_id = g.id
		WHERE mg.music_id = ?
	`);

		// 앨범 정보 쿼리
		const albumQuery = db.prepare(`
		SELECT 
			COALESCE(al.${nameColumn}, al.name_jp) as name,
			al.color,
			al.jacket_directory,
			al.release_date
		FROM music_albums ma
		JOIN albums al ON ma.album_id = al.id
		WHERE ma.music_id = ?
	`);

		for (let id = start; id <= end; id++) {
			const musicData = musicQuery.get(id) as MusicRow;

			if (musicData) {
				const artists = (artistQuery.all(id) as ArtistRow[]).map((artist) => ({
					name: artist.name,
					color: artist.color || '#000000',
					icon_directory: artist.icon_directory || ''
				}));

				const groupResult = groupQuery.get(id) as GroupRow;
				const group = groupResult
					? {
							name: groupResult.name,
							color: groupResult.color || '#000000',
							icon_directory: groupResult.icon_directory || ''
						}
					: null;

				const albums = (albumQuery.all(id) as AlbumRow[]).map((album) => ({
					name: album.name,
					color: album.color || '#000000',
					jacket_directory: album.jacket_directory || '',
					release_date: album.release_date || ''
				}));

				results.push({
					jacket_directory: musicData.jacket_directory || '',
					music_name: musicData.music_name || '',
					group,
					artists,
					albums,
					announce_date: musicData.announce_date || ''
				});
			}
		}

		return json(results);
	} catch (error) {
		console.error('Database error:', error);
		return json({ error: 'Database error' }, { status: 500 });
	} finally {
		db.close();
	}
}
