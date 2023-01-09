import hre from 'hardhat';
//import things we need
import {
	isEnvTrue,
	log,
	getConfigFile,
	logDirect,
	readSession,
} from './app/helpers';

logDirect('✨ Reading InfinityMint Config');
//get the infinitymint config file and export it
export const config = getConfigFile();
export const session = readSession();

import fs from 'fs';
import InfinityConsole from './app/console';
import {defaultFactory} from './app/pipes';
import {initializeInfinityMint, startInfinityConsole} from './app/web3';
import {
	InfinityMintConfig,
	InfinityMintConsoleOptions,
	InfinityMintTelnetOptions,
} from './app/interfaces';
import {TelnetServer} from './app/telnet';

//export helpers
export * as Helpers from './app/helpers';

//error handler
let errorHandler = (error: Error) => {
	if ((console as any)._error) (console as any)._error(error);
	console.error(error);
	Object.keys(defaultFactory.pipes || {}).forEach(pipe => {
		try {
			defaultFactory.savePipe(pipe);
		} catch (error) {}
	});
	process.exit(1);
};

/**
 * if you spawned InfinityMint through load, then this is the current infinity console instance, this will be the instance of the admin InfinityConsole if you are running through telnet
 */
export let infinityConsole: InfinityConsole;
/**
 * Starts infinitymint in the background with no UI drawing
 */
export const load = async (
	options?: InfinityMintConsoleOptions,
): Promise<InfinityConsole> => {
	options = {
		...(options || {}),
		...(typeof config?.console === 'object' ? config.console : {}),
	} as InfinityMintConsoleOptions;

	//if we arenttelnet
	if (!config.telnet) {
		await initializeInfinityMint(
			config,
			hre.config.networks.ganache !== undefined,
		);

		if (!fs.existsSync('./artifacts')) await hre.run('compile');

		//do not start an InfinityConsole normally if we have nothing in config, run InfinityMint as NPM module in the back
		if (!config.console && !config.startup && !config.telnet)
			return new InfinityConsole(
				{...(options || {}), dontDraw: true},
				defaultFactory,
			);

		return await startInfinityConsole(
			{
				...(options || {}),
				dontDraw:
					config.startup ||
					(config.console === false &&
						config.console === undefined &&
						!isEnvTrue('INFINITYMINT_CONSOLE')),
			},
			defaultFactory,
		);
	} else {
		await new Promise((resolve, reject) => {
			logDirect('🔷 Starting InfinityMint Telnet Server');
			initializeInfinityMint(
				config.console as any,
				hre.config.networks.ganache !== undefined,
			).then((config: InfinityMintConfig) => {
				let port = (config?.telnet as InfinityMintTelnetOptions)?.port || 1337;
				let telnet = new TelnetServer();
				telnet.start(port);
			});
		})
			.catch(errorHandler)
			.then(() => {
				logDirect('🔷 Destroying InfinityMint Telnet Server');
				process.exit(0);
			});
	}
};

const infinitymint = () => {
	return infinityConsole;
};
export default infinitymint;

//load infinitymint
load()
	.catch(errorHandler)
	.then((result: InfinityConsole) => {
		infinityConsole = result;
	});
