"use strict";
/**
 *
 * DO NOT EDIT THIS FILE!
 *
 * This file is merely a loader for the infinitymint.config.js and you should put inside of the hardhat key what ever you would
 * put inside of here.
 */
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const helpers_1 = require("@app/helpers");
//require dotenv
require("dotenv").config({
    override: false, //will not override already established environment variables
});
//import our hardhat plugins
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("hardhat-change-network"); //allows hre.changeNetwork to occur
//load infinitymint and create default files
(0, helpers_1.loadInfinityMint)(false, true);
//return the infinitymint config file
let config = (0, helpers_1.initializeInfinitymintConfig)();
(0, helpers_1.debugLog)("loaded hardhat.config.ts");
exports.default = config.hardhat; //export the infinity mint configuration file
//# sourceMappingURL=hardhat.config.js.map