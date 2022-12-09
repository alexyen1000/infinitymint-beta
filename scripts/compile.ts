import { InfinityMintScript } from "../app/config";

const Deploy: InfinityMintScript = {
	name: "Compile",
	description:
		"Compiles everything in the contracts folder, will also compile all enabled mods inside of the current project",
	execute: () => {},
	arguments: [
		{
			name: "contract",
			optional: true,
		},
	],
};
export default Deploy;
