import { env } from '$env/dynamic/private';
import { error, fail } from '@sveltejs/kit';
import Database from 'better-sqlite3';
import type { Actions, PageServerLoad } from './$types';
import { _initializeCache } from '../api/music/+server';

type Entity = { id: number; name_ja: string; name_ko: string | null };
type Music = Record<string, unknown> & {
	id: number;
	name_ja: string;
	artists: number[];
	groups: number[];
	albums: number[];
};

const relations = {
	artists: ['music_artists', 'artist_id'],
	groups: ['music_groups', 'group_id'],
	albums: ['music_albums', 'album_id']
} as const;

function normalizeIp(ip: string) {
	const value = ip.trim().toLowerCase();
	if (value.startsWith('::ffff:')) return value.slice(7);
	if (value === '::1') return '127.0.0.1';
	return value;
}

function requireAdmin(getClientAddress: () => string) {
	const clientIp = normalizeIp(getClientAddress());
	const allowedIps = (env.ADMIN_ALLOWED_IPS || '').split(',').map(normalizeIp).filter(Boolean);
	if (!allowedIps.includes(clientIp)) error(403, `관리자 접근이 거부되었습니다. 확인된 IP: ${clientIp}`);
	return clientIp;
}

function formText(data: FormData, key: string, maxLength = 10000) {
	return String(data.get(key) || '').trim().slice(0, maxLength);
}

function formIds(data: FormData, key: string) {
	return [...new Set(data.getAll(key).map(Number).filter((id) => Number.isInteger(id) && id >= 0))];
}

function formId(data: FormData) {
	const value = data.get('id');
	return value === null || String(value).trim() === '' ? -1 : Number(value);
}

export const load: PageServerLoad = ({ getClientAddress }) => {
	const clientIp = requireAdmin(getClientAddress);
	const db = new Database('./static/music.db');
	try {
		const musics = db.prepare('SELECT * FROM musics ORDER BY id DESC').all() as Music[];
		for (const music of musics) {
			for (const [key, [table, column]] of Object.entries(relations)) {
				music[key] = db.prepare(`SELECT ${column} id FROM ${table} WHERE music_id = ?`).all(music.id).map((row: any) => row.id);
			}
		}
			return {
			clientIp,
			musics,
			artists: db.prepare('SELECT id, name_ja, name_ko FROM artists ORDER BY id').all() as Entity[],
			groups: db.prepare('SELECT id, name_ja, name_ko FROM groups ORDER BY id').all() as Entity[],
				albums: db.prepare('SELECT * FROM albums ORDER BY id').all() as (Entity & Record<string, unknown>)[]
		};
	} finally {
		db.close();
	}
};

export const actions = {
	save: async ({ request, getClientAddress }) => {
		requireAdmin(getClientAddress);
		const data = await request.formData();
		const id = formId(data);
		const nameJa = formText(data, 'name_ja', 200);
		if (!nameJa) return fail(400, { message: '일본어 곡명은 필수입니다.' });

		const nullableText = (key: string, maxLength = 10000) => formText(data, key, maxLength) || null;
		const values = [
			nullableText('stream_url'), nullableText('stream_url_ja'),
			nullableText('mv_url'), nullableText('live_url'), nullableText('announce_date'),
			nullableText('name_ko', 200), nullableText('name_en', 200), nullableText('name_zh', 200),
			nullableText('lyrics_ja'), nullableText('furigana_ko'), nullableText('comment')
		];
		const lengthInput = formText(data, 'length', 20);
		const length = lengthInput ? Math.max(0, Number(lengthInput) || 0) : null;
		const db = new Database('./static/music.db');
		db.pragma('foreign_keys = ON');

		try {
			const saveMusic = db.transaction(() => {
				let musicId: number;
				if (Number.isInteger(id) && id >= 0) {
					const result = db.prepare(`UPDATE musics SET stream_url=?, stream_url_ja=?, mv_url=?, live_url=?, announce_date=?, name_ko=?, name_en=?, name_zh=?, lyrics_ja=?, furigana_ko=?, comment=?, length=?, name_ja=? WHERE id=?`).run(...values, length, nameJa, id);
					if (!result.changes) throw new Error('수정할 곡을 찾지 못했습니다.');
					musicId = id;
				} else {
					const result = db.prepare(`INSERT INTO musics (stream_url, stream_url_ja, mv_url, live_url, announce_date, name_ko, name_en, name_zh, lyrics_ja, furigana_ko, comment, length, name_ja) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(...values, length, nameJa);
					musicId = Number(result.lastInsertRowid);
				}

				for (const [key, [table, column]] of Object.entries(relations)) {
					db.prepare(`DELETE FROM ${table} WHERE music_id = ?`).run(musicId);
					const insert = db.prepare(`INSERT INTO ${table} (music_id, ${column}) VALUES (?, ?)`);
					for (const relationId of formIds(data, key)) insert.run(musicId, relationId);
				}
				return musicId;
			});
			const musicId = saveMusic();
			_initializeCache();
			return { success: true, message: `곡 #${musicId}을 저장하고 공개 데이터 캐시를 갱신했습니다.` };
		} catch (cause) {
			return fail(400, { message: cause instanceof Error ? cause.message : '저장하지 못했습니다.' });
		} finally {
			db.close();
		}
	},

	delete: async ({ request, getClientAddress }) => {
		requireAdmin(getClientAddress);
		const id = Number((await request.formData()).get('id'));
		if (!Number.isInteger(id) || id < 0) return fail(400, { message: '곡 ID가 올바르지 않습니다.' });
		const db = new Database('./static/music.db');
		try {
			db.transaction(() => {
				for (const [table] of Object.values(relations)) db.prepare(`DELETE FROM ${table} WHERE music_id = ?`).run(id);
				db.prepare('DELETE FROM musics WHERE id = ?').run(id);
			})();
			_initializeCache();
			return { success: true, message: `곡 #${id}을 삭제하고 공개 데이터 캐시를 갱신했습니다.` };
		} finally {
			db.close();
		}
	},

	saveAlbum: async ({ request, getClientAddress }) => {
		requireAdmin(getClientAddress);
		const data = await request.formData();
		const id = formId(data);
		const nameJa = formText(data, 'name_ja', 200);
		if (!nameJa) return fail(400, { message: '일본어 앨범명은 필수입니다.' });
		const values = [
			formText(data, 'release_date', 20) || null,
			formText(data, 'color', 20) || '#000000',
			nameJa,
			formText(data, 'name_ko', 200) || null,
			formText(data, 'name_en', 200) || null,
			formText(data, 'name_zh', 200) || null,
			formText(data, 'comment') || null
		];
		const db = new Database('./static/music.db');
		try {
			let albumId: number;
			if (Number.isInteger(id) && id >= 0) {
				const result = db.prepare('UPDATE albums SET release_date=?, color=?, name_ja=?, name_ko=?, name_en=?, name_zh=?, comment=? WHERE id=?').run(...values, id);
				if (!result.changes) throw new Error('수정할 앨범을 찾지 못했습니다.');
				albumId = id;
			} else {
				albumId = Number(db.prepare('INSERT INTO albums (release_date, color, name_ja, name_ko, name_en, name_zh, comment) VALUES (?, ?, ?, ?, ?, ?, ?)').run(...values).lastInsertRowid);
			}
			_initializeCache();
			return { success: true, message: `앨범 #${albumId}을 저장하고 공개 데이터 캐시를 갱신했습니다.` };
		} catch (cause) {
			return fail(400, { message: cause instanceof Error ? cause.message : '앨범을 저장하지 못했습니다.' });
		} finally {
			db.close();
		}
	}
} satisfies Actions;
