#!/usr/bin/env ts-node
import 'ts-node';
import main from 'ts-node';
import { createDefaultFactory } from './dist/app/pipes.js';
createDefaultFactory();
main.register();
import('./dist/app/cli.js');