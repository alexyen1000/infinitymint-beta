import { InfinityMintDeployment } from "../../app/config";

const Assets: InfinityMintDeployment = {
	deploy: () => {},
	setup: () => {},
	//going to give
	index: 2,
	solidityNamespace: "alpha",
	permissions: ["approved", "erc721", "minter"],
};
export default Assets;