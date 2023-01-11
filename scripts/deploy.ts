import {
	InfinityMintDeploymentLive,
	InfinityMintDeploymentParameters,
	InfinityMintEventEmit,
	InfinityMintScript,
	InfinityMintScriptParameters,
	InfinityMintTempProject,
} from '@app/interfaces';
import {InfinityMintDeployment} from '@app/deployments';
import {
	getScriptTemporaryProject,
	saveTempCompiledProject,
	saveTempDeployedProject,
} from '@app/projects';
import {getConfigFile, stage} from '@app/helpers';

const deploy: InfinityMintScript = {
	name: 'Deploy Project',
	description:
		'Deploys InfinityMint or a specific InfinityMint contract related to the current project',
	/**
	 * Deploys an InfinityMint project
	 * @param script
	 */
	execute: async (script: InfinityMintScriptParameters) => {
		let config = getConfigFile();
		let project: InfinityMintTempProject = getScriptTemporaryProject(
			script,
			'compiled',
		);

		if (script.args?.setPipe?.value) {
			//pipes are used to pipe console.log and console.errors to containers which can then be viewed instead of logs/debug logs all being in one place, here we are registering a new pipe for this deployment process and setting it as the current pipe
			let pipeName = 'deploy_' + project.name;
			if (!script.infinityConsole.getLogs().pipes[pipeName])
				script.infinityConsole.getLogs().registerSimplePipe(pipeName, {
					listen: true,
				});

			//all log messages will now go to deploy
			script.infinityConsole.getLogs().setCurrentPipe(pipeName);
		}

		//make sure stages are created
		project.stages = project.stages || {};

		if (project.network === undefined)
			project.network = {
				chainId: script.infinityConsole.getCurrentChainId(),
				name: script.infinityConsole.getCurrentNetwork().name,
				url: config.settings.networks?.[
					script.infinityConsole.getCurrentNetwork().name
				]?.rpc,
				tokenSymbol: script.infinityConsole.getTokenSymbol(),
			};

		let deployments: InfinityMintDeployment[];
		let setupStage = await stage(
			'setup',
			project,
			async () => {
				deployments = await script.infinityConsole.getDeploymentClasses(
					project,
					script.infinityConsole,
				);
				let notUniqueAndImportant = deployments
					.filter(
						deployment => deployment.isUnique() && deployment.isImportant(),
					)
					.filter(
						deployment =>
							deployments.filter(
								thatDeployment =>
									thatDeployment.getKey() === deployment.getKey(),
							).length > 1,
					);

				if (notUniqueAndImportant.length !== 0)
					throw new Error(
						'1 or more conflicting unique and important deploy scripts: check ' +
							notUniqueAndImportant
								.map(
									deployment =>
										deployment.getKey() + ':' + deployment.getFilePath(),
								)
								.join(','),
					);
			},
			'deploy',
			script.infinityConsole,
			true,
		);

		if (setupStage !== true) throw setupStage;

		let contracts = {...project.deployments};
		//deploy stage
		let deploy = await stage(
			'deploy',
			project,
			async isFirstTime => {
				script.log(`{cyan-fg}{bold}Deploying Smart Contracts{/}`);
				for (let i = 0; i < deployments.length; i++) {
					let deployment = deployments[i];

					//deploy each contract
					let result = await stage(
						'deploy_' + deployment.getKey(),
						project,
						async () => {
							project.deployments = contracts;

							if (
								script.args?.contract &&
								deployment.getKey() !== script.args?.contract.value &&
								deployment.getContractName() !== script.args.contract.value
							) {
								script.log(
									`[${i}] skipping <` +
										deployment.getKey() +
										'>(' +
										deployment.getContractName() +
										')',
								);
								return;
							}

							script.infinityConsole.emit('preDeploy', {
								project: project,
								deployments: deployments,
								deployment,
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
										`[${i}] => (${index}) {yellow-fg}already deployed ${contract.name}{/yellow-fg} => <${contract.address}>`,
									);
									contracts[contract.name] = contract;
									contracts[
										index === 0 ? contract.key : contract.key + ':' + index
									] = contract;
								});

								//call post deploy with previous contracts
								script.infinityConsole.emit('postDeploy', {
									project: project,
									deployments: deployments,
									deployment,
									event: previousContracts,
									...script,
								} as InfinityMintEventEmit<InfinityMintDeploymentLive[]>);
								return;
							} else if (deployment.hasDeployed()) {
								script.log(
									`[${i}] already deployed but not redeploying so calling cleanup <` +
										deployment.getKey() +
										'>(' +
										deployment.getContractName() +
										')',
								);

								let contractNames = (await deployment.execute('cleanup', {
									isFirstTime,
									error: result as Error,
								})) as string[];

								contractNames = contractNames || [];
								contractNames.forEach(contract => {
									if (contracts[contract]) {
										script.log(`\tRemoving ${contract}`);
										delete contracts[contract];
									}
								});
							}

							script.log(
								`[${i}] deploying <` +
									deployment.getKey() +
									'>(' +
									deployment.getContractName() +
									')',
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
									`[${i}] => (${index}_ deployed ${contract.name} => <${contract.address}>`,
								);
								contracts[contract.name] = contract;
								contracts[
									index === 0 ? contract.key : contract.key + ':' + index
								] = contract;
							});

							script.infinityConsole.emit('postDeploy', {
								project: project,
								deployments: deployments,
								deployment,
								event: deployedContracts,
								...script,
							} as InfinityMintEventEmit<InfinityMintDeploymentLive[]>);

							//if we are to instantly set up
							if (deployment.getDeploymentScript().instantlySetup) {
								script.infinityConsole.emit('preSetup', {
									project: project,
									deployments: deployments,
									deployment,
									event: deployment,
									...script,
								} as InfinityMintEventEmit<InfinityMintDeployment>);

								project.stages['setup_' + deployment.getKey()] = false;
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
									project.stages['setup_' + deployment.getKey()] = error;
									throw error;
								}

								project.stages['setup_' + deployment.getKey()] = true;

								script.infinityConsole.emit('postSetup', {
									project: project,
									deployments: deployments,
									deployment,
									event: deployment,
									...script,
								} as InfinityMintEventEmit<InfinityMintDeployment>);
							}
						},
						'deploy',
						script.infinityConsole,
					);

					//throw error from stage
					if (result !== true) {
						script.log(
							`[${i}] cleaning up <` +
								deployment.getKey() +
								'>(' +
								deployment.getContractName() +
								') after failed deployment',
						);
						let contractNames = (await deployment.execute('cleanup', {
							isFirstTime,
							error: result as Error,
						})) as string[];

						contractNames = contractNames || [];
						contractNames.forEach(contract => {
							if (contracts[contract]) {
								script.log(`\tRemoving ${contract}`);
								delete contracts[contract];
							}
						});

						throw result;
					}

					script.log(
						`{green-fg}successfully deployed{/green-fg} ${deployment.getFilePath()}(` +
							project.name +
							')',
					);
				}
				script.log(`{green-fg}{bold}Deployment Successful{/}`);
			},
			'deploy',
			script.infinityConsole,
		);

		script.log('{green-fg}deploying project{/green-fg} (' + project.name + ')');

		if (deploy !== true) throw deploy;

		let setupContracts = deployments.filter(
			deployment => !deployment.hasSetup(),
		);

		script.log(
			'{green-fg}setting up project{/green-fg} (' + project.name + ')',
		);

		let setup = await stage(
			'setup',
			project,
			async () => {
				script.log(`{cyan-fg}{bold}Configuring Smart Contracts{/}`);
				for (let i = 0; i < setupContracts.length; i++) {
					let deployment = setupContracts[i];

					let result = await stage(
						'setup_' + deployment.getContractName(),
						project,
						async () => {
							if (!deployment.getDeploymentScript().setup) {
								script.log(
									`[${i}] => {yellow-fg} Skipping ${deployment.getFilePath()} setup since already done`,
								);
								return;
							}

							script.infinityConsole.emit('preSetup', {
								project: project,
								deployments: deployments,
								event: deployment,
								...script,
							} as InfinityMintEventEmit<InfinityMintDeployment>);

							script.log(
								`[${i}] setting up <` +
									deployment.getKey() +
									'>(' +
									deployment.getContractName() +
									')',
							);

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

							script.infinityConsole.emit('postSetup', {
								project: project,
								deployments: deployments,
								event: deployment,
								...script,
							} as InfinityMintEventEmit<InfinityMintDeployment>);
						},
						'deploy',
						script.infinityConsole,
					);

					if (result !== true) throw result;

					script.log(
						`{green-fg}successfully setup ${deployment.getFilePath()}{/green-fg} (` +
							project.name +
							')',
					);
				}
				script.log(
					`{green-fg}{bold}Successfully Configured Smart Contracts{/}`,
				);
			},
			'deploy',
			script.infinityConsole,
		);

		if (setup !== true) throw setup;
	},
	arguments: [
		{
			name: 'project',
			type: 'string',
			optional: true,
		},
		{
			name: 'contract',
			type: 'string',
			optional: true,
		},
		{
			name: 'useTemp',
			type: 'boolean',
			optional: true,
		},
		{
			name: 'redeploy',
			type: 'boolean',
			optional: true,
		},
		{
			name: 'setPipe',
			type: 'boolean',
			optional: true,
			value: true,
		},
	],
};
export default deploy;
