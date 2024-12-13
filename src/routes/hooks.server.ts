import type { Handle } from '@sveltejs/kit';

export const handle = (async ({ event, resolve }) => {
	let theme: string | null = null;
	let language: string | null = null;

	const newTheme = event.url.searchParams.get('theme');
	const newLang = event.url.searchParams.get('lang');
	const cookieTheme = event.cookies.get('colortheme');
	const cookieLang = event.cookies.get('language');

	if (newTheme) {
		theme = newTheme;
	} else if (cookieTheme) {
		theme = cookieTheme;
	}

	if (newLang) {
		language = newLang;
	} else if (cookieLang) {
		language = cookieLang;
	}

	if (theme || language) {
		return await resolve(event, {
			transformPageChunk: ({ html }) => {
				let modifiedHtml = html;
				if (theme) {
					modifiedHtml = modifiedHtml.replace('data-theme=""', `data-theme="${theme}"`);
				}
				if (language) {
					modifiedHtml = modifiedHtml.replace('data-lang=""', `data-lang="${language}"`);
				}
				return modifiedHtml;
			}
		});
	}

	return await resolve(event);
}) satisfies Handle;
