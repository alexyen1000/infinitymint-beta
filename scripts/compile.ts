import {
	getProjectFullName,
	getProjectName,
	getProjectSource,
	getScriptTemporaryProject,
} from '../app/projects';
import {
	InfinityMintProject,
	InfinityMintProjectAsset,
	InfinityMintProjectContent,
	InfinityMintProjectPath,
	InfinityMintScript,
	InfinityMintScriptParameters,
} from '../app/interfaces';
import {delay, stage, prepare, action, always, logDirect} from '../app/helpers';
import {createHash} from 'node:crypto';
import {getImports} from '../app/imports';
import fs from 'fs';
import {InfinityMintSVGSettings} from '../app/content';
import {InfinityMintCompiledProject} from '../app/interfaces';
import {getInfinityMintVersion} from 'infinitymint/dist/app/helpers';
import {getImportCache} from 'infinitymint/dist/app/imports';

const compile: InfinityMintScript = {
	name: 'Compile Project',
	description:
		'Compile an InfinityMint project ready for deployment. The compiled file will garuntee that all the assets used in the minter are uploaded to IPFS and accessible at all times.',
	execute: async (script: InfinityMintScriptParameters) => {
		let project = getScriptTemporaryProject(script, 'compiled'); //gets a temporary project file if there is one for a compilation, if not will just return the source project aka the .ts file or .js file
		if (!project.version)
			project.version = {
				version: '1.0.0',
				tag: 'initial',
			};

		//sets the project and script to be the one used by the action method. Must be called before any action is called or any always is called
		prepare(project, script, 'compile');

		script.log(
			`{cyan-fg}{bold}Compiling Project ${project.name}@${
				project.version.version
			} with InfinityMint@${getInfinityMintVersion()}{/}`,
		);

		let importCache = await getImports();
		let result = await action('compile', async () => {
			//sets where this project is stored locally
			project.source = getProjectSource(project);

			let verify = await always('verify', async () => {
				let errors: string[] = [];
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
						Object.values(
							project.assets
								? (project.assets[section] as InfinityMintProjectAsset[])
								: {},
						).forEach((asset: InfinityMintProjectAsset) => {
							tempAssets.push({...asset, section: section});
						});
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
						errors.push(`${type} (${i}) error: File not found => ` + fileName);
						hasErrors = true;
						return;
					}

					let file = importCache.database[importCache.keys[fileName]];

					if (!file.checksum || file.checksum.length === 0) {
						hasErrors = true;
						errors.push(
							`${type} (${i}) content error: Checksum not found => ` + fileName,
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

					if (path.content) {
						script.log('\t{cyan-fg}Verifying content...{/}');
						Object.keys(path.content).forEach(contentKey => {
							let content = path.content[contentKey];

							if (
								content !== null &&
								typeof content === 'object' &&
								!content?.fileName
							) {
								script.log(
									'\t{yellow-fg}no filename assuming none import => {/}' +
										contentKey,
								);
								content.fileName = 'none';
							} else if (typeof content === 'string') {
								content = {
									fileName: content,
									name: contentKey,
								};
							} else {
								script.log(
									'\t{yellow-fg}weird type assuming none => {/}' + contentKey,
								);
								content = {
									fileName: 'none',
									name: 'none',
								};
							}

							fileName = content.fileName.toString().toLowerCase();

							script.log('\t{cyan-fg}Checking Content: ' + fileName + '{/}');

							if (
								fileName === 'undefined' ||
								fileName === 'null' ||
								fileName === 'NaN' ||
								fileName === 'none' ||
								fileName.length === 0
							) {
								script.log(
									'\t{red-fg}Unable to verify content => ' + fileName + '{/}',
								);
							} else {
								if (!importCache.keys[fileName]) {
									hasErrors = true;
									errors.push(
										`${type} (${i}) content error: File not found => ` +
											fileName,
									);
									return;
								}
								files.push(fileName);
							}

							script.log('\t\t{green-fg}Success{/}');
						});
					}

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

						if (thatImport.settings && thatImport.settings.length !== 0) {
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
										'\t{cyan-fg}Verified Settings: ' + settingLocation + '{/}',
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
					script.log(`{yellow-fg}[Path ${i}] Verifying...{/yellow-fg}`);
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
					script.log(`{yellow-fg}[Asset ${i}] Verifying...{/yellow-fg}`);
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
			});

			if (verify !== true) {
				if (verify instanceof Array !== true) throw verify as Error;
				(verify as Error[]).forEach(error => {
					script.infinityConsole.log(`{red-fg}${error}{/red-fg}`);
				});

				throw new Error(
					'failed verification of assets/paths. please check errors above.',
				);
			}

			let setup = await always('setup', async () => {
				let imports = project.imports || {};
				let setupImport = (
					path: InfinityMintProjectPath | InfinityMintProjectAsset,
				) => {
					script.log(`\t{cyan-fg}Setting Up{/} => ${path.fileName}`);
					let fileName = path.fileName.toString().toLowerCase(); //because of issue with uppercase/lowercase filenames we lowercase it first
					let pathImport = importCache.database[importCache.keys[fileName]] || {
						extension: 'none',
						name: 'none',
						dir: 'none',
						checksum: 'none',
						base: 'none',
						settings: [],
					};
					path.source = pathImport;

					//if its a string then grab that file and add it to pathImports
					if (typeof path.settings === 'string') {
						let settings =
							importCache.database[importCache.keys[path.settings]];
						pathImport.settings = [...pathImport.settings, settings as any];
						path.settings = {};
					}

					//puts the settings for the import into the path
					if (pathImport?.settings) {
						pathImport.settings.map(setting => {
							if (!path.settings) path.settings = {};
							else if (typeof path.settings === 'object')
								path.settings = {
									'@project': path.settings,
								};
							else path.settings = {};
							script.log(
								`\t{cyan-fg}Found Settings{/} => ${
									setting.dir + '/' + setting.base
								} (${setting.ext})`,
							);
							if (setting.ext === '.json') {
								path.settings[setting.dir + '/' + setting.base] = {
									...JSON.parse(
										fs.readFileSync(setting.dir + '/' + setting.base, {
											encoding: 'utf-8',
										}),
									),
									source: setting,
								} as InfinityMintSVGSettings;
							} else if (setting.ext === '.js' || setting.ext === '.ts') {
								let result = require(setting.dir + '/' + setting.base);
								result = result.default;

								path.settings[setting.dir + '/' + setting.base] = {
									...(typeof result === 'function' ? result() : result),
									source: setting,
								} as InfinityMintSVGSettings;
							} else {
								throw new Error(
									'unknown settings file extension: ' +
										setting.dir +
										'/' +
										setting.base,
								);
							}

							imports[setting.dir + '/' + setting.base] =
								setting.dir + '/' + setting.base;
						});

						Object.values(path.settings || {}).forEach(
							(svgSetting: InfinityMintSVGSettings) => {
								if (!svgSetting?.style?.css) return;
								let path: string = svgSetting!.style!.css as string;
								path = path[0] === '/' ? '' : '/' + path;
								if (svgSetting!.style!.css instanceof Array)
									svgSetting!.style!.css.forEach(style => {
										style = (style[0] === '/' ? '' : '/') + style;
										if (!importCache.keys[style])
											throw new Error(
												`${
													svgSetting!.source!.dir +
													'/' +
													svgSetting!.source!.base
												} bad css reference: ${style}`,
											);
										else {
											script.log(
												`\t{cyan-fg}Included CSS reference{/} => ${style}`,
											);
											imports[style] = style;
											imports[project.name + '@' + style] = style;
											imports[getProjectFullName(project) + style] = style;
										}
									});
								else if (!importCache.keys[path])
									throw new Error(
										`${
											svgSetting!.source!.dir + '/' + svgSetting!.source!.base
										} has a bad css reference: ${path}`,
									);
								else {
									script.log(`\t{cyan-fg}Included CSS reference{/} => ${path}`);
									imports[path] = path;
									imports[project.name + '@' + path] = path;
									imports[getProjectFullName(project) + path] = path;
								}
							},
						);

						if (path.content) {
							script.log('\t{cyan-fg}Setting Up Path Content...{/}');
							Object.keys(path.content).map(content => {
								let newImport = {
									fileName:
										path.content[content].fileName || path.content[content],
									name: content,
									...(typeof path.content[content] === 'object'
										? path.content[content]
										: {}),
								} as InfinityMintProjectContent;

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
								path.content![content] = newImport;
							});
						}

						script.log('\t\t{green-fg}Success{/}');
					}

					//create basic exports object to fill in later
					path.export = {
						key: `${project.name}@${fileName}`,
						checksum: path?.source?.checksum,
						project: project.name,
						version: project.version || {
							version: '1.0.0',
							tag: 'initial',
						},
						stats:
							path?.source && path.source.base !== 'none'
								? fs.statSync(`${path.source.dir}/${path.source.base}`)
								: ({} as any),
						exported: Date.now(),
					};

					if (path.export.key)
						imports[path.export.key] = path.source.dir + '/' + path.source.base;

					if (path.source)
						imports[path.source.dir + '/' + path.source.base] =
							path.source.dir + '/' + path.source.base;

					imports[project.name + '@' + fileName] =
						path.source.dir + '/' + path.source.base;
					imports[fileName] = path.source.dir + '/' + path.source.base;
					imports[
						getProjectFullName(project) +
							((fileName[0] === '/' ? '' : '/') + fileName)
					] = path.source.dir + '/' + path.source.base;

					path.checksum = createHash('md5')
						.update(JSON.stringify(JSON.stringify(path)))
						.digest('hex');
					script.log(
						`\t{cyan-fg}Object checksum{/cyan-fg} => ${path.checksum}`,
					);
				};

				//here we need to loop through paths and see if we find settings
				for (let i = 0; i < project.paths.length; i++) {
					script.infinityConsole.emit(
						'preCompileSetup',
						project.paths[i],
						typeof project.paths[i],
					);
					script.log(`[Path ${i}] {yellow-fg}Setting up...{/}`);
					setupImport(project.paths[i]);
					script.log(`{green-fg}[Path ${i}] VERIFIED{/}`);
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
						script.log(`[Asset ${i}] {yellow-fg}Setting up...{/}`);
						setupImport(project.assets[i]);
						script.log(`{green-fg}[Asset ${i}] VERIFIED{/}`);
						project.assets[i].assetId = i + 1; //asset ids start counting from 1 as asset id 0 is null asset
						script.infinityConsole.emit(
							'postCompileSetup',
							project.paths[i],
							typeof project.paths[i],
						);
					}

				project.imports = imports;
			});

			if (setup !== true) throw setup;

			let buildImports = await action('buildImports', async () => {
				let imports = (project as InfinityMintCompiledProject).imports || {};
				let keys = Object.keys(imports);
				let importCache = await getImports();

				if (keys.length === 0)
					throw new Error('project has no imports this is weird!');
				//this is where we need to go over every file reference in the project and include all of them

				let files = {};
				Object.keys(imports).forEach(key => {
					if (!files[imports[key]]) files[imports[key]] = imports[key];
				});

				script.log(
					`{yellow-fg}Packing${Object.keys(files).length} imports...{/}`,
				);

				project.bundles = {
					version: getInfinityMintVersion(),
					imports: {},
				};

				let rawBundle = {};
				let totalSize = 0;
				//pack all the files
				await Promise.all(
					Object.keys(files).map(async (file: string) => {
						script.log(`\t{cyan-fg}Packing ${file}{/}`);
						let location = importCache.keys[file];
						let path = importCache.database[location];
						if (path === undefined || path.dir === undefined) return;

						project.bundles.imports[file] = path;
						rawBundle[location] = await fs.promises.readFile(
							path.dir + '/' + path.base,
						);
						let size = fs.statSync(path.dir + '/' + path.base).size / 1024;
						totalSize += size;
						project.bundles.imports[file].raw = location;
						script.log(
							`\t\t{green-fg}Packed ${path.base} => ${
								size.toFixed(2) + 'kb'
							}{/}`,
						);
					}),
				);

				script.log(`{cyan-fg}Saving Raw Bundle...{/}`);

				if (!fs.existsSync(process.cwd() + '/projects/bundles/'))
					fs.mkdirSync(process.cwd() + '/projects/bundles/');

				await fs.promises.writeFile(
					`${process.cwd()}/projects/bundles/${getProjectFullName(
						project,
					)}.raw.bundle`,
					JSON.stringify(rawBundle),
					{
						encoding: 'utf8',
					},
				);

				script.log(
					`{cyan-fg}Succesfully wrote bundle total size => ${totalSize.toFixed(
						2,
					)}kb {/}`,
				);
			});

			if (buildImports !== true) throw buildImports;
		});

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
