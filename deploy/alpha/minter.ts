import { InfinityMintDeploymentScript } from "../../app/config";

const Minter: InfinityMintDeploymentScript = {
	deploy: async (params) => {},
	setup: async (params) => {},
	//going to give
	solidityNamespace: "alpha",
	permissions: ["erc721", "assets"],
};
export default Minter;
