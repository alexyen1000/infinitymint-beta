import { InfinityMintSVGSettings } from "./content";
import { PathLike } from "fs";
import { debugLog, findFiles, getConfigFile } from "./helpers";
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
		project?: string;
		public?: Array<string>;
		settings?: {
			ipfs?: Array<ipfsType>;
			project?: string;
			public?: Array<string>;
		};
	};
	compiled?: number;
	project?: string;
	network?: {
		name?: string;
		chainId?: number;
	};
}

export type ImportType = Dictionary<
	Dictionary<{
		extension: string;
		name: string;
		base: string;
		dir: string;
		settings: Array<path.ParsedPath>;
	}>
>;

export const hasImportCache = () => {
	return fs.existsSync(process.cwd() + "/temp/import_cache.json");
};

export const importCount = (imports?: ImportType) => {
	imports = imports || readImportCache();
	let count = 0;
	Object.values(imports).forEach((dirs) => {
		count += Object.values(dirs).length;
	});
	return count;
};

export const readImportCache = (): ImportType => {
	if (!fs.existsSync(process.cwd() + "/temp/import_cache.json"))
		return {} as ImportType;

	return JSON.parse(
		fs.readFileSync(process.cwd() + "/temp/import_cache.json", {
			encoding: "utf-8",
		})
	) as ImportType;
};

export const getImportCache = async (
	supportedExtensions?: string[]
): Promise<ImportType> => {
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

	let finalLocations = [];

	[...(config.imports || []), process.cwd() + "/imports/"]
		.map((location) => {
			return location + "**/*";
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

	let imports: ImportType = {};
	for (let i = 0; i < infinityImports.length; i++) {
		let normalImport = infinityImports[i];
		if (imports[normalImport.dir] === undefined)
			imports[normalImport.dir] = {};
		if (
			imports[normalImport.dir][normalImport.name + normalImport.ext] ===
			undefined
		)
			imports[normalImport.dir][normalImport.name + normalImport.ext] = {
				extension: normalImport.ext,
				name: normalImport.name,
				dir: normalImport.dir,
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

		debugLog(
			`[${i}] => found import: ` +
				normalImport.dir +
				"/" +
				normalImport.name +
				normalImport.ext
		);
	}

	return imports as ImportType;
};
