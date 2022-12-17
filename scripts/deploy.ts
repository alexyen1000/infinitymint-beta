import {
	InfinityMintScript,
	InfinityMintScriptParameters,
} from "../app/interfaces";
import { getDeploymentScripts } from "../app/deployments";

const Deploy: InfinityMintScript = {
	name: "Deploy",
	description:
		"Deploys InfinityMint or a specific InfinityMint contract related to the current project",
	execute: async (params: InfinityMintScriptParameters) => {
		//first, lets read the deployments
		let deployments = await getDeploymentScripts();
	},
};
export default Deploy;
