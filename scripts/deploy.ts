import { InfinityMintScript, InfinityMintScriptParameters } from "./interfaces";
import {
	getInfinityMintDeployments,
	InfinityMintDeployment,
} from "./deployments";
import hre from "hardhat";
import fs from "fs";

const Deploy: InfinityMintScript = {
	name: "Deploy",
	description:
		"Deploys InfinityMint or a specific InfinityMint contract related to the current project",
	execute: async (params: InfinityMintScriptParameters) => {
		let deployments = [] as InfinityMintDeployment[];
		//first, lets read the deployments

		let locations = [
			"./../",
			process.cwd() + "/",
			...(params.config?.settings?.deploy?.scriptFolders || []),
		].filter((location) => fs.existsSync(location));

		for (let i = 0; i < locations.length; i++) {
			let result = await getInfinityMintDeployments(
				params.project,
				hre.network.name,
				"./"
			);
			deployments = [
				...deployments,
				...result,
			] as InfinityMintDeployment[];
		}

		let notUniqueAndImportant = deployments
			.filter(
				(deployment) =>
					deployment.isUnique() && deployment.isImportant()
			)
			.filter(
				(deployment) =>
					deployments.filter(
						(thatDeployment) =>
							thatDeployment.getKey() === deployment.getKey()
					).length > 1
			);

		if (notUniqueAndImportant.length !== 0)
			throw new Error(
				"1 or more conflicting unique and important deploy scripts: check " +
					notUniqueAndImportant
						.map(
							(deployment) =>
								deployment.getKey() +
								":" +
								deployment.getFilePath()
						)
						.join(",")
			);
	},
};
export default Deploy;
