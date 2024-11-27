export interface ArtistData {
	id: number;
	name_ko: string;
	name_ja: string;
	name_en: string;
	name_zh: string;
}

export interface MusicRow {
	music_name: string;
	announce_date: string;
}

export interface MusicData {
	music_name: string;
	groups:
		| {
				name: string;
				color: string;
		  }[]
		| null;
	artists: {
		name: string;
		color: string;
	}[];
	albums: {
		name: string;
		color: string;
		release_date: string;
	}[];
	announce_date: string;
}

export interface ArtistRow {
	name: string;
	color: string | null;
}

export interface GroupRow {
	name: string;
	color: string | null;
}

export interface AlbumRow {
	name: string;
	color: string | null;
	release_date: string | null;
}
