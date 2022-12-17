import { InfinityMintDeploymentScript } from "../../app/interfaces";

const Utils: InfinityMintDeploymentScript = {
	deploy: async (params) => {},
	setup: async (params) => {},
	//going to give
	library: true,
	important: true, //utils must be deployed either before or after values
	index: 0, //should be after values
	solidityNamespace: "alpha",
	permissions: ["approved", "erc721"],
};
export default Utils;
