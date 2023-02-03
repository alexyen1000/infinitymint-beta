import {
	InfinityMintScript,
	InfinityMintScriptParameters,
} from '../app/interfaces';
import {deployAnonContract} from '../app/web3';
import fs from 'fs';

const deployContract: InfinityMintScript = {
	name: 'DeployContract',
	description:
		'unassociated with InfinityMint only used to deploy patches and fixes',
	execute: async (script: InfinityMintScriptParameters) => {
		if (!script.args?.contractName?.value) throw new Error('bad');

		script.log(
			'\n{underline}deploying {yellow-fg}{bold}' +
				script.args.contractName.value +
				'{/}',
		);
		let deployment = await deployAnonContract(script.args.contractName.value);
		script.log(
			'\n{green-fg}successfully deployed {cyan-fg}{bold}' +
				script.args.contractName.value +
				'{/} => ' +
				deployment.address,
		);
		script.log('cleaning up...');
		fs.unlinkSync(
			'./deployments/' +
				script.infinityConsole.getCurrentNetwork().name +
				'/' +
				deployment.contractName +
				'.json',
		);
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
