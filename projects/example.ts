import { InfinityMintProject } from "../app/interfaces";

const example: InfinityMintProject = {
	name: "example",
	price: "$1",
	modules: {
		random: "SeededRandom",
		assets: "SimpleSVG",
		minter: "DefaultMinter",
		royalty: "DefaultRoyalty",
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
