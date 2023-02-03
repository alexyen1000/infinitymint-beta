import {InfinityMintScript} from '../app/interfaces';

const serve: InfinityMintScript = {
	name: 'Serve',
	description:
		'Serve your project to a remote IPFS destination or repository to make your InfinityMint accessible in a web2 or web3 browser.',
	execute: async () => {},
	arguments: [
		{
			name: 'project',
			type: 'string',
			optional: true,
		},
	],
};
export default serve;
