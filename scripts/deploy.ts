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

		//pipes are used to pipe console.log and console.errors to containers which can then be viewed instead of logs/debug logs all being in one place, here we are registering a new pipe for this deployment process and setting it as the current pipe
		if (params.args?.setPipe?.value === true) {
			let pipeName = "deploy_" + project.name;
			if (params.console.getPipes().pipes[pipeName] === undefined)
				params.console.getPipes().registerSimplePipe(pipeName, {
					listen: true,
				});

			//all log messages will now go to deploy
			params.console.getPipes().setCurrentPipe(pipeName);
		}

		if (
			params.args.useTemp.value === true &&
			hasTempDeployedProject(params.args.project.value)
		) {
			params.log("");
			project = getTempDeployedProject(params.args.project.value);
		} else project = getCompiledProject(params.args.project.value);

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
					previousContracts.forEach((contract, index) => {
						params.debugLog(
							`already deployed ${contract.name} => <${contract.address}>`
						);
						contracts[contract.name] = contract;
						contracts[
							index === 0
								? contract.key
								: contract.key + ":" + index
						] = contract;
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

				deployedContracts.forEach((contract, index) => {
					params.debugLog(
						`[${index}] deployed ${contract.name} => <${contract.address}>`
					);
					contracts[contract.name] = contract;
					contracts[
						index === 0 ? contract.key : contract.key + ":" + index
					] = contract;
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

					project.stages["setup_" + deployment.getKey()] = false;
					try {
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
					} catch (error) {
						project.stages["setup_" + deployment.getKey()] = error;
						throw error;
					}

					project.stages["setup_" + deployment.getKey()] = true;

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
		{
			name: "setPipe",
			type: "boolean",
			optional: true,
			value: true,
		},
	],
};
export default deploy;
