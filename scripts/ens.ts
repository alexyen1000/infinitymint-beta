import {InfinityMintScript} from '../dist/app/interfaces';

const ens: InfinityMintScript = {
	name: 'Set ENS Content Record',
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
