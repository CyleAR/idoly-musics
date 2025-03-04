export interface ArtistData {
	id: number;
	name_ko: string;
	name_ja: string;
	name_en: string;
	name_zh: string;
    color: string;
}
export interface GroupData {
	id: number;
	name_ko: string;
	name_ja: string;
	name_en: string;
	name_zh: string;
    color: string;
}
export interface AlbumData {
	id: number;
	name_ko: string;
	name_ja: string;
	name_en: string;
	name_zh: string;
    release_date: string;
    color: string;
}

export interface MusicData {
	id: number;
	music_name: string;
	groups: GroupRow[];
	artists: ArtistRow[];
	albums: AlbumRow[];
    length: number;
	announce_date: string;
	lyrics: string;
    furigana_ko: string;
	stream_url: string;
	mv_url: string;
    live_url: string;
}

export interface MusicRow {
	id: number;
	music_name: string;
	announce_date: string;
	lyrics: string;
	stream_url: string;
	mv_url: string;
    live_url: string;
    length: number;
}

export interface ArtistRow {
	id: number;
	name: string;
	color: string | null;
}

export interface GroupRow {
	id: number;
	name: string;
	color: string | null;
}

export interface AlbumRow {
	id: number;
	name: string;
	color: string | null;
	release_date: string | null;
}
