import {
	InfinityMintScript,
	InfinityMintScriptParameters,
} from "@app/interfaces";

const Deploy: InfinityMintScript = {
	name: "Example",
	description: "Prints hello world",
	execute: async (params: InfinityMintScriptParameters) => {
		params.log("hello world");
	},
};
export default Deploy;
