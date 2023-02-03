import {getScriptTemporaryProject} from '../app/projects';
import {
	InfinityMintProject,
	InfinityMintProjectAsset,
	InfinityMintProjectContent,
	InfinityMintProjectPath,
	InfinityMintScript,
	InfinityMintScriptParameters,
} from '../app/interfaces';
import {
	getInfinityMintVersion,
	prepare,
	action,
	always,
	cwd,
} from '../app/helpers';
import {hardhatDeploy} from '../app/web3';

// Use the IM Local deployment. It's not been attached to anything
// All web3 functions return local deployment shit
// Use `script.args.contractName`
// Add a warning box saying "hey this is gonna overwrite your shit"
// Use `deployHardhat` - it's ported from the old buildtools

const deployContract: InfinityMintScript = {
	name: 'DeployContract',
	description:
		'unassociated with InfinityMint only used to deploy patches and fixes',
	execute: async (script: InfinityMintScriptParameters) => {
		if (!script.args?.contractName?.value) throw new Error('bad');

		let deployment = await hardhatDeploy(script.args.contractName.value, {
			network: {
				chainId: script.infinityConsole.getCurrentChainId(),
				name: script.infinityConsole.getCurrentNetwork().name,
			},
		} as any);

		script.log('deployed contract to => ' + deployment.address);
	},
	arguments: [
		{
			name: 'contractName',
			type: 'string',
			optional: false,
		},
	],
};

export default deployContract;
