import {getScriptTemporaryProject} from '@app/projects';
import {
	InfinityMintProject,
	InfinityMintProjectAsset,
	InfinityMintProjectContent,
	InfinityMintProjectPath,
	InfinityMintScript,
	InfinityMintScriptParameters,
} from '@app/interfaces';
import {logDirect, stage} from '@app/helpers';
import {ParsedPath} from 'path';
import {getImports} from '@app/imports';
import fs from 'fs';
import {InfinityMintSVGSettings} from '@app/content';

const compile: InfinityMintScript = {
	name: 'Compile Project',
	description:
		'Compile an InfinityMint project ready for deployment. The compiled file will garuntee that all the assets used in the minter are uploaded to IPFS and accessible at all times.',
	execute: async (script: InfinityMintScriptParameters) => {
		let project = getScriptTemporaryProject(script, 'compiled'); //gets a temporary project file if there is one for a compilation, if not will just return the source project aka the .ts file or .js file
		if (project.version === undefined)
			project.version = {
				version: '1.0.0',
				tag: 'initial',
			};

		if (project.stages === undefined) project.stages = {};

		script.log(
			`{cyan-fg}{bold}Compiling Project ${project.name}@${project.version.version}{/}`,
		);

		let importCache = await getImports();
		let result = await stage(
			'compile',
			project,
			async () => {
				let verify = await stage(
					'verify',
					project,
					async () => {
						let errors = [];
						let files: string[] = [];
						let hasErrors = false;
						let tempPaths = (project as InfinityMintProject).javascript
							? (project as any)?.paths?.indexes || []
							: project.paths;
						let basePath = (project as InfinityMintProject).javascript
							? (project as any)?.paths?.default || {}
							: (script.project as InfinityMintProject)?.basePath ||
							  ({} as InfinityMintProjectPath);

						let tempAssets: InfinityMintProjectAsset[] = [];

						//unpack the assets array adding the section key
						if (project.assets instanceof Array) {
							tempAssets = project.assets || [];
						} else {
							Object.keys(project.assets || {}).forEach(section => {
								Object.values(project.assets[section]).forEach(
									(asset: InfinityMintProjectAsset) => {
										tempAssets.push({...asset, section: section});
									},
								);
							});
						}

						let baseAsset =
							(script.project as InfinityMintProject)?.baseAsset ||
							({} as InfinityMintProjectAsset);

						let verifyImport = (
							path: InfinityMintProjectPath | InfinityMintProjectAsset,
							i: number,
							type?: 'asset' | 'path' | 'content',
						) => {
							type = type || 'path';
							let fileName = path.fileName.toString().toLowerCase();
							script.debugLog('checking import => ' + fileName);
							script.log('\t{cyan-fg}Verifying ' + fileName + '{/}');
							//now lets check if the path exists in the import database

							if (!importCache.keys[fileName]) {
								errors.push(
									`${type} (${i}) error: File not found => ` + fileName,
								);
								hasErrors = true;
								return;
							}

							let file = importCache.database[importCache.keys[fileName]];

							if (file.checksum === undefined || file.checksum.length === 0) {
								hasErrors = true;
								errors.push(
									`${type} (${i}) content error: Checksum not found => ` +
										fileName,
								);
								return;
							}
							let stats = fs.statSync(file.dir + '/' + file.base);

							if (stats.size === 0) {
								hasErrors = true;
								errors.push(
									`${type} (${i}) content error: File size is zero (means file is empty) => ` +
										fileName,
								);
								return;
							}

							files.push(fileName);

							if (path.content)
								Object.values(path.content).forEach(content => {
									let fileName = (
										typeof content === 'string'
											? content
											: content.fileName.toString()
									).toLowerCase();

									if (!importCache.keys[fileName]) {
										hasErrors = true;
										errors.push(
											`${type} (${i}) content error: File not found => ` +
												fileName,
										);
										return;
									} else
										script.log(
											'\t{cyan-fg}Verified Content: ' + fileName + '{/}',
										);
									files.push(fileName);
								});

							if (
								typeof path.settings === 'string' &&
								!importCache.database[importCache.keys[path.settings]]
							) {
								hasErrors = true;
								errors.push(
									`${type} (${i}) settings reference error: Settings file not found => ` +
										path.settings,
								);
							}

							//now lets check the imports database for settings files
							files.forEach((file: string) => {
								let thatImport =
									importCache.database[importCache.keys[file.toLowerCase()]];

								if (
									thatImport.settings !== undefined &&
									thatImport.settings.length !== 0
								) {
									thatImport.settings.forEach(setting => {
										let settingLocation = setting.dir + '/' + setting.base;
										if (!fs.existsSync(settingLocation)) {
											hasErrors = true;
											errors.push(
												`${type} (${i}) settings error: Settings file not found => ` +
													settingLocation,
											);
										} else
											script.log(
												'\t{cyan-fg}Verified Settings: ' +
													settingLocation +
													'{/}',
											);
									});
								}
							});
						};

						for (let i = 0; i < tempPaths.length; i++) {
							let path = tempPaths[i];

							path = {
								...basePath,
								...path,
							};
							path.content = {
								...(basePath.content || {}),
								...(path.content || {}),
							};
							path.valid = false;
							script.infinityConsole.emit('preVerify', path, typeof path);
							verifyImport(path, i);
							if (hasErrors) {
								script.log(`{red-fg}[Path ${i}] ERROR OCCURED{/}`);
							} else {
								path.valid = true;
								script.log(`{green-fg}[Path ${i}] VERIFIED{/}`);
							}
							script.infinityConsole.emit('postVerify', path, typeof path);
							hasErrors = false;
							tempPaths[i] = path as InfinityMintProjectPath;
						}

						for (let i = 0; i < tempAssets.length; i++) {
							let asset = tempAssets[i];
							asset = {
								...baseAsset,
								...asset,
							};

							asset.content = {
								...(baseAsset.content || {}),
								...(asset.content || {}),
							};
							asset.valid = false;
							script.infinityConsole.emit('preVerify', asset, typeof asset);
							verifyImport(asset, i, 'asset');
							if (hasErrors) {
								script.log(`{red-fg}[Asset ${i}] ERROR OCCURED{/}`);
							} else {
								asset.valid = true;
								script.log(`{green-fg}[Asset ${i}] VERIFIED{/}`);
							}
							script.infinityConsole.emit('postVerify', asset, typeof asset);
							hasErrors = false;
							tempAssets[i] = asset as InfinityMintProjectAsset;
						}

						//if errors are not length of zero then throw them!
						if (errors.length !== 0) throw errors;

						//set it
						project.paths = tempPaths;
						project.assets = tempAssets;
					},
					'compile',
					script.infinityConsole,
					true,
				);

				if (verify !== true) {
					if (verify instanceof Array !== true) throw verify as Error;
					(verify as Error[]).forEach(error => {
						script.infinityConsole.log(`{red-fg}${error}{/red-fg}`);
					});

					throw new Error(
						'failed verification of assets/paths. please check errors above.',
					);
				}

				let setup = await stage(
					'setup',
					project,
					async () => {
						let setupImport = (
							path: InfinityMintProjectPath | InfinityMintProjectAsset,
						) => {
							script.log(`\tSetting Up => ${path.fileName}`);
							let pathImport =
								importCache.database[
									importCache.keys[path.fileName.toString()]
								];
							path.source = pathImport;
							//if its a string then grab that file and add it to pathImports
							if (typeof path.settings === 'string') {
								let settings =
									importCache.database[importCache.keys[path.settings]];
								pathImport.settings = [...pathImport.settings, settings as any];
								path.settings = {};
							}

							//puts the settings for the import into the path
							if (pathImport.settings !== undefined) {
								pathImport.settings.map(setting => {
									if (path.settings === undefined) path.settings = {};
									else if (typeof path.settings === 'object')
										path.settings = {
											'@project': path.settings,
										};
									else path.settings = {};
									script.log(
										`\tFound Settings => ${setting.dir + '/' + setting.base}`,
									);
									if (setting.ext === 'json') {
										path.settings[setting.dir + '/' + setting.base] = {
											...JSON.parse(
												fs.readFileSync(setting.dir + '/' + setting.base, {
													encoding: 'utf-8',
												}),
											),
											source: setting,
										} as InfinityMintSVGSettings;
									} else if (setting.ext === 'js' || setting.ext === 'ts') {
										let result = require(setting.dir + '/' + setting.base);
										result = result.default;

										path.settings[setting.dir + '/' + setting.base] = {
											...(typeof result === 'function' ? result() : result),
											source: setting,
										} as InfinityMintSVGSettings;
									}
								});

								if (path.content) {
									if ((project as InfinityMintProject).javascript) {
										let newContent = {};
										Object.keys(path.content).map(content => {
											let newImport = (newContent[content] = {
												fileName: content,
											} as InfinityMintProjectContent);
											script.infinityConsole.emit(
												'preCompileSetup',
												newImport,
												typeof newImport,
											);
											setupImport(newImport);
											script.infinityConsole.emit(
												'postCompileSetup',
												newImport,
												typeof newImport,
											);
										});
									}
								}

								//create basic exports object to fill in later
								path.export = {
									key: `${project.name}@${path.source.dir}/${path.source.base}`,
									checksum: path.source.checksum,
									project: project.name,
									version: project.version,
									stats: fs.statSync(`${path.source.dir}/${path.source.base}`),
									exported: Date.now(),
								};
							}
						};
						//here we need to loop through paths and see if we find settings
						for (let i = 0; i < project.paths.length; i++) {
							script.infinityConsole.emit(
								'preCompileSetup',
								project.paths[i],
								typeof project.paths[i],
							);
							script.log(`[Path ${i}] {cyan-fg}Setting up...{/cyan-fg}`);
							setupImport(project.paths[i]);
							project.paths[i].pathId = i;
							script.infinityConsole.emit(
								'postCompileSetup',
								project.paths[i],
								typeof project.paths[i],
							);
						}

						//here we need to loop through assets as well
						if (project.assets)
							for (let i = 0; i < project.assets.length; i++) {
								script.infinityConsole.emit(
									'preCompileSetup',
									project.assets[i],
									typeof project.assets[i],
								);
								script.log(`[Assets ${i}] {cyan-fg}Setting up...{/cyan-fg}`);
								setupImport(project.assets[i]);
								project.assets[i].assetId = i;
								script.infinityConsole.emit(
									'postCompileSetup',
									project.paths[i],
									typeof project.paths[i],
								);
							}
					},
					'compile',
					script.infinityConsole,
				);

				if (setup !== true) throw setup;
			},
			'compile',
			script.infinityConsole,
		);

		if (result !== true) throw result;

		script.log('{green-fg}{bold}Compilation Successful{/}');
		script.log(`\tProject: ${project.name}`);
		script.log(
			`\tVersion: ${project.version.version} (${project.version.tag})`,
		);
		script.log(
			'{gray-fg}{bold}You can now go ahead and {cyan-fg}deploy this project!{/}',
		);
	},
	arguments: [
		{
			name: 'project',
			optional: true,
		},
	],
};
export default compile;
