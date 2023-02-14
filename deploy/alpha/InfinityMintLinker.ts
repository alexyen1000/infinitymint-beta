import { InfinityMintDeploymentScript } from '../../app/interfaces';

const InfinityMintProject: InfinityMintDeploymentScript = {
    //going to give
    module: 'project',
    index: 10, //should be after values
    deployArgs: ['storage', 'erc721'],
    solidityFolder: 'alpha',
    permissions: ['approved'],
};
export default InfinityMintProject;
