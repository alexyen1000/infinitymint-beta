/**
 *
 * DO NOT EDIT THIS FILE!
 *
 * This file is merely a loader for the infinitymint.config.js and you should put inside of the hardhat key what ever you would
 * put inside of here.
 */

//import our hardhat plugins
import '@nomicfoundation/hardhat-toolbox';
import '@nomiclabs/hardhat-ethers';
import 'hardhat-change-network'; //allows hre.changeNetwork to occur
import {createDefaultFactory} from './app/pipes';
//create default pipe
createDefaultFactory();

//then aliases
import 'module-alias/register';
import {debugLog, prepareConfig, loadInfinityMint} from './app/helpers';

//require dotenv
require('dotenv').config({
	override: false, //will not override already established environment variables
});

//load infinitymint and create default files
loadInfinityMint(false, true);

//return the infinitymint config file
let config = prepareConfig();

debugLog('loaded hardhat.config.ts');
debugLog('default network: ' + config.hardhat.defaultNetwork);

export default config.hardhat; //export the infinity mint configuration file
