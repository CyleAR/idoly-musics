<script>
	import { view_mode } from '$lib/stores';
	import { currentLanguage, resetFilters } from '$lib/stores';
	import { onMount } from 'svelte';

	const languageLabels = {
		ko: '한국어',
		ja: '日本語',
		en: 'English',
		zh: '中文(繁體)'
	};

	let isOpen = false;

	function detectUserLanguage() {
		const browserLang = navigator.language.toLowerCase();

		const languageMapping = {
			ko: 'ko',
			'ko-kr': 'ko',
			ja: 'ja',
			'ja-jp': 'ja',
			zh: 'zh',
			'zh-cn': 'zh',
			'zh-tw': 'zh',
			'zh-hk': 'zh',
			en: 'en',
			'en-us': 'en',
			'en-gb': 'en'
		};

		const detectedLang = languageMapping[browserLang];

		return detectedLang || 'en';
	}

	onMount(() => {
		const savedLang = localStorage.getItem('language');

		if (savedLang) {
			currentLanguage.set(savedLang);
			document.documentElement.setAttribute('data-lang', savedLang);
		} else {
			const detectedLang = detectUserLanguage();
			currentLanguage.set(detectedLang);
			localStorage.setItem('language', detectedLang);
			document.documentElement.setAttribute('data-lang', detectedLang);
		}
	});

	async function handleLanguageChange(lang) {
		currentLanguage.set(lang);
		// view_mode.set('');
		localStorage.setItem('language', lang);
		document.documentElement.setAttribute('data-lang', lang);
		isOpen = false;
	}
</script>

<details class="dropdown" bind:open={isOpen}>
	<summary class="w-30 btn">
		{languageLabels[$currentLanguage]}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="ml-2 h-4 w-4"
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			<path
				fill-rule="evenodd"
				d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
				clip-rule="evenodd"
			/>
		</svg>
	</summary>
	<ul class="menu dropdown-content z-[1] w-32 rounded-box bg-base-100 p-2 shadow">
		{#each Object.entries(languageLabels) as [lang, label]}
			<li>
				<button on:click={() => handleLanguageChange(lang)}>
					{label}
				</button>
			</li>
		{/each}
	</ul>
</details>
