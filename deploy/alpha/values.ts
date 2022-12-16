import { InfinityMintDeploymentScript } from "../../app/config";

const Values: InfinityMintDeploymentScript = {
	deploy: async (params) => {},
	setup: async (params) => {},
	//going to give
	instantlySetup: true, //will run the set up for this contract instantly and not after everything else has deployed
	important: true, //values must be deployed first
	index: 0, //nothing should be before values
	solidityNamespace: "alpha",
	permissions: ["approved", "erc721"],
};
export default Values;
