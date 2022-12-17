import { InfinityMintDeploymentScript } from "../../app/interfaces";

const Project: InfinityMintDeploymentScript = {
	deploy: async (params) => {},
	setup: async (params) => {},
	//going to give
	solidityNamespace: "alpha",
	permissions: ["approved", "erc721", "minter"],
};
export default Project;
