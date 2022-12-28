import { InfinityMintScript } from "@app/interfaces";

const compile: InfinityMintScript = {
	name: "Compile",
	description: "Compiles a project",
	execute: async ({ eventEmitter }) => {},
	arguments: [
		{
			name: "project",
			optional: true,
		},
	],
};
export default compile;
