import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	setTheme: async ({ url, cookies }) => {
		const theme = url.searchParams.get('theme');
		const redirectTo = url.searchParams.get('redirectTo') || '/';

		if (theme) {
			cookies.set('colortheme', theme, {
				path: '/',
				maxAge: 60 * 60 * 24 * 365
			});
		}

		throw redirect(303, redirectTo);
	},

	setLang: async ({ url, cookies }) => {
		const lang = url.searchParams.get('lang');
		const redirectTo = url.searchParams.get('redirectTo') || '/';

		if (lang) {
			cookies.set('language', lang, {
				path: '/',
				maxAge: 60 * 60 * 24 * 365
			});
		}

		throw redirect(303, redirectTo);
	}
} satisfies Actions;
