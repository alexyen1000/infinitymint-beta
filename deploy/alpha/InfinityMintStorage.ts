import {InfinityMintDeploymentScript} from '../../app/interfaces';

const InfinityMintStorage: InfinityMintDeploymentScript = {
	//going to give
	module: 'storage',
	index: 3, //should be after values
	solidityFolder: 'alpha',
	permissions: ['approved', 'erc721', 'api'],
};
export default InfinityMintStorage;
