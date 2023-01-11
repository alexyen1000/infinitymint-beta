import {InfinityMintSVGSettings} from './content';
import {PathLike} from 'fs';
import {debugLog, findFiles, getConfigFile, log, warning} from './helpers';
import {Dictionary} from 'form-data';
import path from 'path';
import fs, {promises} from 'fs';
import {createHash} from 'node:crypto';

export interface ImportInterface {
	name?: string;
	path?: PathLike;
	extension?: string;
	settings?: InfinityMintSVGSettings;
	settingsFilepath?: PathLike;
	settingsChecksum?: string;
	checksum?: string;
	id?: string;
}

type ipfsType = {cid: string; fileName?: string; gateway: string};
export interface CompiledImportInterface extends ImportInterface {
	paths: {
		ipfs?: Array<ipfsType>;
		public?: string;
		web2?: string;
		settings?: {
			ipfs?: Array<ipfsType>;
			public: string;
			web2?: string;
		};
	};
	compiled?: number;
	project?: string;
	network?: {
		name?: string;
		chainId?: number;
	};
}

export interface ImportCache {
	updated: number;
	database: Dictionary<{
		extension: string;
		name: string;
		base: string;
		checksum: string;
		dir: string;
		settings: Array<path.ParsedPath>;
	}>;
	keys: Dictionary<string>;
}

export const hasImportCache = () => {
	return fs.existsSync(process.cwd() + '/temp/import_cache.json');
};

/**
 * counts the amount of assets we've found
 * @param imports
 * @returns
 */
export const importCount = (imports?: ImportCache) => {
	imports = imports || importCache || readImportCache();
	return Object.values(imports.database).length;
};

/**
 * Searches the import cache for that particular import, can search by full path or just the name of the asset.
 * @param fileNameOrPath
 * @returns
 */
export const hasImport = async (fileNameOrPath: string) => {
	let imports = await getImports();
	if (
		!imports.keys[fileNameOrPath] ||
		!imports.database[imports.keys[fileNameOrPath]]
	)
		return false;

	return true;
};

/**
 *
 * @param fileNameOrPath
 * @returns
 */
export const getImport = async (fileNameOrPath: string) => {
	let imports = await getImports();

	if (!hasImport(fileNameOrPath))
		throw new Error('import not found: ' + fileNameOrPath);

	return imports.database[imports.keys[fileNameOrPath]];
};

export const saveImportCache = (cache: ImportCache) => {
	log(`saving <${importCount(cache)}> imports to cache file`, 'imports');
	log('saving imports to /temp/import_cache.json', 'fs');
	fs.writeFileSync(
		process.cwd() + '/temp/import_cache.json',
		JSON.stringify(cache, null, 2),
	);
};

export const readImportCache = (): ImportCache => {
	if (!fs.existsSync(process.cwd() + '/temp/import_cache.json'))
		return {keys: {}, database: {}, updated: Date.now()} as ImportCache;

	return JSON.parse(
		fs.readFileSync(process.cwd() + '/temp/import_cache.json', {
			encoding: 'utf-8',
		}),
	) as ImportCache;
};

let importCache: ImportCache;
export const getImports = async (useFresh?: boolean) => {
	if (
		useFresh ||
		(!importCache && !fs.existsSync(process.cwd() + '/temp/import_cache.json'))
	) {
		importCache = await getImportCache();
		saveImportCache(importCache);
	} else importCache = readImportCache();
	return importCache;
};

export const getImportCache = async (
	supportedExtensions?: string[],
): Promise<ImportCache> => {
	supportedExtensions = supportedExtensions || [];

	let config = getConfigFile();
	supportedExtensions = [
		...(supportedExtensions as string[]),
		...(config.settings?.compile?.supportedExtensions || []),
		...[
			'.png',
			'.svg',
			'.jpg',
			'.jpeg',
			'.gif',
			'.glb',
			'.mp3',
			'.obj',
			'.wav',
			'.css',
		],
	];

	log(
		'found ' + supportedExtensions.length + ' supported extensions',
		'imports',
	);

	let finalLocations = [];

	[
		...(config.imports || []).map(
			(root: string) =>
				process.cwd() +
				'/' +
				(root.indexOf('imports') === -1
					? root + (root[root.length - 1] !== '/' ? '/imports/' : 'imports/')
					: root),
		),
		process.cwd() + '/imports/',
		...(config.roots || []).map(
			(root: string) =>
				process.cwd() +
				'/' +
				(root.indexOf('imports') === -1
					? root + (root[root.length - 1] !== '/' ? '/imports/' : 'imports/')
					: root),
		),
	]
		.map(location => {
			return location + '**/*';
		})
		.map(location => {
			//removes broken double directory slash
			return location.replace(/\/\//g, '');
		})
		.forEach(location => {
			supportedExtensions.forEach(ext => {
				if (ext[0] === '.') ext = ext.substring(1);
				finalLocations.push(location + '.' + ext);
				finalLocations.push(location + '.' + ext + '.settings.*');
			});
		});

	let results = [];
	for (let i = 0; i < finalLocations.length; i++) {
		let files = await findFiles(finalLocations[i]);
		files.forEach(result => results.push(result));
	}

	let parsedFiles = results.map(filePath => path.parse(filePath));
	let infinityImports = parsedFiles.filter(
		file => file.base.indexOf('.settings.') === -1,
	);
	let importSettings = parsedFiles.filter(
		file => file.base.indexOf('.settings.') !== -1,
	);

	let imports: ImportCache = {
		updated: Date.now(),
		database: {},
		keys: {},
	};
	for (let i = 0; i < infinityImports.length; i++) {
		let normalImport = infinityImports[i];
		let name = normalImport.dir + '/' + normalImport.base;

		if (imports.database[name]) throw new Error('conflict: ' + name);

		let root: string | string[] = normalImport.dir.split('imports');
		if (root.length > 2) root.slice(1).join('imports');
		else root = root[1];

		log(
			`[${i}] found file => ${normalImport.dir + '/' + normalImport.base}`,
			'imports',
		);
		log(`\t -> perfoming checksum`, 'imports');

		let checksum = createHash('md5')
			.update(
				await promises.readFile(normalImport.dir + '/' + normalImport.base, {
					encoding: 'utf-8',
				}),
			)
			.digest('hex');
		log(`\t -> checksum calculated: ${checksum}`, 'imports');
		imports.database[name] = {
			extension: normalImport.ext,
			name: normalImport.name,
			dir: normalImport.dir,
			base: normalImport.base,
			checksum: checksum,
			settings: importSettings.filter(
				thatSetting =>
					thatSetting.base.indexOf(
						normalImport.name + normalImport.ext + '.settings.',
					) !== -1,
			),
		};

		imports.keys[normalImport.dir + '/' + normalImport.base] = name;
		imports.keys[normalImport.dir + '/' + normalImport.name] = name;
		imports.keys[process.cwd() + '/imports' + root + '/' + normalImport.name] =
			name;
		imports.keys[process.cwd() + '/imports' + root + '/' + normalImport.base] =
			name;
		imports.keys['imports/' + normalImport.name] = name;
		imports.keys['/imports/' + normalImport.name] = name;
		imports.keys['imports/' + normalImport.base] = name;
		imports.keys['/imports/' + normalImport.base] = name;
		imports.keys['imports' + root + '/' + normalImport.name] = name;
		imports.keys['/imports' + root + '/' + normalImport.name] = name;
		imports.keys['imports' + root + '/' + normalImport.base] = name;
		imports.keys['/imports' + root + '/' + normalImport.base] = name;
		imports.keys[root + '/' + normalImport.name] = name;
		imports.keys[root + '/' + normalImport.name] = name;
		imports.keys[root + '/' + normalImport.base] = name;
		imports.keys[root + '/' + normalImport.base] = name;

		let nss = root[0] === '/' ? (root as string).substring(1) : root;
		imports.keys[nss + '/' + normalImport.name] = name;
		imports.keys[nss + '/' + normalImport.name] = name;
		imports.keys[nss + '/' + normalImport.base] = name;
		imports.keys[nss + '/' + normalImport.base] = name;
	}

	return imports as ImportCache;
};
