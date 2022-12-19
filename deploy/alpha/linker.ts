import { InfinityMintDeploymentScript } from "../interfaces";
const Linker: InfinityMintDeploymentScript = {
	deploy: async (params) => {},
	setup: async (params) => {},
	//going to give
	solidityNamespace: "alpha",
	permissions: ["approved", "erc721", "minter", "assets"],
	unique: true,
};
export default Linker;
