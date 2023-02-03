#!/usr/bin/env ts-node
import hre from 'hardhat';
let loadHre = hre.artifacts; // load hardhat runtime environment
import dotEnv from 'dotenv';
dotEnv.config({
	override: false, //will not override already established environment variables
});
import {isInfinityMint} from 'infinitymint/dist/app/helpers';

if (isInfinityMint()) require('./app/cli');
else require('infinitymint/dist/app/cli');
