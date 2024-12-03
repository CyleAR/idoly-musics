export interface ArtistData {
	id: number;
	name_ko: string;
	name_ja: string;
	name_en: string;
	name_zh: string;
}

export interface MusicRow {
    music_id: number;
	music_name: string;
	announce_date: string;
    lyrics: string;
}

export interface MusicData {
    id: number;
	music_name: string;
	groups:
		| {
                id: number;
				name: string;
				color: string;
		  }[]
		| null;
	artists: {
		id: number;
		name: string;
		color: string;
	}[];
	albums: {
        id: number;
		name: string;
		color: string;
		release_date: string;
	}[];
	announce_date: string;
    lyrics: string;
}

export interface ArtistRow {
	artist_id: number;
	name: string;
	color: string | null;
}

export interface GroupRow {
    group_id: number;
	name: string;
	color: string | null;
}

export interface AlbumRow {
    album_id: number;
	name: string;
	color: string | null;
	release_date: string | null;
}
