import { createHash } from 'node:crypto';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { _getMusicLyrics } from '../../+server';

export const GET: RequestHandler = ({ params, request }) => {
	if (!/^\d+$/.test(params.id)) error(400, 'Invalid music ID');
	const id = Number(params.id);
	if (!Number.isSafeInteger(id)) error(400, 'Invalid music ID');

	const lyrics = _getMusicLyrics(id);
	if (!lyrics) error(404, 'Music not found');

	const etag = `"${createHash('sha256').update(JSON.stringify(lyrics)).digest('hex')}"`;
	// Revalidate on every opening so admin edits are not hidden by the browser cache.
	const headers = { 'cache-control': 'private, no-cache', etag };
	const validators = request.headers.get('if-none-match')?.split(',').map((value) => value.trim());
	if (validators?.some((value) => value === '*' || value.replace(/^W\//, '') === etag)) {
		return new Response(null, { status: 304, headers });
	}
	return json(lyrics, { headers });
};
