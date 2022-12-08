import { InfinityMintDeployment } from "../app/config";

const Linker: InfinityMintDeployment = {
	deploy: () => {},
	setup: () => {},
	//going to give
	permissions: ["approved", "erc721", "minter", "assets"],
};
export default Linker;
