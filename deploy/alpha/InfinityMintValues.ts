import { InfinityMintDeploymentScript } from "../interfaces";

const Values: InfinityMintDeploymentScript = {
	setup: async (params) => {},
	//going to give
	instantlySetup: true, //will run the set up for this contract instantly and not after everything else has deployed
	unique: true,
	important: true,
	module: "values",
	index: 0, //nothing should be before values
	solidityFolder: "alpha",
	permissions: ["approved"],
};
export default Values;
