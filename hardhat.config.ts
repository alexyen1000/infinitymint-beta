import { HardhatUserConfig } from "hardhat/config";
import fs from "node:fs";

//require dotenv
require("dotenv").config({
	override: false, //will not override already established environment variables
});

//imports ethers to be used inside and outside of hardhat scripts
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import "hardhat-change-network"; //allows hre.changeNetwork to occur

//default hardhat config file, this is copied into the InfinityMint config file on its initial creation
const config: HardhatUserConfig = {
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
};

//check if the infinity mint config file has not been created, if it hasn't then create a new config file with the values of the object above
if (!fs.existsSync("./infinitymint.config.ts")) {
	fs.writeFileSync(
		"./infinitymint.config.ts",
		`import { InfinityMintConfig } from "./app/config";\n\n//please visit docs.infinitymint.app\n\nconst config: InfinityMintConfig = {\n\thardhat:${JSON.stringify(
			config,
			null,
			2
		)}};\nexport default config;`
	);
}

//else, import the InfinityMint config
const infinityMintConfig = require("./infinitymint.config").default;
export default infinityMintConfig.hardhat; //export the infinity mint configuration file
