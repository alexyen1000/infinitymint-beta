import {
	InfinityMintScript,
	InfinityMintScriptParameters,
} from "@app/interfaces";

const compile: InfinityMintScript = {
	name: "Compile",
	description: "Compiles a project",
	execute: async (script: InfinityMintScriptParameters) => {},
	arguments: [
		{
			name: "project",
			optional: true,
		},
	],
};
export default compile;
