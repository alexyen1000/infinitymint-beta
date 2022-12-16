import { InfinityMintDeploymentScript } from "../../app/config";

const Stickers: InfinityMintDeploymentScript = {
	deploy: async (params) => {},
	setup: async (params) => {},
	//going to give
	solidityNamespace: "alpha",
	permissions: ["approved", "erc721", "minter", "assets"],
};
export default Stickers;
