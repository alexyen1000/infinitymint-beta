import {InfinityMintDeploymentScript} from '../../app/interfaces';

const SelectiveMinter: InfinityMintDeploymentScript = {
	//going to give
	module: 'minter',
	index: 4, //should be after values
	solidityFolder: 'alpha',
	permissions: ['approved', 'erc721', 'assets'],
};
export default SelectiveMinter;
