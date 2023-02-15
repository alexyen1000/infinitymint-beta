import { InfinityMintDeploymentScript } from '../../app/interfaces';

const SimpleSVG: InfinityMintDeploymentScript = {
    //going to give
    unique: true,
    module: 'assets',
    index: 4,
    deployArgs: ['%token_name%', 'values'],
    solidityFolder: 'alpha',
    permissions: ['approved', 'erc721', 'assets'],
};

export default SimpleSVG;
