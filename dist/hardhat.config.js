"use strict";
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
//load infinitymint
(0, helpers_1.loadInfinityMint)();
//return the infinitymint config file
let config = (0, helpers_1.initializeInfinitymintConfig)();
(0, helpers_1.debugLog)("loaded hardhat.config.ts");
exports.default = config.hardhat; //export the infinity mint configuration file
//# sourceMappingURL=hardhat.config.js.map