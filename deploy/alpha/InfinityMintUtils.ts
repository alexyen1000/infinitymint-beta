import { InfinityMintDeploymentScript } from "../interfaces";

const Utils: InfinityMintDeploymentScript = {
	//going to give
	library: true,
	unique: true,
	tag: "utils",
	important: true,
	index: 0, //should be after values
	solidityNamespace: "alpha",
	permissions: ["approved", "erc721"],
};
export default Utils;
