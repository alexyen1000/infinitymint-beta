import { InfinityMintProject } from "../app/config";

const example: InfinityMintProject = {
	name: "example",
	price: "$1",
	modules: {
		randomController: "SeededRandom",
		assetController: "SimpleSVG",
		minter: "DefaultMinter",
		royaltyController: "DefaultRoyalty",
	},
	information: {
		tokenSymbol: "EXAMPLE",
		tokenSingular: "Example",
	},
	permissions: {
		all: [],
	},
	paths: [
		{
			name: "Example Token",
			fileName: "test.svg",
		},
	],
};

export default example;
