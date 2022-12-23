require("module-alias/register");
const {
	debugLog,
	initializeInfinitymintConfig,
	loadInfinityMint,
} = require("infinitymint/dist/app/helpers");

//require dotenv
require("dotenv").config({
	override: false, //will not override already established environment variables
});

//import our hardhat plugins
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("hardhat-change-network"); //allows hre.changeNetwork to occur

//load infinitymint
loadInfinityMint(true);

//return the infinitymint config file
let config = initializeInfinitymintConfig();
debugLog("loaded hardhat.config.js");
module.exports = config.hardhat; //export the infinity mint configuration file
