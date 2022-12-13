import * as Helpers from "./app/helpers";
import InfinityConsole from "./app/console";
import hre, { ethers } from "hardhat";
import { registerNetworkPipes, startNetworkPipe } from "./app/web3";
import GanacheServer from "./app/ganacheServer";
import config from "./infinitymint.config";

async function main() {
	let artifacts = hre.artifacts;
	let contracts = await artifacts.getAllFullyQualifiedNames();
	let session = Helpers.readSession();

	//only purpose of this code is to pull in the hre first so its already loaded, typescript won't execute unused imports
	Helpers.log("found " + contracts.length + " compiled contracts");
	contracts.forEach((contract) =>
		Helpers.debugLog("found contract: " + contract)
	);

	registerNetworkPipes(); //reads the hardhat configuration networks object and creates pipes for all of them

	if (
		hre.config.networks?.ganache !== undefined &&
		Helpers.isEnvTrue("GANACHE_EXTERNAL")
	) {
		//check for ganache and mnemonic here
	} else if (hre.config.networks?.ganache !== undefined) {
		//ask if they want to start ganache
		//start ganache here
		let obj = { ...config.ganache };
		obj.wallet.mnemonic = session.environment.ganacheMnemonic;
		GanacheServer.start(obj);
	} else {
		Helpers.debugLog("! WARNING ! no ganache network found");
	}

	startNetworkPipe(); //starts listening on the provider for events on the current network and feeds it to the pipe

	//initialize console
	let infinityConsole = new InfinityConsole();
	await infinityConsole.initialize();
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
