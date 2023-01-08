import { InfinityMintSVGSettings } from "./content";
import { PathLike } from "fs";
import { debugLog, findFiles, getConfigFile, log, warning } from "./helpers";
import { Dictionary } from "form-data";
import path from "path";
import fs from "fs";

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

type ipfsType = { cid: string; fileName?: string; gateway: string };
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
	database: Dictionary<
		Dictionary<{
			extension: string;
			name: string;
			base: string;
			root: string;
			dir: string;
			settings: Array<path.ParsedPath>;
		}>
	>;
	keys: Dictionary<string>;
}

export const hasImportCache = () => {
	return fs.existsSync(process.cwd() + "/temp/import_cache.json");
};

export const importCount = (imports?: ImportCache) => {
	imports = imports || readImportCache();
	let count = 0;
	Object.values(imports.database).forEach((dirs) => {
		count += Object.values(dirs).length;
	});
	return count;
};

/**
 *
 * @param fileNameOrPath
 * @returns
 */
export const getImport = async (fileNameOrPath: string) => {
	let imports = await getImports();
	if (!imports.keys[fileNameOrPath])
		throw new Error("import not found: " + imports.keys[fileNameOrPath]);

	if (!imports.database[imports.keys[fileNameOrPath]]) throw new Error("bad");

	return imports.database[imports.keys[fileNameOrPath]];
};

export const saveImportCache = (cache: ImportCache) => {
	log(`saving <${importCount(cache)}> imports to cache file`, "imports");
	log("saving imports to /temp/import_cache.json", "fs");
	fs.writeFileSync(
		process.cwd() + "/temp/import_cache.json",
		JSON.stringify(cache, null, 2)
	);
};

export const readImportCache = (): ImportCache => {
	if (!fs.existsSync(process.cwd() + "/temp/import_cache.json"))
		return {} as ImportCache;

	return JSON.parse(
		fs.readFileSync(process.cwd() + "/temp/import_cache.json", {
			encoding: "utf-8",
		})
	) as ImportCache;
};

let importCache: ImportCache;
export const getImports = async (useFresh?: boolean) => {
	if (
		useFresh ||
		(!importCache &&
			!fs.existsSync(process.cwd() + "/temp/import_cache.json"))
	) {
		importCache = await getImportCache();
		saveImportCache(importCache);
	} else importCache = readImportCache();
	return importCache;
};

export const getImportCache = async (
	supportedExtensions?: string[]
): Promise<ImportCache> => {
	supportedExtensions = supportedExtensions || [];

	let config = getConfigFile();
	supportedExtensions = [
		...(supportedExtensions as string[]),
		...(config.settings?.compile?.supportedExtensions || []),
		...[
			".png",
			".svg",
			".jpg",
			".jpeg",
			".gif",
			".mp3",
			".obj",
			".wav",
			".css",
		],
	];

	log(
		"found " + supportedExtensions.length + " supported extensions",
		"imports"
	);

	let finalLocations = [];

	[
		...(config.imports || []).map(
			(root: string) =>
				process.cwd() +
				"/" +
				(root.indexOf("imports") === -1
					? root +
					  (root[root.length - 1] !== "/" ? "/imports/" : "imports/")
					: root)
		),
		process.cwd() + "/imports/",
		...(config.roots || []).map(
			(root: string) =>
				process.cwd() +
				"/" +
				(root.indexOf("imports") === -1
					? root +
					  (root[root.length - 1] !== "/" ? "/imports/" : "imports/")
					: root)
		),
	]
		.map((location) => {
			return location + "**/*";
		})
		.map((location) => {
			//removes broken double directory slash
			return location.replace(/\/\//g, "");
		})
		.forEach((location) => {
			supportedExtensions.forEach((ext) => {
				if (ext[0] === ".") ext = ext.substring(1);
				finalLocations.push(location + "." + ext);
				finalLocations.push(location + "." + ext + ".settings.*");
			});
		});

	let results = [];
	for (let i = 0; i < finalLocations.length; i++) {
		let files = await findFiles(finalLocations[i]);
		files.forEach((result) => results.push(result));
	}

	let parsedFiles = results.map((filePath) => path.parse(filePath));
	let infinityImports = parsedFiles.filter(
		(file) => file.base.indexOf(".settings.") === -1
	);
	let importSettings = parsedFiles.filter(
		(file) => file.base.indexOf(".settings.") !== -1
	);

	let imports: ImportCache = {
		database: {},
		keys: {},
	};
	for (let i = 0; i < infinityImports.length; i++) {
		let normalImport = infinityImports[i];
		if (!imports.database[normalImport.dir]) {
			log(`[${i}] found dir => ${normalImport.dir}`, "imports");
			imports.database[normalImport.dir] = {};
		}

		let importLessDir = normalImport.dir.substring(
			0,
			normalImport.dir.length - "/imports".length
		);

		imports.keys[normalImport.dir + "/" + normalImport.base] =
			normalImport.dir;
		imports.keys[normalImport.dir + "/" + normalImport.name] =
			normalImport.dir;
		imports.keys[process.cwd() + "/imports/" + normalImport.name] =
			normalImport.dir;
		imports.keys[process.cwd() + "/imports/" + normalImport.base] =
			normalImport.dir;
		imports.keys["imports/" + normalImport.name] = normalImport.dir;
		imports.keys["/imports/" + normalImport.name] = normalImport.dir;
		imports.keys["imports/" + normalImport.base] = normalImport.dir;
		imports.keys["/imports/" + normalImport.base] = normalImport.dir;
		if (
			!imports.database[normalImport.dir][
				normalImport.name + normalImport.ext
			]
		)
			imports.database[normalImport.dir][
				normalImport.name + normalImport.ext
			] = {
				extension: normalImport.ext,
				name: normalImport.name,
				dir: normalImport.dir,
				root: importLessDir,
				base: normalImport.base,
				settings: importSettings.filter(
					(thatSetting) =>
						thatSetting.base.indexOf(
							normalImport.name + normalImport.ext + ".settings."
						) !== -1
				),
			};
		else
			throw new Error(
				"conflicting name: " +
					normalImport.dir +
					normalImport.name +
					normalImport.ext
			);
	}

	return imports as ImportCache;
};
