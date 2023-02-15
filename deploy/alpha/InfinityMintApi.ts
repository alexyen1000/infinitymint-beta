import { InfinityMintDeploymentScript } from '../../app/interfaces';

const InfinityMintApi: InfinityMintDeploymentScript = {
    //going to give
    module: 'api',
    index: 10, //should be after values
    deployArgs: ['erc721', 'storage', 'assets', 'values', 'royalty', 'project'],
    solidityFolder: 'alpha',
    permissions: ['approved', 'erc721', 'api'],
};
export default InfinityMintApi;
