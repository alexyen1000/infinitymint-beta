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
} from "./app/helpers";
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

	if (isEnvSet("INFINITYMINT_PROJECT")) {
		session.environment.project =
			session.environment?.project || process.env.INFINITYMINT_PROJECT;
		saveSession(session);
	}
	if (!fs.existsSync("./artifacts")) await hre.run("compile");

	//register current network pipes
	registerNetworkPipes();
	//start ganache
	if (
		hre.config.networks?.ganache !== undefined &&
		isEnvTrue("GANACHE_EXTERNAL")
	) {
		//check for ganache and mnemonic here
	} else if (hre.config.networks?.ganache !== undefined) {
		//ask if they want to start ganache
		//start ganache here
		let obj = { ...config.ganache } as any;
		if (obj.wallet === undefined) obj.wallet = {};
		if (session.environment.ganacheMnemonic === undefined)
			throw new Error("no ganache mnemonic");

		obj.wallet.mnemonic = session.environment.ganacheMnemonic;
		saveSession(session);
		debugLog("starting ganache with menomic of: " + obj.wallet.mnemonic);

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
	} else {
		debugLog("! WARNING ! no ganache network found");
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
	await infinityConsole.initialize();
	log(
		"{green-fg}{bold}InfinityMint Online{/green-fg}{/bold} => InfinityConsole<" +
			infinityConsole.getSessionId() +
			">"
	);
	return infinityConsole;
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
	(config.console || isEnvTrue("INFINITYMINT_CONSOLE")) &&
	config.startup !== true
)
	start()
		.catch((error) => {
			console.error(error);
			process.exit(1);
		})
		.then((result) => {
			infinityConsole = result;
		});

//load infinitymint but with no blessed UI with the idea of InfinityMint being used in a stack
if (config.startup)
	load()
		.catch((error) => {
			console.error(error);
			process.exit(1);
		})
		.then((result) => {
			infinityConsole = result;
		});
