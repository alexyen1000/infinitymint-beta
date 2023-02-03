#!/usr/bin/env ts-node --esm --script-mode --transpileOnly
import hre from 'hardhat';
let loadHre = hre.artifacts; // load hardhat runtime environment
import {createDefaultFactory} from 'infinitymint/app/pipes';
createDefaultFactory();
import './app/cli';
