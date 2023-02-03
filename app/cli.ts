#!/usr/bin/env node
import yargs from 'yargs';
import {startGanache} from './ganache';
import {
	executeScript,
	getConfigFile,
	logDirect,
	readSession,
	registerNetworkLogs,
	setDebugLogDisabled,
	setOnlyDefault,
	setScriptMode,
	warning,
} from './helpers';
import {InfinityMintConsoleOptions} from './interfaces';
//import things we need
import {defaultFactory} from './pipes';
import {blessedToAnsi, blessedLog} from './colours';
import {startInfinityConsole} from './web3';
import hre from 'hardhat';

let config = getConfigFile();
let options: InfinityMintConsoleOptions;

(async () => {
	setScriptMode(true);

	if (
		(yargs.argv['show-all-logs'] &&
			yargs.argv['show-all-logs'] !== 'false' &&
			(yargs.argv['show-debug-logs'] === undefined ||
				yargs.argv['show-debug-logs'] !== 'false')) ||
		(yargs.argv['show-debug-logs'] && yargs.argv['show-debug-logs'] !== 'false')
	)
		setDebugLogDisabled(false);
	else setDebugLogDisabled(true);

	//sets the network through a flag
	let session = readSession();

	if (yargs.argv['network'] != undefined)
		session.environment.defaultNetwork = yargs.argv['network'];

	if (yargs.argv['show-all-logs'] && yargs.argv['show-all-logs'] !== 'false')
		setOnlyDefault(false);
	else setOnlyDefault(true);

	//register current network pipes
	registerNetworkLogs();

	if (
		config.hardhat?.networks?.ganache !== undefined &&
		session.environment.defaultNetwork === 'ganache'
	)
		await startGanache();
	else
		warning(
			'Ganache instance has not been initialized. No connect to ganache testnet.',
		);

	//refresh the current network with the new network, this fixes ganache issues
	if (session.environment.defaultNetwork !== undefined)
		hre.changeNetwork(session.environment.defaultNetwork);

	options = {
		...(options || {}),
		...(typeof config?.console === 'object' ? config.console : {}),
	} as InfinityMintConsoleOptions;

	let infinityConsole = await startInfinityConsole({
		dontDraw: true,
		scriptMode: true,
	});

	infinityConsole.getConsoleLogs().emitter.on('log', (log, pipe) => {
		if (pipe === 'default')
			(console as any)._log(
				blessedToAnsi(defaultFactory.addColoursToString(log)),
			);
	});

	logDirect('🧱 {cyan-fg}Current network is ' + hre.network.name + '{/}');
	logDirect(
		'🧱 {cyan-fg}Current account is ' +
			infinityConsole.getAccount().address +
			'{/}',
	);

	if (yargs.argv._[0] === undefined && yargs.argv.script === undefined) {
		//no script entry here
		let scripts = infinityConsole.getScripts();
		//filter duplicate scripts
		scripts = scripts.filter((script, index) => {
			return scripts.findIndex(s => s.name === script.name) === index;
		});
		infinityConsole.log('\n{cyan-fg}{bold}Welcome to Infinity Console{/}\n');
		infinityConsole.log('{cyan-fg}Available Scripts{/}');
		scripts.forEach((script, index) => {
			infinityConsole.log(
				` => [${index}]\n\t{bold}{underline}${script.name}{/}\n\t` +
					(script.description || 'No Description Available...'),
			);
		});
	} else {
		let scriptName = yargs.argv._[0];
		let argv = yargs.argv;
		argv._ = argv._.slice(1);

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

		let script = infinityConsole.getScript(scriptName);
		let scriptArguments: any = {};

		Object.keys(argv).map((key, index) => {
			let value = argv[key];

			if (!value || value.length === 0) value = true;

			if (key[0] === '_') return;
			if (key[0] === '$' && argv._.length !== 0) {
				let index = key.split('$')[1];
				if (index === undefined) return;
				key = script.arguments[index].name;
				value = argv._[parseInt(index)] || '';
			}

			if (script.arguments[key] === undefined)
				scriptArguments[key] = {
					...(script.arguments[key] || {}),
					name: key,
					value: value,
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

		console.log(scriptArguments);

		await executeScript(
			script,
			infinityConsole.getEventEmitter(),
			{}, //gems when we get them
			scriptArguments,
			infinityConsole,
			false,
			scriptArguments['show-debug-logs']?.value || false,
		);
	}
})()
	.catch(err => {
		blessedLog(`{red-fg}{bold}Error: ${err.message}{/}`);
		blessedLog(`{red-fg}Stack: ${err.stack}{/}`);
	})
	.finally(() => {
		process.exit(0);
	});
