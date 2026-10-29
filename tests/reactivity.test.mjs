import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { compile } from 'svelte/compiler';
import ts from 'typescript';

const paths = {
	page: 'src/routes/(music)/+page.svelte',
	table: 'src/lib/components/table.svelte',
	admin: 'src/routes/(music)/admin/+page.svelte',
	block: 'src/lib/components/block.svelte'
};
const sources = Object.fromEntries(Object.entries(paths).map(([key, path]) => [
	key, readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
]));
const compiled = Object.fromEntries(Object.entries(sources).map(([key, source]) => {
	compile(source, { filename: paths[key], generate: 'server' });
	return [key, compile(source, { filename: paths[key], generate: 'client' }).js.code];
}));

// Legacy Svelte executes template helpers inside untrack(). Dependencies must
// be read by the surrounding generated expression, not only inside the helper.
function dependenciesBefore(code, call) {
	const index = code.indexOf(`$.untrack(() => ${call}`);
	assert.notEqual(index, -1, `Missing compiled call: ${call}`);
	const start = code.lastIndexOf('() => (', index);
	assert.notEqual(start, -1);
	return code.slice(start, index);
}

function helper(source, name) {
	const script = source.match(/<script[^>]*>([\s\S]*?)<\/script>/)[1];
	const ast = ts.createSourceFile('component.ts', script, ts.ScriptTarget.Latest, true);
	const fn = ast.statements.find((node) => ts.isFunctionDeclaration(node) && node.name?.text === name);
	assert.ok(fn, `Missing helper: ${name}`);
	const { outputText } = ts.transpileModule(fn.getText(ast), {
		compilerOptions: { target: ts.ScriptTarget.ES2022 }
	});
	return new Function(`${outputText}; return ${name};`)();
}

test('drawer group label tracks both the selected song and refreshed data', () => {
	const dependencies = dependenciesBefore(compiled.page, 'getSoloArtist(');
	assert.ok(dependencies.includes('$selectedBlock()'));
	assert.ok(dependencies.includes('$.deep_read_state(data())'));
	const label = helper(sources.page, 'getSoloArtist');
	const group = (id, name) => ({ groups: [{ id, name }], artists: [{ name: 'Solo Artist' }] });
	assert.deepEqual([group(1, 'A'), group(2, 'B'), group(8, 'Solo'), group(1, 'Translated A')].map(label),
		['A', 'B', 'Solo Artist', 'Translated A']);
});

test('grouped song lists track music updates even when the category name stays the same', () => {
	const dependencies = dependenciesBefore(compiled.table, 'getMusics(');
	assert.ok(dependencies.includes('$.get(musics)'));
	assert.ok(dependencies.includes('$.deep_read_state(type())'));
	const songs = helper(sources.table, 'getMusics');
	for (const [type, field] of [['group', 'groups'], ['artist', 'artists'], ['album', 'albums']]) {
		const first = { id: 1, [field]: [{ name: 'Same name' }] };
		const second = { id: 2, [field]: [{ name: 'Same name' }] };
		assert.deepEqual(songs('Same name', [first], type), [first]);
		assert.deepEqual(songs('Same name', [second], type), [second]);
		assert.deepEqual(songs('Same name', [], type), []);
	}
});

test('category thumbnails track image collections and category type', () => {
	const dependencies = dependenciesBefore(compiled.table, 'load_image(');
	assert.ok(dependencies.includes('$.get(imageStore)'));
	assert.ok(dependencies.includes('$.deep_read_state(type())'));
	const image = helper(sources.table, 'load_image');
	const images = {
		'/src/images/group/1.webp': { default: 'group.webp' },
		'/src/images/artist/1.webp': { default: 'artist.webp' },
		'/src/images/group/0.webp': { default: 'fallback.webp' }
	};
	assert.equal(image(1, 'group', images), 'group.webp');
	assert.equal(image(1, 'artist', images), 'artist.webp');
	assert.equal(image(999, 'group', images), 'fallback.webp');
	assert.equal(image(1, 'group', { ...images, '/src/images/group/1.webp': { default: 'updated.webp' } }), 'updated.webp');
});

test('drawer images track the appropriate image store, not just song or album IDs', () => {
	for (const type of ['music', 'artist', 'album']) {
		assert.ok(dependenciesBefore(compiled.page, `loadImage('${type}'`).includes(`$${type}_images()`));
	}
	const image = helper(sources.page, 'loadImage');
	for (const type of ['music', 'artist', 'album']) {
		const images = { [`/src/images/${type}/0.webp`]: { default: 'fallback.webp' } };
		assert.equal(image(type, 1, images), 'fallback.webp');
		assert.equal(image(type, 1, { ...images, [`/src/images/${type}/1.webp`]: { default: 'new.webp' } }), 'new.webp');
	}
});

test('admin value readers are regenerated when the same selected record is refreshed', () => {
	for (const [reader, record] of [['value', 'selected'], ['albumValue', 'selectedAlbum']]) {
		assert.ok(compiled.admin.includes(`$.legacy_pre_effect(() => ($.get(${record})), () => {`));
		assert.ok(compiled.admin.includes(`$.set(${reader}, (key) => String($.get(${record})?.[key] ?? ''))`));
		assert.ok(compiled.admin.includes(`$.get(${reader})(`));
	}
});

test('song thumbnail reactive assignment still tracks both ID and image map', () => {
	const assignment = compiled.block.indexOf('$.set(imageSrc,');
	assert.notEqual(assignment, -1);
	const dependencies = compiled.block.slice(compiled.block.lastIndexOf('$.legacy_pre_effect(', assignment), assignment);
	assert.ok(dependencies.includes('$music_images()'));
	assert.ok(dependencies.includes('$.deep_read_state(id())'));
});
