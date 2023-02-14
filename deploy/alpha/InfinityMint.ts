import { InfinityMintDeploymentScript } from '../../app/interfaces';

const InfinityMint: InfinityMintDeploymentScript = {
    //going to give
    module: 'erc721',
    index: 7, //should be after values
    deployArgs: [
        '%token_name%',
        '%token_symbol',
        'storage',
        'values',
        'minter',
        'royalty',
    ],
    solidityFolder: 'alpha',
    permissions: ['approved'],
};
export default InfinityMint;
