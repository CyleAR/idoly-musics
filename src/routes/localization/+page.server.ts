import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';

type RecentWorkItem = {
	id: number;
	unit_id: string;
	original_text: string;
	previous_text: string | null;
	previous_translator_name: string | null;
	translation_text: string;
	translator_name: string;
	changed_at: string;
	category: string;
	source_file: string;
	field_path: string;
	scope_type: string | null;
	scope_id: string | null;
};

export const load = (async ({ fetch }) => {
	const token = env.RECENT_WORK_API_TOKEN;
	if (!token) return { recentWork: [] as RecentWorkItem[], recentWorkAvailable: false };

	try {
		const response = await fetch('https://hoshimistation.cyle.me/api/recent-work?view=changes&limit=5', {
			headers: { Authorization: `Bearer ${token}` },
			signal: AbortSignal.timeout(5000)
		});
		if (!response.ok) throw new Error(`Recent work API returned ${response.status}`);

		const result: unknown = await response.json();
		if (!result || typeof result !== 'object' || !('items' in result) || !Array.isArray(result.items)) {
			throw new Error('Unexpected recent work response');
		}

		const recentWork = result.items.filter((item): item is RecentWorkItem =>
			item !== null && typeof item === 'object' &&
			typeof item.id === 'number' &&
			typeof item.unit_id === 'string' &&
			typeof item.original_text === 'string' &&
			(item.previous_text === null || typeof item.previous_text === 'string') &&
			(item.previous_translator_name === null || typeof item.previous_translator_name === 'string') &&
			typeof item.translation_text === 'string' &&
			typeof item.translator_name === 'string' &&
			typeof item.changed_at === 'string' &&
			typeof item.category === 'string' &&
			typeof item.source_file === 'string' &&
			typeof item.field_path === 'string' &&
			(item.scope_type === null || typeof item.scope_type === 'string') &&
			(item.scope_id === null || typeof item.scope_id === 'string')
		).slice(0, 5);

		return { recentWork, recentWorkAvailable: true };
	} catch {
		return { recentWork: [] as RecentWorkItem[], recentWorkAvailable: false };
	}
}) satisfies PageServerLoad;
