/**
 *
 * DO NOT EDIT THIS FILE!
 *
 * This file is merely a loader for the infinitymint.config.js and you should put inside of the hardhat key what ever you would
 * put inside of here.
 */

import "module-alias/register";
import {
	debugLog,
	initializeInfinitymintConfig,
	loadInfinityMint,
} from "infinitymint/dist/app/helpers";

//require dotenv
require("dotenv").config({
	override: false, //will not override already established environment variables
});

//import our hardhat plugins
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import "hardhat-change-network"; //allows hre.changeNetwork to occur

//load infinitymint and create default files
loadInfinityMint(false, true);
//return the infinitymint config file
let config = initializeInfinitymintConfig();
debugLog("loaded hardhat.config.ts");
export default config.hardhat; //export the infinity mint configuration file
