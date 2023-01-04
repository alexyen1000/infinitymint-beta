import { InfinityMintScript } from "@app/interfaces";

const upload: InfinityMintScript = {
	name: "Upload Project",
	description:
		"Builds and then uploads to IPFS directory an InfinityMint build ready to be set as a the content record of an ENS",
	execute: async () => {},
	arguments: [
		{
			name: "project",
			optional: true,
		},
	],
};
export default upload;
