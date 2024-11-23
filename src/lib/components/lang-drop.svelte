<script>
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { ChevronDownOutline, SunOutline, MoonOutline } from 'flowbite-svelte-icons';
	import { currentLanguage, languages } from '$lib/stores';
	const languageLabels = {
		ko: '🇰🇷 한국어',
		en: '🇺🇸 English',
		zh: '🇨🇳 中文'
	};

	let dropdownOpen = false;
	let isOpen = false;
	const handleLanguageChange = (lang) => {
		currentLanguage.set(lang);
		dropdownOpen = false;
	};
</script>

<details class="dropdown" bind:open={isOpen}>
	<summary class="btn w-36">
		{languageLabels[$currentLanguage]}
		<ChevronDownOutline class="ms-2 h-6 w-6" />
	</summary>
	<ul class="menu dropdown-content z-[1] w-32 rounded-box bg-base-100 p-2 shadow">
		{#each Object.entries(languageLabels) as [lang, label]}
			<li>
				<button
					on:click={() => {
						handleLanguageChange(lang);
						isOpen = false;
					}}
				>
					{label}
				</button>
			</li>
		{/each}
	</ul>
</details>
