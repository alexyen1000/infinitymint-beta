import * as Helpers from "./app/helpers";
import InfinityConsole from "./app/console";
import hre, { ethers } from "hardhat";
import {
	getPrivateKeys,
	registerNetworkPipes,
	startNetworkPipe,
} from "./app/web3";
import GanacheServer from "./app/ganacheServer";
import config from "./infinitymint.config";
import { Web3Provider } from "@ethersproject/providers";

async function main() {
	let session = Helpers.readSession();
	//register current network pipes
	registerNetworkPipes();
	//start ganache
	if (
		hre.config.networks?.ganache !== undefined &&
		Helpers.isEnvTrue("GANACHE_EXTERNAL")
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
		Helpers.saveSession(session);
		Helpers.debugLog(
			"starting ganache with menomic of: " + obj.wallet.mnemonic
		);

		//get private keys and save them to file
		let keys = getPrivateKeys(session.environment.ganacheMnemomic);
		Helpers.debugLog(
			"found " +
				keys.length +
				" private keys for mnemonic: " +
				session.environment.ganacheMnemomic
		);
		keys.forEach((key, index) => {
			Helpers.debugLog(`[${index}] => ${key}`);
		});
		session.environment.ganachePrivateKeys = keys;
		Helpers.saveSession(session);

		let provider = await GanacheServer.start(obj);
		startNetworkPipe(provider as Web3Provider, "ganache");
	} else {
		Helpers.debugLog("! WARNING ! no ganache network found");
	}

	let artifacts = hre.artifacts;
	let contracts = await artifacts.getAllFullyQualifiedNames();

	Helpers.debugLog("found " + contracts.length + " compiled contracts");
	contracts.forEach((contract, index) => {
		let split = contract.split(":");
		Helpers.debugLog(`[${index}] => (${split[1]}) => ${split[0]}`);
	});

	//start a network pipe if we aren't ganache as we do something different if we are
	if (hre.network.name !== "ganache") startNetworkPipe();
	//initialize console

	Helpers.debugLog("starting InfinityConsole");
	let infinityConsole = new InfinityConsole();
	await infinityConsole.initialize();
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
