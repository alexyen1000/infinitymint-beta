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
	log("starting infinitymint");
	let session = readSession();

	debugLog("printing hardhat tasks");
	Object.values(hre.tasks).forEach((task, index) => {
		debugLog(`[${index}] => ${task.name}`);
	});

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
		if (session.environment.ganacheMnemomic === undefined)
			throw new Error("no ganache mnemonic");

		obj.wallet.mnemonic = session.environment.ganacheMnemomic;
		saveSession(session);
		debugLog("starting ganache with menomic of: " + obj.wallet.mnemonic);

		//get private keys and save them to file
		let keys = getPrivateKeys(session.environment.ganacheMnemomic);
		debugLog(
			"found " +
				keys.length +
				" private keys for mnemonic: " +
				session.environment.ganacheMnemomic
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
	contracts.forEach((contract, index) => {
		let split = contract.split(":");
		debugLog(`[${index}] => (${split[1]}) => ${split[0]}`);
	});

	//start a network pipe if we aren't ganache as we do something different if we are
	if (hre.network.name !== "ganache") startNetworkPipe();
	//initialize console

	debugLog(
		"starting InfinityConsole with solidity root of " + getSolidityFolder()
	);

	let infinityConsole = new InfinityConsole(options);
	await infinityConsole.initialize();
	return infinityConsole;
};

/**
 * Starts infinitymint in the background with no UI drawing
 */
let infinityConsole: InfinityConsole;
export const load = async (
	options?: InfinityMintConsoleOptions
): Promise<InfinityConsole> => {
	infinityConsole = await start({
		...(options || {}),
		dontDraw: true,
	});
	return infinityConsole;
};
export const infinitymint = infinityConsole as InfinityConsole;
export default load();

//if module_mode is false we are running infinitymint normally, if not we are going to not and just return our exports
if (config.console)
	start().catch((error) => {
		console.error(error);
		process.exit(1);
	});
