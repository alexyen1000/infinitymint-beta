#!/usr/bin/env ts-node --esm --script-mode --transpileOnly
import hre from 'hardhat';
let loadHre = hre.artifacts; // load hardhat runtime environment
import {createDefaultFactory} from './app/pipes';
import dotEnv from 'dotenv';
dotEnv.config({
	override: false, //will not override already established environment variables
});
createDefaultFactory();
import './app/cli';
