import {
	InfinityMintScript,
	InfinityMintScriptParameters,
} from 'infinitymint/dist/app/interfaces';

const exportInfinityMint: InfinityMintScript = {
	name: 'Export Project',
	description:
		'Exports a project to the specified react repository, will copy over styles, gems and anything else relating to the project',
	execute: async (script: InfinityMintScriptParameters) => {},
};
export default exportInfinityMint;
