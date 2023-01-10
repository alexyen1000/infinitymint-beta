import {
	getProject,
	getScriptProject,
	getTempCompiledProject,
	hasTempCompiledProject,
	saveTempCompiledProject,
} from '@app/projects';
import {
	InfinityMintScript,
	InfinityMintScriptParameters,
	InfinityMintTempProject,
} from '@app/interfaces';
import {stage} from '@app/helpers';

const compile: InfinityMintScript = {
	name: 'Compile Project',
	description:
		'Compile an InfinityMint project ready for deployment. The compiled file will garuntee that all the assets used in the minter are uploaded to IPFS and accessible at all times.',
	execute: async (script: InfinityMintScriptParameters) => {
		let project = getScriptProject(script, 'source'); //gets a temporary project file if there is one for a compilation, if not will just return the source project aka the .ts file or .js file
		if (project.stages === undefined) project.stages = {};

		script.log('{cyan-fg}{bold}Compiling Project{/}');
		let result = await stage('compile', project, async () => {
			await stage('pathSetup', project, async () => {});
		});

		if (result !== true) throw result;
	},
	arguments: [
		{
			name: 'project',
			optional: true,
		},
	],
};
export default compile;
