import { InfinityMintProject } from "../app/config";

const profiles: InfinityMintProject = {
	name: "xxx_profiles",
	price: 0.5,
	information: {
		tokenSymbol: "X",
		tokenSingular: "Profile",
		tokenMultiple: "Profiles",
	},
	system: ["xxx_blocks", "xxx_content"],
	gems: [
		{
			name: "redemption",
			enabled: true,
		},
	],
	modules: {
		minter: "DefaultMinter",
		randomController: "SeededRandom",
		assetController: "SimpleImage",
		royaltyController: "DefaultRoyalty",
	},
	infinityLinks: [
		{
			key: "test",
			name: "test",
		},
	],
	settings: {
		minter: {
			randomNames: true,
		},
		values: {
			maxSupply: 24,
		},
		royalty: {
			cuts: {
				stickers: 20,
			},
		},
	},
	paths: [
		{
			name: "Profile",
			fileName: "",
		},
	],
	defaultPath: {
		name: "Profile",
	},
	permissions: {
		all: [],
		erc721: [],
	},
	events: {
		setup: async (project) => {
			console.log("test setup");
		},
		export: async (project) => {
			console.log("test export");
		},
		deploy: async (project) => {
			console.log("test deploy");
		},
	},
};

const blocks: InfinityMintProject = {
	name: "xxx_blocks",
	price: 0.0,
	information: {
		tokenSymbol: "X",
		tokenSingular: "Block",
		tokenMultiple: "Blocks",
	},
	system: ["xxx_profiles", "xxx_content"],
	modules: {
		minter: "DefaultMinter",
		randomController: "SeededRandom",
		assetController: "SimpleImage",
		royaltyController: "DefaultRoyalty",
	},
	paths: [],
	defaultPath: {
		name: "Block",
	},
};

const content: InfinityMintProject = {
	name: "xxx_content",
	price: 0.0,
	system: ["xxx_blocks", "xxx_profiles"],
	information: {
		tokenSymbol: "X",
		tokenSingular: "Content",
	},
	modules: {
		minter: "DefaultMinter",
		randomController: "SeededRandom",
		assetController: "SimpleImage",
		royaltyController: "DefaultRoyalty",
	},
	paths: [],
	defaultPath: {
		name: "Content",
	},
};

export default [profiles, blocks, content];
