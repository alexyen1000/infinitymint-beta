import {InfinityMintDeploymentScript} from '@app/interfaces';

const DefaultMinter: InfinityMintDeploymentScript = {
	//going to give
	library: true,
	unique: true,
	module: 'utils',
	important: true,
	index: 0, //should be after values
	solidityFolder: 'alpha',
	permissions: ['approved', 'erc721', 'assets'],
};

export default DefaultMinter;
