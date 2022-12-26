import {
	InfinityMintScript,
	InfinityMintScriptParameters,
} from "@app/interfaces";

const Deploy: InfinityMintScript = {
	name: "Compile",
	description: "Compiles a project",
	execute: async (params: InfinityMintScriptParameters) => {},
	arguments: [
		{
			name: "project",
			optional: true,
		},
	],
};
export default Deploy;
