import {
    InfinityMintScript,
    InfinityMintScriptParameters,
} from '../app/interfaces';

const exportInfinityMint: InfinityMintScript = {
    name: 'HelloWorld',
    description: 'Hello World',
    execute: async (script: InfinityMintScriptParameters) => {
        script.log({
            message: 'Hello World',
        });
    },
};
export default exportInfinityMint;
