import { InfinityMintDeploymentScript } from '../../app/interfaces';

const InfinityMintLinker: InfinityMintDeploymentScript = {
    //going to give
    module: 'linker',
    index: 10, //should be after values
    deployArgs: ['storage', 'erc721'],
    solidityFolder: 'alpha',
    permissions: ['approved'],
};
export default InfinityMintLinker;
