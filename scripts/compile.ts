import { InfinityMintScript } from "@app/interfaces";

const Deploy: InfinityMintScript = {
	name: "Compile",
	description: "Compiles a project",
	execute: async ({}) => {},
	arguments: [
		{
			name: "project",
			optional: true,
		},
	],
};
export default Deploy;
