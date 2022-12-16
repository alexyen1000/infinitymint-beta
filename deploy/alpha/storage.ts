import { InfinityMintDeploymentScript } from "../../app/config";

const Storage: InfinityMintDeploymentScript = {
	deploy: async (params) => {},
	setup: async (params) => {},
	//going to give
	solidityNamespace: "alpha",
	permissions: ["approved", "erc721", "minter"],
};
export default Storage;
