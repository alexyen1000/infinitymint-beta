import { InfinityMintDeployment } from "../../app/config";

const Minter: InfinityMintDeployment = {
	deploy: () => {},
	setup: () => {},
	//going to give
	solidityNamespace: "alpha",
	permissions: ["erc721", "assets"],
};
export default Minter;
