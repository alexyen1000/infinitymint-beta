import { InfinityMintScript, InfinityMintScriptParameters } from "./interfaces";
import { getDeployments } from "./deployments";
import hre from "hardhat";

const Deploy: InfinityMintScript = {
	name: "Deploy",
	description:
		"Deploys InfinityMint or a specific InfinityMint contract related to the current project",
	execute: async (params: InfinityMintScriptParameters) => {
		//first, lets read the deployments
		let deployments = await getDeployments(
			params.project,
			hre.network.name
		);
	},
};
export default Deploy;
