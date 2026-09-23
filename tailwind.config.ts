import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'selector',
	daisyui: {
		themes: [
			{
				light: {
					...require('daisyui/src/theming/themes').light,
					'base-100': '#FCFDFE',
					'base-200': '#F2F5FA',
					'base-300': '#E7EDF5',
					'base-content': '#293449',
					primary: '#5267B8',
					'primary-content': '#FFFFFF',
					neutral: '#344158',
					'neutral-content': '#F5F7FC'
				}
			},
			'dark'
		]
	},
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
