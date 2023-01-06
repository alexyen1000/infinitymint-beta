import {
	getCompiledProject,
	getCurrentProject,
	getTempCompiledProject,
	hasTempCompiledProject,
} from "@app/helpers";
import {
	InfinityMintScript,
	InfinityMintScriptParameters,
	InfinityMintTempProject,
} from "@app/interfaces";

const compile: InfinityMintScript = {
	name: "Compile Project",
	description:
		"Compile an InfinityMint project ready for deployment. The compiled file will garuntee that all the assets used in the minter are uploaded to IPFS and accessible at all times.",
	execute: async (script: InfinityMintScriptParameters) => {
		let project: InfinityMintTempProject;
		let isTemp = false;

		if (script.args.project) {
			let projectName = script.args.project.value;
			if (
				script.args.useTemp.value &&
				hasTempCompiledProject(projectName)
			) {
				isTemp = true;
				project = getTempCompiledProject(projectName);
			} else
				project = getCompiledProject(
					projectName
				) as InfinityMintTempProject;
		} else project = script.project as InfinityMintTempProject;
	},
	arguments: [
		{
			name: "project",
			optional: true,
		},
	],
};
export default compile;
