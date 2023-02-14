import {
    InfinityMintDeploymentLive,
    InfinityMintDeploymentParameters,
    InfinityMintEventEmit,
    InfinityMintScript,
    InfinityMintScriptParameters,
    InfinityMintTempProject,
} from '../app/interfaces';
import { InfinityMintDeployment } from '../app/deployments';
import { getScriptTemporaryProject } from '../app/projects';
import {
    action,
    always,
    getConfigFile,
    logDirect,
    prepare,
    stage,
} from '../app/helpers';

const deployProject: InfinityMintScript = {
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
            'compiled'
        );

        if (!project.compiled)
            throw new Error('please compile this project before deploying it');

        if (script.args?.setPipe?.value) {
            //pipes are used to pipe console.log and console.errors to containers which can then be viewed instead of logs/debug logs all being in one place, here we are registering a new pipe for this deployment process and setting it as the current pipe
            let pipeName = 'deploy_' + project.name;
            if (!script.infinityConsole.getConsoleLogs().pipes[pipeName])
                script.infinityConsole
                    .getConsoleLogs()
                    .registerSimplePipe(pipeName, {
                        listen: true,
                    });

            //all log messages will now go to deploy
            script.infinityConsole.getConsoleLogs().setCurrentPipe(pipeName);
        }

        if (!project.network)
            project.network = {
                chainId: script.infinityConsole.getCurrentChainId(),
                name: script.infinityConsole.getCurrentNetwork().name,
                url: config.settings?.networks?.[
                    script.infinityConsole.getCurrentNetwork().name
                ]?.rpc,
                tokenSymbol: script.infinityConsole.getCurrentTokenSymbol(),
            };

        //sets the project and script to be the one used by the action method. Must be called before any action is called or any always is called
        prepare(project, script, 'deploy');

        script.log(
            `{cyan-fg}{bold}getting deployment classes for ${project.name}@${project.version.version}{/}`
        );

        let deployments: InfinityMintDeployment[] =
            await script.infinityConsole.getProjectDeploymentClasses(project);

        let notUniqueAndImportant = deployments
            .filter(
                (deployment) =>
                    !deployment.isUnique() && !deployment.isImportant()
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
                '1 or more conflicting unique and important deploy scripts: check ' +
                    notUniqueAndImportant
                        .map(
                            (deployment) =>
                                deployment.getKey() +
                                ':' +
                                deployment.getTemporaryFilePath()
                        )
                        .join('\n')
            );

        let libraies = deployments.filter((deployment) =>
            deployment.isLibrary()
        );
        let important = deployments.filter((deployment) =>
            deployment.isImportant()
        );

        let importantDeployments = [...libraies];
        important.forEach((deployment, index) => {
            if (
                importantDeployments.filter(
                    (thatDeployment) =>
                        thatDeployment.getKey() === deployment.getKey()
                ).length === 0
            )
                importantDeployments.push(deployment);
        });

        importantDeployments.sort((a, b) => {
            if (a.isLibrary() && !b.isLibrary()) return -1;
            if (!a.isLibrary() && b.isLibrary()) return 1;
            return 0;
        });

        script.log(
            `{yellow-fg}{bold}deploying ${deployments.length} contracts{/}`
        );
        deployments.forEach((deployment) => {
            script.log(`{white-fg}{bold} - ${deployment.getKey()}{/}`);
        });

        let contracts = { ...project.deployments };
        let libraires = { ...project.libraries };
        //deploy stage
        let deploy = await always('deploy', async (isFirstTime) => {
            script.log(`{cyan-fg}{bold}Deploying Smart Contracts{/}`);
            for (let i = 0; i < deployments.length; i++) {
                let deployment = deployments[i];

                //deploy each contract
                let result = await always(
                    'deploy_' + deployment.getKey(),
                    async () => {
                        project.deployments = contracts;

                        if (
                            script.args?.contract &&
                            deployment.getKey() !==
                                script.args?.contract.value &&
                            deployment.getContractName() !==
                                script.args.contract.value
                        ) {
                            script.log(
                                `[${i}] skipping <` +
                                    deployment.getKey() +
                                    '>(' +
                                    deployment.getContractName() +
                                    ')'
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
                                    `[${i}] => (${index}) {yellow-fg}already deployed ${contract.name}{/yellow-fg} => <${contract.address}>`
                                );
                                contracts[contract.name as string] = contract;
                                contracts[
                                    index === 0
                                        ? (contract.key as string)
                                        : contract.key + ':' + index
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
                                    ')'
                            );

                            let contractNames = (await deployment.execute(
                                'cleanup',
                                {
                                    isFirstTime,
                                    error: result as Error,
                                }
                            )) as string[];

                            contractNames = contractNames || [];
                            contractNames.forEach((contract) => {
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
                                ')'
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
                                `[${i}] => (${index}) deployed ${contract.name} => <${contract.address}>`
                            );
                            contracts[contract.name as string] = contract;
                            contracts[
                                index === 0
                                    ? (contract.key as string)
                                    : contract.key + ':' + index
                            ] = contract;
                        });

                        if (deployment.isLibrary()) {
                            deployment.getDeployments().forEach((contract) => {
                                libraires[contract.contractName] =
                                    contract.address;
                            });
                        }

                        project.libraries = libraires;

                        script.infinityConsole.emit('postDeploy', {
                            project: project,
                            deployments: deployments,
                            deployment,
                            event: deployedContracts,
                            ...script,
                        } as InfinityMintEventEmit<InfinityMintDeploymentLive[]>);

                        //if we are to instantly set up
                        if (
                            deployment.getDeploymentScript().instantlySetup &&
                            !deployment.hasSetup()
                        ) {
                            script.log(
                                `[${i}] instantly setting up <` +
                                    deployment.getKey() +
                                    '>'
                            );

                            script.infinityConsole.emit('preSetup', {
                                project: project,
                                deployments: deployments,
                                deployment,
                                event: deployment,
                                ...script,
                            } as InfinityMintEventEmit<InfinityMintDeployment>);

                            project.stages['setup_' + deployment.getKey()] =
                                false;
                            try {
                                await deployment.setup({
                                    project: project,
                                    deployments: deployments,
                                    deployment: deployment,
                                    event: deployment,
                                    contracts: contracts,
                                    deployed: deployment.hasDeployed(),
                                    deploymentScript:
                                        deployment.getDeploymentScript(),
                                    ...script,
                                } as InfinityMintDeploymentParameters);
                            } catch (error) {
                                project.stages['setup_' + deployment.getKey()] =
                                    error;
                                throw error;
                            }

                            project.stages['setup_' + deployment.getKey()] =
                                true;

                            script.infinityConsole.emit('postSetup', {
                                project: project,
                                deployments: deployments,
                                deployment,
                                event: deployment,
                                ...script,
                            } as InfinityMintEventEmit<InfinityMintDeployment>);
                        }
                    }
                );

                //throw error from stage
                if (result !== true) {
                    script.log(
                        `[${i}] cleaning up <` +
                            deployment.getKey() +
                            '>(' +
                            deployment.getContractName() +
                            ') after failed deployment'
                    );
                    let contractNames = (await deployment.execute('cleanup', {
                        isFirstTime,
                        error: result as Error,
                    })) as string[];

                    contractNames = contractNames || [];
                    contractNames.forEach((contract) => {
                        if (contracts[contract]) {
                            script.log(`\tRemoving ${contract}`);
                            delete contracts[contract];
                        }
                    });

                    throw result;
                }

                script.log(
                    `{green-fg}successfully deployed{/green-fg} ${deployment.getTemporaryFilePath()}(` +
                        project.name +
                        ')'
                );
            }
            script.log(`{green-fg}{bold}Deployment Successful{/}`);
        });

        if (deploy !== true) throw deploy;

        script.log(
            '{green-fg}setting up project{/green-fg} (' + project.name + ')'
        );

        let setupContracts = deployments.filter(
            (deployment) => !deployment.hasSetup()
        );

        script.log(
            '{green-fg}setting up project{/green-fg} (' + project.name + ')'
        );

        let setup = await always('setup', async () => {
            script.log(`{cyan-fg}{bold}Configuring Smart Contracts{/}`);
            for (let i = 0; i < setupContracts.length; i++) {
                let deployment = setupContracts[i];

                let result = await stage(
                    'setup_' + deployment.getContractName(),
                    project,
                    async () => {
                        if (!deployment.getDeploymentScript().setup) {
                            script.log(
                                `[${i}] => {yellow-fg} Skipping ${deployment.getTemporaryFilePath()} setup since already done`
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
                                ')'
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
                    script
                );

                if (result !== true) throw result;

                script.log(
                    `{green-fg}successfully setup ${deployment.getTemporaryFilePath()}{/green-fg} (` +
                        project.name +
                        ')'
                );
            }
            script.log(
                `{green-fg}{bold}Successfully Configured Smart Contracts{/}`
            );
        });

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
export default deployProject;
