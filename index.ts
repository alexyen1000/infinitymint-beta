import InfinityConsole from "./app/console";
import hre from "hardhat";
import {
	getPrivateKeys,
	registerNetworkPipes,
	startNetworkPipe,
} from "./app/web3";
import GanacheServer from "./app/ganacheServer";
import { Web3Provider } from "@ethersproject/providers";
import fs from "fs";

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
} from "./app/helpers";
import Pipes from "./app/pipes";
import { InfinityMintConsoleOptions } from "./app/interfaces";

//export helpers
export * as Helpers from "./app/helpers";

log("reading infinitymint.config.ts");
//get the infinitymint config file and export it
export const config = getConfigFile();

//function to launch the console
export const start = async (options?: InfinityMintConsoleOptions) => {
	options = {
		...(options || {}),
		...(typeof config?.console === "object" ? config.console : {}),
	} as InfinityMintConsoleOptions;
	let session = readSession();
	if (!fs.existsSync("./artifacts")) await hre.run("compile");

	logDirect("starting infinity console");
	//register current network pipes
	registerNetworkPipes();

	//start ganache
	if (hre.config.networks?.ganache !== undefined) {
		try {
			//ask if they want to start ganache
			//start ganache here
			let obj = { ...config.ganache } as any;
			if (obj.wallet === undefined) obj.wallet = {};
			if (session.environment.ganacheMnemonic === undefined)
				throw new Error("no ganache mnemonic");

			obj.wallet.mnemonic = session.environment.ganacheMnemonic;
			saveSession(session);
			debugLog(
				"starting ganache with menomic of: " + obj.wallet.mnemonic
			);

			//get private keys and save them to file
			let keys = getPrivateKeys(session.environment.ganacheMnemonic);
			debugLog(
				"found " +
					keys.length +
					" private keys for mnemonic: " +
					session.environment.ganacheMnemonic
			);
			keys.forEach((key, index) => {
				debugLog(`[${index}] => ${key}`);
			});
			session.environment.ganachePrivateKeys = keys;
			saveSession(session);

			let provider = await GanacheServer.start(obj);
			startNetworkPipe(provider as Web3Provider, "ganache");
		} catch (error) {
			warning("could not start ganache: " + error);
		}
	} else {
		warning("no ganache network found");
	}

	let artifacts = hre.artifacts;
	let contracts = await artifacts.getAllFullyQualifiedNames();

	debugLog(
		"found " +
			contracts.length +
			" compiled contracts in solidity root (" +
			getSolidityFolder() +
			")"
	);

	//start a network pipe if we aren't ganache as we do something different if we are
	if (hre.network.name !== "ganache") startNetworkPipe();
	//initialize console

	debugLog(
		"starting InfinityConsole with solidity root of " + getSolidityFolder()
	);

	let infinityConsole = new InfinityConsole(options);
	logDirect("initializing...");
	await infinityConsole.initialize();
	log(
		"{green-fg}{bold}InfinityMint Online{/green-fg}{/bold} => InfinityConsole<" +
			infinityConsole.getSessionId() +
			">"
	);
	return infinityConsole;
};

export const telnet = require("telnet2");
export const startTelnet = () => {
	logDirect("starting telnet server on port 2000 with basic permissions");
	telnet({ tty: true }, (client) => {
		(async () => {
			let screen: BlessedElement;
			try {
				infinityConsole = await start({
					blessed: {
						smartCSR: true,
						input: client,
						output: client,
						terminal: "xterm-256color",
						fullUnicode: true,
					},
				});
				screen = infinityConsole.getScreen();

				client.on("term", function (terminal) {
					screen.terminal = terminal;
					screen.render();
				});

				logDirect(client.input.remoteAddress + " connected");
			} catch (error) {
				logDirect(
					client.input.remoteAddress + " error: " + error?.message
				);
				return;
			}

			//when its resizes
			client.on("size", function (width, height) {
				client.columns = width;
				client.rows = height;
				client.emit("resize");
			});

			//when the client closes
			client.on("close", function () {
				logDirect(client.remoteAddress + " disconnected");
			});

			//screen on
			screen.on("destroy", function () {
				if (client.writable) {
					client.destroy();
				}
			});
		})();
	}).listen(2000);
};

/**
 * if you spawned InfinityMint through load, then this is the current infinity console instance
 */
let infinityConsole: InfinityConsole;
/**
 * Starts infinitymint in the background with no UI drawing
 */
export const load = async (
	options?: InfinityMintConsoleOptions
): Promise<InfinityConsole> => {
	return await start({
		...(options || {}),
		dontDraw: true,
	});
};
export const infinitymint = infinityConsole as InfinityConsole;
export default infinitymint;

//if module_mode is false we are running infinitymint normally, if not we are going to not and just return our exports
if (
	!config.telnet &&
	(config.console || isEnvTrue("INFINITYMINT_CONSOLE")) &&
	!config.startup
)
	start()
		.catch((error) => {
			if ((console as any)._error) (console as any)._error(error);
			console.error(error);
			process.exit(1);
		})
		.then((result: InfinityConsole) => {
			infinityConsole = result;
		})
		.finally(() => {
			Object.keys(Pipes.pipes || {}).forEach((pipe) => {
				try {
					Pipes.savePipe(pipe);
				} catch (error) {}
			});
		});

//load infinitymint but with no blessed UI with the idea of InfinityMint being used in a stack
if (
	!config.telnet &&
	config.startup &&
	!config.console &&
	!isEnvTrue("INFINITYMINT_CONSOLE")
)
	load()
		.catch((error) => {
			if ((console as any)._error) (console as any)._error(error);
			console.error(error);
			process.exit(1);
		})
		.then((result: InfinityConsole) => {
			infinityConsole = result;
		})
		.finally(() => {
			Object.keys(Pipes.pipes || {}).forEach((pipe) => {
				try {
					Pipes.savePipe(pipe);
				} catch (error) {}
			});
		});

if (
	config.telnet &&
	!config.startup &&
	!config.console &&
	!isEnvTrue("INFINITYMINT_CONSOLE")
)
	try {
		startTelnet();
	} catch (error) {
		if ((console as any)._error) (console as any)._error(error);
		console.error(error);
		Object.keys(Pipes.pipes || {}).forEach((pipe) => {
			try {
				Pipes.savePipe(pipe);
			} catch (error) {}
		});
		process.exit(1);
	}
