import { HardhatUserConfig } from "hardhat/config";
import fs from "node:fs";
import Pipes from "./app/pipes";
import { debugLog, isEnvTrue, readSession, saveSession } from "./app/helpers";

//if there is no temp folder, make it.
if (!fs.existsSync("./temp")) fs.mkdirSync("./temp");
//copy the .env file from example if there is none
if (!fs.existsSync("./.env")) fs.copyFileSync("./.env.example", "./.env");

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
	let stub = `\n
		import { InfinityMintConfig } from "./app/config";

		//please visit docs.infinitymint.app for a more complete starter configuration file
		const config: InfinityMintConfig = {
			hardhat: ${JSON.stringify(config, null, 2)}
		}
		export default config;
	`;
	fs.writeFileSync("./infinitymint.config.ts", stub);
}

//overwrite console log
let consoleLog = console.log;
console.log = (msg, setPipe = true) => {
	if (setPipe && Pipes.logs[Pipes.currentPipe] !== undefined)
		Pipes.getPipe(Pipes.currentPipe).logs.push(msg);

	if (isEnvTrue("PIPE_CALL_DEFAULT_LOG")) consoleLog(msg);
};

//will log console.log output to the default pipe
if (isEnvTrue("PIPE_ECHO_DEFAULT")) Pipes.getPipe("default").listen = true;
//create the debug pipe
Pipes.registerSimplePipe("debug", {
	listen: isEnvTrue("PIPE_ECHO_DEBUG"),
	save: true,
});

//read the session
let session = readSession();
//if the ganache is not external and no mnemonic for ganache in the environment file then set one
if (
	isEnvTrue("GANACHE_EXTERNAL") === false &&
	session.environment?.ganacheMnemomic === undefined
)
	session.environment.ganacheMnemomic = "black";

debugLog("saving .session file");
saveSession(session);
//else, import the InfinityMint config
const infinityMintConfig = require("./infinitymint.config").default;

debugLog("loaded hardhat.config.ts");
export default infinityMintConfig.hardhat; //export the infinity mint configuration file
