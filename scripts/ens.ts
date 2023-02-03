import {InfinityMintScript} from '../app/interfaces';

const ens: InfinityMintScript = {
	name: 'ENS',
	description:
		'Set your ENS content records to point to your uploaded InfinityMint projects on IPFS',
	execute: async () => {},
	arguments: [
		{
			name: 'project',
			type: 'string',
			optional: true,
		},
	],
};
export default ens;
