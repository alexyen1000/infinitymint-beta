import "module-alias/register";
import {
	debugLog,
	initializeInfinitymintConfig,
	loadInfinityMint,
} from "./app/helpers";

//require dotenv
require("dotenv").config({
	override: false, //will not override already established environment variables
});

//import our hardhat plugins
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import "hardhat-change-network"; //allows hre.changeNetwork to occur

//load infinitymint
loadInfinityMint();

//return the infinitymint config file
let config = initializeInfinitymintConfig();
debugLog("loaded hardhat.config.ts");
export default config.hardhat; //export the infinity mint configuration file
