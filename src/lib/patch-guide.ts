// 다운로드 주소와 안내 문구는 이 파일에서 수정하세요.
export const patchGuides = [
	{
		id: 'android', name: 'Android', device: '안드로이드 스마트폰 · 태블릿',
		summary: '패치된 게임과 번역 관리 앱을 함께 설치해요.', badge: 'APK 설치',
		source: 'https://gall.dcinside.com/mgallery/board/view/?id=idolypride&no=176258',
		downloads: [{ label: 'APK 다운로드', detail: '릴리스 페이지에서 아래 두 파일을 받아 주세요.', url: 'https://github.com/CyleAR/ipr-patcher/releases/latest' }],
		files: ['HoshimiLocalify_vX.X.X.apk', 'Idolypride_X.X.X_embedded.apk'],
		steps: [
			{ title: '계정을 먼저 보호해 주세요', text: '기존 일본판을 이용 중이라면 계정 인계 정보와 비밀번호를 설정하고 보관해 주세요. 확인한 뒤 기존 앱을 삭제합니다.' },
			{ title: 'APK 두 개를 설치해 주세요', text: '다운로드 페이지에서 번역 관리 앱과 패치된 게임 APK를 모두 받아 설치하세요. 기기에서 요청하는 경우 해당 설치 출처의 앱 설치를 허용해 주세요.' },
			{ title: '번역 데이터를 업데이트해 주세요', text: 'Hoshimi Localify 앱을 열고 번역 데이터를 업데이트한 뒤 게임을 실행하세요.' },
			{ title: '한글 적용을 확인해 주세요', text: '시작할 때 libHoshimiLocalify.so loaded 안내와 로딩 창이 나타나는지 확인하세요. 새 번역 알림이 뜨면 Localify 앱에서 리소스를 업데이트하면 됩니다.' }
		],
		notes: ['구글 계정 로그인은 지원되지 않을 수 있으니 계정 인계 비밀번호를 준비해 주세요.', '패치 앱에서는 결제할 수 없습니다. 결제가 필요하면 별도 기기나 에뮬레이터의 Google Play 버전을 이용해 주세요.', '이후 패치 앱을 업데이트할 때는 기존 패치 앱 위에 설치하면 됩니다.'],
		preparation: null,
		alternativePreparation: null
	},
	{
		id: 'ios', name: 'iOS / iPadOS', device: 'iPhone · iPad',
		summary: '한글패치가 포함된 IPA를 사이드로딩으로 설치해요.', badge: 'IPA 설치',
		downloads: [{ label: '패치 IPA 다운로드', detail: '게임 6.0.2 · HoshimiLocalify v1.0.0', url: 'https://cloud.cyle.me/IdolyPride-6.0.2-HoshimiLocalify-v1.0.0.ipa' }],
		files: [],
		preparation: { label: '사이드로딩 준비 안내', url: 'https://gall.dcinside.com/mgallery/board/view/?id=vanced&no=28269' },
		alternativePreparation: { label: 'SideStore 공식 설치 안내', url: 'https://docs.sidestore.io/docs/installation/install' },
		steps: [
			{ title: '사이드로딩 환경을 준비해 주세요', text: '아래 준비 안내에 따라 iLoader와 개발자 인증을 설정하세요. SideStore를 쓸 경우에는 공식 안내에 따라 SideStore 설치·로그인과 LocalDevVPN 설정도 마쳐 주세요.' },
			{ title: '패치된 IPA를 받아 주세요', text: '아래 버튼에서 IPA 파일을 다운로드하세요. 번역 기능이 통합되어 있어 별도 번역 관리 앱은 필요하지 않습니다.' },
			{ title: 'iLoader 또는 SideStore로 설치해 주세요', text: 'iLoader: Windows PC에 iPhone 또는 iPad를 연결하고 Import IPA에서 받은 파일을 선택해 설치하세요.\nSideStore: 기기의 파일 앱에 IPA를 저장한 뒤 LocalDevVPN을 연결하고, SideStore의 My Apps에서 + 버튼을 눌러 IPA를 선택해 설치하세요.' },
			{ title: '실행과 갱신을 확인해 주세요', text: '게임을 실행해 한글 적용을 확인하세요. 자동 갱신을 설정하지 않았다면 원문 안내 기준으로 7일마다 갱신 또는 재설치가 필요합니다.' }
		],
		notes: ['기존 게임과 별도로 설치할 수 있어 원래 앱을 지울 필요는 없습니다.', '원문 테스트 환경은 iPadOS 27의 iPad Air 4입니다. 다른 환경에서의 실행은 보장되지 않으며 종료나 지연이 발생할 수 있습니다.']
	}
];
