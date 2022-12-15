import { InfinityMintDeployment } from "../../app/config";

const Utils: InfinityMintDeployment = {
	deploy: () => {},
	setup: () => {},
	//going to give
	library: true,
	important: true, //utils must be deployed either before or after values
	index: 0, //should be after values
	solidityNamespace: "alpha",
	permissions: ["approved", "erc721"],
};
export default Utils;
