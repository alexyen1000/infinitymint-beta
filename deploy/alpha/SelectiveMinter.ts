import { InfinityMintDeploymentScript } from "../interfaces";

const SelectiveMinter: InfinityMintDeploymentScript = {
	//going to give
	library: true,
	unique: true,
	module: "minter",
	important: true,
	index: 0, //should be after values
	solidityFolder: "alpha",
	permissions: ["approved", "erc721", "assets"],
};
export default SelectiveMinter;
