import {
	InfinityMintDeployedProject,
	InfinityMintDeploymentLive,
	InfinityMintDeploymentParameters,
	InfinityMintEventEmit,
	InfinityMintProject,
	InfinityMintScript,
	InfinityMintScriptParameters,
	InfinityMintTempProject,
} from "@app/interfaces";
import { InfinityMintDeployment } from "@app/deployments";
import {
	getCurrentProject,
	getDeployedProject,
	getTempDeployedProject,
	hasTempDeployedProject,
	saveTempCompiledProject,
} from "@app/helpers";

const deploy: InfinityMintScript = {
	name: "Deploy Project",
	description:
		"Deploys InfinityMint or a specific InfinityMint contract related to the current project",
	/**
	 * Deploys an InfinityMint project
	 * @param script
	 */
	execute: async (script: InfinityMintScriptParameters) => {
		let project: InfinityMintTempProject;
		let isTemp = false;

		if (script.args.project) {
			let projectName = script.args.project.value;
			if (
				script.args.useTemp.value === true &&
				hasTempDeployedProject(projectName)
			) {
				isTemp = true;
				project = getTempDeployedProject(projectName);
			} else
				project = getDeployedProject(
					projectName
				) as InfinityMintTempProject;
		} else project = script.project as InfinityMintTempProject;

		if (script.args?.setPipe?.value === true) {
			//pipes are used to pipe console.log and console.errors to containers which can then be viewed instead of logs/debug logs all being in one place, here we are registering a new pipe for this deployment process and setting it as the current pipe
			let pipeName = "deploy_" + project.name;
			if (script.infinityConsole.getPipes().pipes[pipeName] === undefined)
				script.infinityConsole.getPipes().registerSimplePipe(pipeName, {
					listen: true,
				});

			//all log messages will now go to deploy
			script.infinityConsole.getPipes().setCurrentPipe(pipeName);
		}

		if (isTemp)
			script.log("picking up previous attempt => " + project.name);

		script.log(
			"{green-fg}deploying project{/green-fg} (" + project.name + ")"
		);
		//make sure stages are created
		project.stages = project.stages || {};

		let deployments = await script.infinityConsole.getDeploymentClasses(
			project.name,
			script.infinityConsole
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
					script.args?.contract !== undefined &&
					deployment.getKey() !== script.args?.contract.value &&
					deployment.getContractName() !== script.args.contract.value
				) {
					script.log(
						`[${i}] skipping <` +
							deployment.getKey() +
							">(" +
							deployment.getContractName() +
							")"
					);
					continue;
				}

				script.eventEmitter.emit("preDeploy", {
					project: project,
					deployments: deployments,
					event: deployment,
					...script,
				} as InfinityMintEventEmit<InfinityMintDeployment>);

				if (
					deployment.hasDeployed() &&
					script.args?.redeploy?.value !== true
				) {
					let previousContracts = deployment.getDeployments();
					previousContracts.forEach((contract, index) => {
						script.log(
							`[${i}] => (${index}) {yellow-fg}already deployed ${contract.name}{/yellow-fg} => <${contract.address}>`
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

				script.log(
					`[${i}] deploying <` +
						deployment.getKey() +
						">(" +
						deployment.getContractName() +
						")"
				);

				let deployedContracts = await deployment.deploy({
					project: project,
					deployments: deployments,
					deployment: deployment,
					contracts: contracts,
					deployed: deployment.hasDeployed(),
					deploymentScript: deployment.getDeploymentScript(),
					...script,
				} as InfinityMintDeploymentParameters);

				deployedContracts.forEach((contract, index) => {
					script.log(
						`[${i}] => (${index}_ deployed ${contract.name} => <${contract.address}>`
					);
					contracts[contract.name] = contract;
					contracts[
						index === 0 ? contract.key : contract.key + ":" + index
					] = contract;
				});

				script.eventEmitter.emit("postDeploy", {
					project: project,
					deployments: deployments,
					event: deployedContracts,
					...script,
				} as InfinityMintEventEmit<InfinityMintDeploymentLive[]>);

				if (deployment.getDeploymentScript().instantlySetup === true) {
					script.log(
						`[${i}] setting up <` +
							deployment.getKey() +
							">(" +
							deployment.getContractName() +
							")"
					);

					script.eventEmitter.emit("preSetup", {
						project: project,
						deployments: deployments,
						event: deployment,
						...script,
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
							...script,
						} as InfinityMintDeploymentParameters);
					} catch (error) {
						project.stages["setup_" + deployment.getKey()] = error;
						throw error;
					}

					project.stages["setup_" + deployment.getKey()] = true;

					script.eventEmitter.emit("postSetup", {
						project: project,
						deployments: deployments,
						event: deployment,
						...script,
					} as InfinityMintEventEmit<InfinityMintDeployment>);
				}
				project.stages["deploy_" + deployment.getKey()] = true;
			} catch (error) {
				project.stages["deploy_" + deployment.getKey()] = error;
				saveTempCompiledProject(project);
				script.log(
					`{red-fg}failed deployment: ${error?.message}{/red-fg} (` +
						project.name +
						")"
				);
				throw error;
			} finally {
				saveTempCompiledProject(project);
			}

			script.log(
				"{green-fg}successfully deployed{/green-fg} (" +
					project.name +
					")"
			);
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
