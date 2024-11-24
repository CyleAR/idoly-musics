import { writable } from 'svelte/store';

// 언어 데이터
export const languages = {
	ko: {
		dashboard: '대시보드',
		settings: '설정',
		earnings: '수익',
		signOut: '로그아웃',
		dropdownButton: '언어 선택'
	},
	en: {
		dashboard: 'Dashboard',
		settings: 'Settings',
		earnings: 'Earnings',
		signOut: 'Sign out',
		dropdownButton: 'Select Language'
	},
	zh: {
		dashboard: '仪表板',
		settings: '设置',
		earnings: '收益',
		signOut: '登出',
		dropdownButton: '选择语言'
	}
};

// 현재 선택된 언어 저장
export const currentLanguage = writable('ko');

export const global_theme = writable('light');
