import InfinityConsole from './app/console';
import hre from 'hardhat';
import {
	getPrivateKeys,
	registerNetworkLogs as registerNetworkPipes,
	startNetworkPipe,
} from './app/web3';
import GanacheServer from './app/ganache';
import {Web3Provider} from '@ethersproject/providers';
import fs from 'fs';

//import things we need
import {
	isEnvTrue,
	debugLog,
	readSession,
	log,
	saveSession,
	getSolidityFolder,
	getConfigFile,
	isEnvSet,
	warning,
	logDirect,
	BlessedElement,
	allowPiping,
} from './app/helpers';
import {defaultFactory as Pipes} from './app/pipes';
import {
	InfinityMintConfig,
	InfinityMintConsoleOptions,
	InfinityMintTelnetOptions,
} from './app/interfaces';

//export helpers
export * as Helpers from './app/helpers';

log('reading infinitymint.config.ts');
//get the infinitymint config file and export it
export const config = getConfigFile();

export const init = async (options: InfinityMintConsoleOptions) => {
	let session = readSession();
	if (!fs.existsSync('./artifacts')) await hre.run('compile');

	//allow piping
	allowPiping();
	//
	logDirect('🪐 Starting InfinityConsole');
	//register current network pipes
	registerNetworkPipes();
	try {
		//create IPFS node
	} catch (error) {
		warning(`could not start IPFS: ` + error?.message);
	}

	//start ganache
	if (hre.config.networks?.ganache !== undefined) {
		try {
			//ask if they want to start ganache
			//start ganache here
			let obj = {...config.ganache} as any;
			if (obj.wallet === undefined) obj.wallet = {};
			if (session.environment.ganacheMnemonic === undefined)
				throw new Error('no ganache mnemonic');

			obj.wallet.mnemonic = session.environment.ganacheMnemonic;
			saveSession(session);
			debugLog('starting ganache with menomic of: ' + obj.wallet.mnemonic);

			//get private keys and save them to file
			let keys = getPrivateKeys(session.environment.ganacheMnemonic);
			debugLog(
				'found ' +
					keys.length +
					' private keys for mnemonic: ' +
					session.environment.ganacheMnemonic,
			);
			keys.forEach((key, index) => {
				debugLog(`[${index}] => ${key}`);
			});
			session.environment.ganachePrivateKeys = keys;
			saveSession(session);

			let provider = await GanacheServer.start(obj);
			startNetworkPipe(provider as Web3Provider, 'ganache');
		} catch (error) {
			warning('could not start ganache: ' + error);
		}
	} else {
		warning('no ganache network found');
	}

	let artifacts = hre.artifacts;
	let contracts = await artifacts.getAllFullyQualifiedNames();

	debugLog(
		'found ' +
			contracts.length +
			' compiled contracts in solidity root (' +
			getSolidityFolder() +
			')',
	);

	//start a network pipe if we aren't ganache as we do something different if we are
	if (hre.network.name !== 'ganache') startNetworkPipe();
	//initialize console
	return config;
};

//function to launch the console
export const start = async (options?: InfinityMintConsoleOptions) => {
	debugLog(
		'starting InfinityConsole with solidity root of ' + getSolidityFolder(),
	);

	let infinityConsole = new InfinityConsole(options);
	logDirect(
		'💭 Initializing InfinityConsole<' + infinityConsole.getSessionId() + '>',
	);
	await infinityConsole.initialize();
	log(
		'{green-fg}{bold}InfinityMint Online{/green-fg}{/bold} => InfinityConsole<' +
			infinityConsole.getSessionId() +
			'>',
	);
	return infinityConsole;
};

const telnet = require('telnet2');
/**
 *
 * @param port
 */
export const startTelnet = (port?: number) => {
	port = port || 1337;
	logDirect('🖥️  Listening on port ' + port);
	telnet({tty: true}, client => {
		(async () => {
			let screen: BlessedElement;
			try {
				infinityConsole = await start({
					blessed: {
						smartCSR: true,
						input: client,
						output: client,
						terminal: 'xterm-256color',
						fullUnicode: true,
					},
				});
				infinityConsole.setUser(client);
				screen = infinityConsole.getScreen();

				client.on('term', function (terminal) {
					screen.terminal = terminal;
					screen.render();
				});

				logDirect(
					`🦊 New Connection ${
						client.remoteAddress ||
						client.output.remoteAddress ||
						client.input.remoteAddress
					}<${infinityConsole.getSessionId()}>`,
				);
			} catch (error) {
				logDirect(`💥 error<${client.input.remoteAddress}>:\n${error.stack}`);
				return;
			}

			//when its resizes
			client.on('size', function (width, height) {
				client.columns = width;
				client.rows = height;
				client.emit('resize');
			});

			//when the client closes
			client.on('close', function () {
				logDirect(
					`💀 Disconnected ${
						client.remoteAddress || client.input.remoteAddress
					}`,
				);
			});

			//screen on
			screen.on('destroy', function () {
				if (client.writable) {
					client.destroy();
				}
			});
		})();
	}).listen(port);
};

/**
 * if you spawned InfinityMint through load, then this is the current infinity console instance
 */
let infinityConsole: InfinityConsole;
/**
 * Starts infinitymint in the background with no UI drawing
 */
export const load = async (
	options?: InfinityMintConsoleOptions,
	dontDraw?: boolean,
): Promise<InfinityConsole> => {
	options = {
		...(options || {}),
		...(typeof config?.console === 'object' ? config.console : {}),
	} as InfinityMintConsoleOptions;
	await init(options);
	return await start({
		...(options || {}),
		dontDraw: dontDraw,
	});
};
export const infinitymint = infinityConsole as InfinityConsole;
export default infinitymint;

//if module_mode is false we are running infinitymint normally, if not we are going to not and just return our exports
if (
	!config.telnet &&
	(config.console || isEnvTrue('INFINITYMINT_CONSOLE')) &&
	!config.startup &&
	!isEnvTrue('INFINITYMINT_TELNET')
)
	load()
		.catch(error => {
			if ((console as any)._error) (console as any)._error(error);
			console.error(error);
			Object.keys(Pipes.pipes || {}).forEach(pipe => {
				try {
					Pipes.savePipe(pipe);
				} catch (error) {}
			});
			process.exit(1);
		})
		.then((result: InfinityConsole) => {
			infinityConsole = result;
		});

//load infinitymint but with no blessed UI with the idea of InfinityMint being used in a stack
if (
	config.startup &&
	!config.telnet &&
	!config.console &&
	!isEnvTrue('INFINITYMINT_CONSOLE') &&
	!isEnvTrue('INFINITYMINT_TELNET')
)
	load({}, true)
		.catch(error => {
			if ((console as any)._error) (console as any)._error(error);
			console.error(error);
			Object.keys(Pipes.pipes || {}).forEach(pipe => {
				try {
					Pipes.savePipe(pipe);
				} catch (error) {}
			});
			process.exit(1);
		})
		.then((result: InfinityConsole) => {
			infinityConsole = result;
		});

if (
	(config.telnet || isEnvTrue('INFINITYMINT_TELNET')) &&
	!config.startup &&
	!config.console &&
	!isEnvTrue('INFINITYMINT_CONSOLE')
)
	try {
		logDirect('🔷 Starting InfinityMint Telnet Server');
		init(config.console as any).then((config: InfinityMintConfig) => {
			let port = (config?.telnet as InfinityMintTelnetOptions)?.port || 1337;
			startTelnet(port);
			logDirect(
				'🟢 Telnet Server Online! enter line below to connect\n\tbrew install telnet && telnet localhost ' +
					port,
			);
		});
	} catch (error) {
		if ((console as any)._error) (console as any)._error(error);
		console.error(error);
		Object.keys(Pipes.pipes || {}).forEach(pipe => {
			try {
				Pipes.savePipe(pipe);
			} catch (error) {}
		});
		process.exit(1);
	}
