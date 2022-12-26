import { log } from "@app/helpers";
import {
	InfinityMintGemParameters,
	InfinityMintGemScript,
} from "@app/interfaces";
import Example from "./windows/example";

const gem: InfinityMintGemScript = {
	name: "Example Gem",
	deploy: async () => {},
	init: async (params: InfinityMintGemParameters) => {
		//add the example window to the InfinityConsole
		params?.console?.addWindow(new Example());
	},
	setup: async () => {},
	events: {
		gemPostDeploy: async () => {
			log("Example gem has deployed");
		},
		gemPostSetup: async () => {
			log("Example gem has been set up");
		},
	},
};

export default gem;
