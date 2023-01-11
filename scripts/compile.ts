import {getScriptTemporaryProject} from '@app/projects';
import {
	InfinityMintProject,
	InfinityMintProjectAsset,
	InfinityMintProjectPath,
	InfinityMintScript,
	InfinityMintScriptParameters,
} from '@app/interfaces';
import {stage} from '@app/helpers';
import {getImports} from '@app/imports';
import fs from 'fs';

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
				let paths = [];
				let verify = await stage(
					'verify',
					project,
					async () => {
						let errors = [];
						let files = [];
						let hasErrors = false;
						let tempPaths = project.paths;
						let tempAssets = project.assets || [];
						let basePath =
							(script.project as InfinityMintProject)?.basePath ||
							({} as InfinityMintProjectPath);
						let baseAsset =
							(script.project as InfinityMintProject)?.baseAsset ||
							({} as InfinityMintProjectAsset);

						let verifyImport = (
							path: InfinityMintProjectPath | InfinityMintProjectAsset,
							i: number,
						) => {
							script.infinityConsole.debugLog(
								'checking import => ' + path.fileName,
							);
							//now lets check if the path exists in the import database
							if (!importCache.keys[path.fileName.toString()]) {
								errors.push(
									`Path/Asset (${i}) error: File not found => ` + path.fileName,
								);
								hasErrors = true;
								return;
							}

							let file =
								importCache.database[
									importCache.keys[path.fileName.toString()]
								];

							if (file.checksum === undefined || file.checksum.length === 0) {
								errors.push(
									`Path/Asset (${i}) content error: Checksum not found => ` +
										path.fileName,
								);
								return;
							}
							let stats = fs.statSync(file.dir + '/' + file.base);

							if (stats.size === 0) {
								errors.push(
									`Path/Asset (${i}) content error: File size is zero (means file is empty) => ` +
										path.fileName,
								);
								return;
							}

							files.push(path.fileName);

							if (path.content)
								Object.values(path.content).forEach(content => {
									if (!importCache.keys[content.fileName.toString()]) {
										hasErrors = true;
										errors.push(
											`Path/Asset (${i}) content error: File not found => ` +
												content.fileName,
										);
										return;
									}
									files.push(content.fileName.toString());
								});

							//now lets check the imports database
							files.forEach(file => {
								let _import = importCache.database[importCache.keys[file]];
								if (
									_import.settings !== undefined &&
									_import.settings.length !== 0
								) {
									_import.settings.forEach(setting => {
										let settingLocation = setting.dir + '/' + setting.base;
										if (!fs.existsSync(settingLocation)) {
											hasErrors = true;
											errors.push(
												`Path/Asset (${i}) settings error: Settings file not found => ` +
													settingLocation,
											);
										}
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
							verifyImport(path, i);
							if (hasErrors) script.log(`{red-fg}[Path ${i}] ERROR OCCURED`);
						}

						hasErrors = false;
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
							verifyImport(asset, i);
							if (hasErrors) script.log(`{red-fg}[Asset ${i}] ERROR OCCURED`);
						}

						//if errors are not length of zero then throw them!
						if (errors.length !== 0) throw errors;
					},
					'compile',
					script.infinityConsole,
				);

				if (verify !== true) {
					(verify as Error[]).forEach(error => {
						script.infinityConsole.log(`{red-fg}${error}{/red-fg}`);
					});

					throw new Error(
						'failed verification of assets/paths. please check errors above.',
					);
				}

				let pathSetup = await stage(
					'pathSetup',
					project,
					async () => {},
					'compile',
					script.infinityConsole,
				);

				if (pathSetup !== true) throw pathSetup;
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
