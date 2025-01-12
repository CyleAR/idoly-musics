import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'selector',
	theme: {
		extend: {
			fontFamily: {
				sans: [
					'Pretendard JP Variable',
					'Pretendard JP',
					'Pretendard',
					'-apple-system',
					'BlinkMacSystemFont',
					'system-ui',
					'Roboto',
					'Helvetica Neue',
					'Segoe UI',
					'Hiragino Sans',
					'Apple SD Gothic Neo',
					'Meiryo',
					'Noto Sans JP',
					'Noto Sans KR',
					'Malgun Gothic',
					'Osaka',
					'Apple Color Emoji',
					'Segoe UI Emoji',
					'Segoe UI Symbol',
					'sans-serif'
				]
			}
		}
	},
	plugins: [
		require('@tailwindcss/aspect-ratio'),
		require('daisyui'),
		require('tailwind-scrollbar-hide')
	]
} as Config;
