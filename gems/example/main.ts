import { InfinityMintGemParameters, InfinityMintGem } from "../interfaces";
import Example from "./windows/example";

const gem: InfinityMintGem = {
	name: "Example Gem",
	deploy: async () => {},
	init: async (params: InfinityMintGemParameters) => {
		//add the example window to the InfinityConsole
		params?.console?.addWindow(new Example());
	},
	setup: async () => {},
};

export default gem;
