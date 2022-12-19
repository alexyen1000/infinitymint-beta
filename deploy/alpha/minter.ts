import { InfinityMintDeploymentScript } from "../interfaces";

const Minter: InfinityMintDeploymentScript = {
	deploy: async (params) => {},
	setup: async (params) => {},
	//going to give
	solidityNamespace: "alpha",
	permissions: ["erc721", "assets"],
	unique: true,
};
export default Minter;
