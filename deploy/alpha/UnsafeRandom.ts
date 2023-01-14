import {InfinityMintDeploymentScript} from '@app/interfaces';

const UnsafeRandom: InfinityMintDeploymentScript = {
	//going to give
	unique: true,
	module: 'random',
	index: 4,
	solidityFolder: 'alpha',
	permissions: ['approved', 'erc721', 'assets'],
};

export default UnsafeRandom;
