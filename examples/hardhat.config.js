//please visit docs.infinitymint.app for a more complete starter configuration file
const config = {
	hardhat: {
		solidity: {
			version: "0.8.12",
			settings: {
				optimizer: {
					enabled: true,
					runs: 20,
				},
			},
		},
		paths: {
			tests: "./tests",
		},
	},
};
module.exports = config;
