import { InfinityMintDeploymentScript } from '../../app/interfaces';

const InfinityMintUtil: InfinityMintDeploymentScript = {
    //going to give
    module: 'utils',
    index: 1, //should be after values
    solidityFolder: 'alpha',
    library: true,
    permissions: ['approved', 'erc721', 'api'],
};
export default InfinityMintUtil;
