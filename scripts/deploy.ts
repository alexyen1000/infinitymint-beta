import {
	InfinityMintDeploymentLive,
	InfinityMintDeploymentParameters,
	InfinityMintEventEmit,
	InfinityMintProject,
	InfinityMintScript,
	InfinityMintScriptParameters,
} from "@app/interfaces";
import {
	getProjectDeploymentClasses,
	InfinityMintDeployment,
} from "@app/deployments";
import {
	getCompiledProject,
	getTempDeployedProject,
	hasTempDeployedProject,
	saveTempCompiledProject,
} from "@app/helpers";

const deploy: InfinityMintScript = {
	name: "Deploy",
	description:
		"Deploys InfinityMint or a specific InfinityMint contract related to the current project",
	/**
	 * Deploys an InfinityMint project
	 * @param params
	 */
	execute: async (params: InfinityMintScriptParameters) => {
		let project: InfinityMintProject;

		if (
			params.args.useTemp.value === true &&
			hasTempDeployedProject(params.args.project.value)
		)
			project = getTempDeployedProject(params.args.project.value);
		else project = getCompiledProject(params.args.project.value);

		//make sure stages are created
		project.stages = project.stages || {};

		let deployments = await getProjectDeploymentClasses(
			params.args.project.value
		);

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

		let contracts = {};
		for (let i = 0; i < deployments.length; i++) {
			let deployment = deployments[i];

			//set the initial completion stage for this contract to be null
			project.stages["deploy_" + deployment.getKey()] = false;
			project.deployments = contracts;

			try {
				if (
					params.args?.contract !== undefined &&
					deployment.getKey() !== params.args?.contract.value &&
					deployment.getContractName() !== params.args.contract.value
				) {
					params.debugLog(
						`[${i}] skipping <` +
							deployment.getKey() +
							">(" +
							deployment.getContractName() +
							")"
					);
					continue;
				}

				params.debugLog(
					`[${i}] deploying <` +
						deployment.getKey() +
						">(" +
						deployment.getContractName() +
						")"
				);

				params.eventEmitter.emit("preDeploy", {
					project: project,
					deployments: deployments,
					event: deployment,
					...params,
				} as InfinityMintEventEmit<InfinityMintDeployment>);

				if (
					deployment.hasDeployed() &&
					params.args?.redeploy?.value !== true
				) {
					let previousContracts = deployment.getDeployments();
					previousContracts.forEach((contract) => {
						params.debugLog(
							`already deployed ${contract.name} => <${contract.address}>`
						);
						contracts[contract.key] = contract;
					});

					continue;
				}

				let deployedContracts = await deployment.deploy({
					project: project,
					deployments: deployments,
					deployment: deployment,
					contracts: contracts,
					deployed: deployment.hasDeployed(),
					deploymentScript: deployment.getDeploymentScript(),
					...params,
				} as InfinityMintDeploymentParameters);

				deployedContracts.forEach((contract) => {
					params.debugLog(
						`deployed ${contract.name} => <${contract.address}>`
					);
				});

				params.eventEmitter.emit("postDeploy", {
					project: project,
					deployments: deployments,
					event: deployedContracts,
					...params,
				} as InfinityMintEventEmit<InfinityMintDeploymentLive[]>);

				if (deployment.getDeploymentScript().instantlySetup === true) {
					params.debugLog(
						`[${i}] setting up <` +
							deployment.getKey() +
							">(" +
							deployment.getContractName() +
							")"
					);

					params.eventEmitter.emit("preSetup", {
						project: project,
						deployments: deployments,
						event: deployment,
						...params,
					} as InfinityMintEventEmit<InfinityMintDeployment>);

					await deployment.setup({
						project: project,
						deployments: deployments,
						deployment: deployment,
						event: deployment,
						contracts: contracts,
						deployed: deployment.hasDeployed(),
						deploymentScript: deployment.getDeploymentScript(),
						...params,
					} as InfinityMintDeploymentParameters);

					params.eventEmitter.emit("postSetup", {
						project: project,
						deployments: deployments,
						event: deployment,
						...params,
					} as InfinityMintEventEmit<InfinityMintDeployment>);
				}
				project.stages["deploy_" + deployment.getKey()] = true;
			} catch (error) {
				project.stages["deploy_" + deployment.getKey()] = error;
				saveTempCompiledProject(project);
				throw error;
			} finally {
				saveTempCompiledProject(project);
			}
		}
	},
	arguments: [
		{
			name: "project",
			type: "string",
			optional: true,
		},
		{
			name: "contract",
			type: "string",
			optional: true,
		},
		{
			name: "useTemp",
			type: "boolean",
			optional: true,
		},
		{
			name: "redeploy",
			type: "boolean",
			optional: true,
		},
	],
};
export default deploy;
