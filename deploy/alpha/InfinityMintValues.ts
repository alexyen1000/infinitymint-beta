import { InfinityMintDeploymentScript } from "@app/interfaces";

const DefaultValues = {
	maxSupply: 10,
	linkWalletIndex: 0,
	linkStickersIndex: 1,
};

const Values: InfinityMintDeploymentScript = {
	setup: async ({ project, debugLog, deployment }) => {
		let variables = {
			...DefaultValues,
			...(project.settings?.assets || {}),
			...(project.settings?.minter || {}),
			...(project.settings?.erc721 || {}),
			...(project.settings?.values || {}),
		};

		let cleanedVariables = {} as any;
		let values = Object.values(variables);
		let keys = Object.keys(variables);
		let singleLevelObjects = keys.filter(
			(key) => typeof values[key] === "object"
		);
		//only select numbers or booleans to be added
		keys.filter(
			(key) =>
				typeof values[key] === "number" ||
				typeof values[key] === "boolean"
		).forEach((key) => (cleanedVariables[key] = values[key]));

		//add values from objects into the variables list
		singleLevelObjects
			.map((object) => {
				return { keys: Object.keys(values[object]), value: object };
			})
			.forEach((object) => {
				object.keys
					.filter(
						(key) =>
							typeof values[object.value][key] === "number" ||
							typeof values[object.value][key] === "boolean"
					)
					.forEach((key) => {
						cleanedVariables[key] = values[object.value][key];
					});
			});

		debugLog(
			"found " +
				Object.values(cleanedVariables).length +
				" on-chain variables"
		);

		let booleans = Object.keys(cleanedVariables)
			.filter((key) => typeof cleanedVariables[key] === "boolean")
			.map((key) => cleanedVariables[key]);

		let numbers = Object.keys(cleanedVariables)
			.filter((key) => typeof cleanedVariables[key] === "number")
			.map((key) => cleanedVariables[key]);

		let contract = deployment.getContract();

		booleans = {
			keys: Object.keys(booleans),
			values: Object.values(booleans),
		} as any;
		numbers = {
			keys: Object.keys(numbers),
			values: Object.values(numbers),
		} as any;
	},
	dontRedeploy: true,
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
