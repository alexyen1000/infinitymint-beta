#!/usr/bin/env node
import yargs from 'yargs';
import {startGanache} from './ganache';
import {
	executeScript,
	getConfigFile,
	registerNetworkLogs,
	warning,
} from './helpers';
import {InfinityMintConsoleOptions} from './interfaces';
//import things we need
import {defaultFactory} from './pipes';
import {blessedToAnsi} from './colours';
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

	let infinityConsole = await startInfinityConsole(
		{
			dontDraw: true,
			scriptMode: true,
		},
		defaultFactory,
	);

	infinityConsole.getConsoleLogs().emitter.on('log', log => {
		(console as any)._log(blessedToAnsi(log));
	});

	if (yargs.argv._[0] === undefined && yargs.argv.script === undefined) {
		//no script entry here
		let scripts = infinityConsole.getScripts();
		//filter duplicate scripts
		scripts = scripts.filter((script, index) => {
			return scripts.findIndex(s => s.name === script.name) === index;
		});
		infinityConsole.log('Available Scripts:');
		scripts.forEach(script => {
			infinityConsole.log(
				script.name +
					' - ' +
					(script.description || 'No Description Available...'),
			);
		});
	} else {
		let scriptName = yargs.argv._[0];

		if (
			infinityConsole
				.getScripts()
				.filter(
					script =>
						script.name.toLowerCase() === scriptName.toLowerCase() ||
						script.fileName.split('.')[0].toLowerCase() ===
							scriptName.toLowerCase(),
				).length === 0
		)
			throw new Error('script ' + scriptName + ' does not exist.');

		infinityConsole.log(yargs.argv);

		let script = infinityConsole.getScript(scriptName);
		let scriptArguments: any = {};
		Object.keys(yargs.argv).map((key, index) => {
			let value = yargs.argv[key];

			if (key[0] === '_') return;
			if (key[0] === '$') {
				let index = key.split('$')[1];
				if (index === undefined) return;
				key = Object.keys(script.arguments)[index];
				value = value[index];
			}

			scriptArguments[key] = {
				...(script.arguments[key] || {}),
				key: value,
				value,
			};

			if (scriptArguments[key].type === 'boolean') {
				if (value === 'true') scriptArguments[key].value = true;
				else if (value === 'false') scriptArguments[key].value = false;
				else
					throw new Error(
						'Invalid value for boolean argument: ' +
							key +
							' (expected true or false)',
					);
			}

			if (scriptArguments[key].type === 'number') {
				if (isNaN(value))
					throw new Error(
						'Invalid value for number argument: ' + key + ' (expected number)',
					);
				else scriptArguments[key].value = parseInt(value);
			}

			if (
				scriptArguments[key].validator &&
				scriptArguments[key].validator(scriptArguments[key].value) === false
			)
				throw new Error(
					'Invalid value for argument: ' + key + ' (failed validator',
				);
		});

		Object.values(script.arguments).forEach(arg => {
			if (!arg.optional && !scriptArguments[arg.name])
				throw new Error('Missing required argument: ' + arg.name);
		});

		await executeScript(
			script,
			infinityConsole.getEventEmitter(),
			{}, //gems when we get them
			scriptArguments,
			infinityConsole,
			false,
		);
	}
})()
	.catch(err => {
		console.error(err);
	})
	.finally(() => {
		process.exit(0);
	});
