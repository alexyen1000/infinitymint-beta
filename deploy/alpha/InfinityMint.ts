import { InfinityMintDeploymentScript } from "../interfaces";

const InfinityMint: InfinityMintDeploymentScript = {
	//going to give
	library: true,
	unique: true,
	module: "erc721",
	important: true,
	index: 0, //should be after values
	solidityFolder: "alpha",
	permissions: ["approved"],
};
export default InfinityMint;
