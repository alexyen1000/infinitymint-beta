import { InfinityMintDeploymentScript } from "../interfaces";

const Values: InfinityMintDeploymentScript = {
	deploy: async (params) => {},
	setup: async (params) => {},
	//going to give
	instantlySetup: true, //will run the set up for this contract instantly and not after everything else has deployed
	unique: true,
	important: true,
	index: 0, //nothing should be before values
	solidityNamespace: "alpha",
	permissions: ["approved", "erc721"],
};
export default Values;
