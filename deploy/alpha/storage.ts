import { InfinityMintDeployment } from "../../app/config";

const Storage: InfinityMintDeployment = {
	deploy: () => {},
	setup: () => {},
	//going to give
	solidityNamespace: "alpha",
	permissions: ["approved", "erc721", "minter"],
};
export default Storage;
