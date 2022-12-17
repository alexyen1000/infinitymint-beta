import { InfinityMintProject } from "../app/interfaces";

const ticketmint: InfinityMintProject = {
	name: "ticketmint",
	price: "$1",
	modules: {
		random: "SeededRandom",
		assets: "SimpleToken",
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
			data: {
				event: "",
			},
		},
	],
};

export default ticketmint;
