import {InfinityMintDeploymentScript} from '@app/interfaces';

const RarityImage: InfinityMintDeploymentScript = {
	//going to give
	unique: true,
	module: 'assets',
	index: 6,
	solidityFolder: 'alpha',
	permissions: ['approved', 'erc721', 'assets'],
};

export default RarityImage;
