import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'selector',
	theme: {
		extend: {
			colors: {
				artist: {
					kotono: '#5c88d8',
					nagisa: '#f56d9d',
					saki: '#6aceb9',
					suzu: '#f1ee56',
					mei: '#e03e52',
					sakura: '#f69941',
					shizuku: '#99c99b',
					chisa: '#e7bbd2',
					rei: '#ace3ef',
					haruko: '#c1a7e1',
					rui: '#fcfaf1',
					yu: '#aece6e',
					sumire: '#ffe494',
					rio: '#ae5287',
					aoi: '#6f77cb',
					ai: '#7ecced',
					kokoro: '#fc9bb2',
					fran: '#474744',
					kana: '#474744',
					miho: '#474744',
					mana: '#f151af',
					miku: '#55b4af',
					lemon: '#690096',
					lime: '#ff0000',
					satomi: '#0092ce'
				}
			}
		}
	},
	safelist: [
		'bg-artist-kotono', // #5c88d8
		'bg-artist-nagisa', // #f56d9d
		'bg-artist-saki', // #6aceb9
		'bg-artist-suzu', // #f1ee56
		'bg-artist-mei', // #e03e52
		'bg-artist-sakura', // #f69941
		'bg-artist-shizuku', // #99c99b
		'bg-artist-chisa', // #e7bbd2
		'bg-artist-rei', // #ace3ef
		'bg-artist-haruko', // #c1a7e1
		'bg-artist-rui', // #fcfaf1
		'bg-artist-yu', // #aece6e
		'bg-artist-sumire', // #ffe494
		'bg-artist-rio', // #ae5287
		'bg-artist-aoi', // #6f77cb
		'bg-artist-ai', // #7ecced
		'bg-artist-kokoro', // #fc9bb2
		'bg-artist-fran', // #474744
		'bg-artist-kana', // #474744
		'bg-artist-miho', // #474744
		'bg-artist-mana', // #f151af
		'bg-artist-miku', // #55b4af
		'bg-artist-lemon', // #690096
		'bg-artist-lime', // #ff0000
		'bg-artist-satomi' // #0092ce
	],
	plugins: [require('daisyui')]
} as Config;
