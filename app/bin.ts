#!/usr/bin/env node
import yargs from 'yargs';
import {startGanache} from './ganache';
import {
	executeScript,
	getConfigFile,
	logDirect,
	registerNetworkLogs,
	warning,
} from './helpers';
import {InfinityMintConsoleOptions} from './interfaces';
//import things we need
import {defaultFactory} from './pipes';
import {startInfinityConsole} from './web3';

let config = getConfigFile();
let options: InfinityMintConsoleOptions;

//require index.ts with __BIN set to true
(async () => {
	//register current network pipes
	registerNetworkLogs();
	//start ganache
	if (config.hardhat?.networks?.ganache !== undefined) await startGanache();
	else
		warning(
			'Ganache instance has not been initialized. No connect to ganache testnet.',
		);

	options = {
		...(options || {}),
		...(typeof config?.console === 'object' ? config.console : {}),
	} as InfinityMintConsoleOptions;

	let console = await startInfinityConsole(
		{
			dontDraw: true,
		},
		defaultFactory,
	);

	console.getConsoleLogs().emitter.on('log', log => {
		logDirect(log);
	});

	if (yargs.argv._ === undefined || yargs.argv.script === undefined) {
		//no script entry here
		let scripts = console.getScripts();
		//filter duplicate scripts
		scripts = scripts.filter((script, index) => {
			return scripts.findIndex(s => s.name === script.name) === index;
		});
		console.log('Available Scripts:');
		scripts.forEach(script => {
			console.log(
				script.name +
					' - ' +
					(script.description || 'No Description Available...'),
			);
		});
	} else {
		let scriptName = yargs.argv._[0];

		if (
			console.getScripts().filter(script => script.name === scriptName)
				.length === 0
		)
			throw new Error('script ' + scriptName + 'does not exist.');

		await executeScript(
			yargs.argv._,
			console.getEventEmitter(),
			{},
			yargs.argv,
			console,
		);
	}
})()
	.catch(err => {
		console.error(err);
	})
	.finally(() => {
		process.exit(0);
	});
