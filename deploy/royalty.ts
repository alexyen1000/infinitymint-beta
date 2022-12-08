import { InfinityMintDeployment } from "../app/config";

const Royalty: InfinityMintDeployment = {
	deploy: () => {},
	setup: () => {},
	//going to give
	instantlySetup: true, //will run the set up for this contract instantly and not after everything else has deployed
	permissions: ["approved", "erc721", "minter"],
};
export default Royalty;
