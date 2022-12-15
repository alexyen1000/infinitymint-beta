import { InfinityMintDeployment } from "../../app/config";

const Stickers: InfinityMintDeployment = {
	deploy: () => {},
	setup: () => {},
	//going to give
	solidityNamespace: "alpha",
	permissions: ["approved", "erc721", "minter", "assets"],
};
export default Stickers;
