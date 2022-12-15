import { InfinityMintDeployment } from "../../app/config";

const Random: InfinityMintDeployment = {
	deploy: () => {},
	setup: () => {},
	//going to give
	index: 1,
	solidityNamespace: "alpha",
	permissions: ["approved", "erc721", "minter", "assets"],
};
export default Random;
