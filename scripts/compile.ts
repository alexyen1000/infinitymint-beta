import {getScriptProject} from '@app/projects';
import {
	InfinityMintScript,
	InfinityMintScriptParameters,
} from '@app/interfaces';
import {stage} from '@app/helpers';

const compile: InfinityMintScript = {
	name: 'Compile Project',
	description:
		'Compile an InfinityMint project ready for deployment. The compiled file will garuntee that all the assets used in the minter are uploaded to IPFS and accessible at all times.',
	execute: async (script: InfinityMintScriptParameters) => {
		let project = getScriptProject(script, 'source'); //gets a temporary project file if there is one for a compilation, if not will just return the source project aka the .ts file or .js file
		if (project.version === undefined)
			project.version = {
				version: '1.0.0',
				tag: 'initial',
			};

		if (project.stages === undefined) project.stages = {};

		script.log(
			`{cyan-fg}{bold}Compiling Project ${project.name}@${project.version.version}{/}`,
		);
		let result = await stage('compile', project, async () => {
			let pathSetup = await stage('pathSetup', project, async () => {
				throw new Error('fuck');
			});

			if (pathSetup !== true) throw pathSetup;
		});

		if (result !== false) throw result;

		script.log('{green-fg}{bold}Compilation Successful{/}');
		script.log(`\t Project: ${project.name}`);
		script.log(
			`\t Version: ${project.version.version} (${project.version.tag})`,
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
