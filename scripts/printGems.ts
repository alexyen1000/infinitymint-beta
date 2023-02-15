import { logDirect } from '../app/helpers';
import { findGems } from '../app/gems';
import { InfinityMintScript } from '../app/interfaces';

const printGems: InfinityMintScript = {
    name: 'Print Gems',
    description: 'Prints all the gems currently registered with infinity mint',
    execute: async (script) => {},
    arguments: [
        {
            name: 'project',
            type: 'string',
            optional: true,
        },
    ],
};
export default printGems;
