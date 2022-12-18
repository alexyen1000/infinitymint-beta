import { InfinityMintProject } from "../app/interfaces";

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
		random: "SeededRandom",
		assets: "SimpleImage",
		royalty: "DefaultRoyalty",
	},
	settings: {
		minter: {},
		values: {
			maxSupply: 24,
		},
		assets: {
			preventSamePathTwice: true,
			rarity: {
				pickLeastCommon: true,
			},
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
	basePath: {
		name: "Profile",
		fileName: "",
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
		random: "SeededRandom",
		assets: "SimpleImage",
		royalty: "DefaultRoyalty",
	},
	paths: [
		{
			name: "Hat",
			fileName: "",
		},
	],
	basePath: {
		name: "Block",
		fileName: "",
		data: {
			fuck: "shit",
		},
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
		random: "SeededRandom",
		assets: "SimpleImage",
		royalty: "DefaultRoyalty",
	},
	paths: [],
	basePath: {
		name: "Content",
		fileName: "",
	},
};

export default [profiles, blocks, content];
