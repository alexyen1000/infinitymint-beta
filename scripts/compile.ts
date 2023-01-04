import {
	InfinityMintScript,
	InfinityMintScriptParameters,
} from "@app/interfaces";

const compile: InfinityMintScript = {
	name: "Compile Project",
	description:
		"Compile an InfinityMint project ready for deployment. The compiled file will garuntee that all the assets used in the minter are uploaded to IPFS and accessible at all times.",
	execute: async (script: InfinityMintScriptParameters) => {},
	arguments: [
		{
			name: "project",
			optional: true,
		},
	],
};
export default compile;
