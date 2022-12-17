import { InfinityMintScript, InfinityMintScriptParameters } from "./interfaces";

const Deploy: InfinityMintScript = {
	name: "Compile",
	description:
		"Compiles everything in the contracts folder, will also compile all enabled mods inside of the current project",
	execute: async (params: InfinityMintScriptParameters) => {},
	arguments: [
		{
			name: "contract",
			optional: true,
		},
	],
};
export default Deploy;
