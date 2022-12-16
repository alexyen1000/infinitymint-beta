import { InfinityMintDeploymentScript } from "../../app/config";

const Assets: InfinityMintDeploymentScript = {
	deploy: async (params) => {},
	setup: async (params) => {},
	//going to give
	index: 2,
	solidityNamespace: "alpha",
	permissions: ["approved", "erc721", "minter"],
};
export default Assets;
