import {InfinityMintDeploymentScript} from '../../app/interfaces';

const DefaultMinter: InfinityMintDeploymentScript = {
	//going to give
	unique: true,
	module: 'minter',
	index: 5,
	solidityFolder: 'alpha',
	permissions: ['approved', 'erc721', 'assets'],
};

export default DefaultMinter;
