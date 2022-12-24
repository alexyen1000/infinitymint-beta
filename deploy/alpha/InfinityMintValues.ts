import { InfinityMintDeploymentScript } from "../interfaces";

const DefaultValues = {
	maxSupply: 10,
	linkWalletIndex: 0,
	linkStickersIndex: 1,
};

const Values: InfinityMintDeploymentScript = {
	setup: async ({ project, isFirstTime }) => {
		let values = {
			...DefaultValues,
			...(project.settings?.values || {}),
		};
	},
	//going to give
	instantlySetup: true, //will run the set up for this contract instantly and not after everything else has deployed
	unique: true,
	important: true,
	module: "values",
	index: 0, //nothing should be before values
	solidityFolder: "alpha",
	permissions: ["approved"],
};
export default Values;
