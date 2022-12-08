import { InfinityMintDeployment } from "../app/config";

const Values: InfinityMintDeployment = {
	deploy: () => {},
	setup: () => {},
	//going to give
	instantlySetup: true, //will run the set up for this contract instantly and not after everything else has deployed
	important: true, //values must be deployed first
	index: 0, //nothing should be before values
	permissions: ["approved", "erc721"],
};
export default Values;
