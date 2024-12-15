<script>
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import { currentLanguage, filter } from '$lib/stores';
	import { onMount } from 'svelte';

	const languageLabels = {
		ko: '🇰🇷 한국어',
		ja: '🇯🇵 日本語',
		en: '🇺🇸 English',
		zh: '🇨🇳 中文'
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
		filter.set([]);
		localStorage.setItem('language', lang);
		document.documentElement.setAttribute('data-lang', lang);
		isOpen = false;
	}
</script>

<details class="dropdown" bind:open={isOpen}>
	<summary class="btn w-36">
		{languageLabels[$currentLanguage]}
		<ChevronDownOutline class="ms-2 h-6 w-6" />
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
