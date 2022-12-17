import { InfinityMintDeploymentScript } from "../../app/interfaces";

const Royalty: InfinityMintDeploymentScript = {
	deploy: async (params) => {},
	setup: async (params) => {},
	//going to give
	instantlySetup: true, //will run the set up for this contract instantly and not after everything else has deployed
	solidityNamespace: "alpha",
	permissions: ["approved", "erc721", "minter"],
};
export default Royalty;
