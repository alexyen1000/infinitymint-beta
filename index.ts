import * as Helpers from "./app/helpers";
import InfinityConsole from "./app/console";
import hre, { ethers } from "hardhat";
import { registerNetworkPipes, startNetworkPipe } from "./app/web3";

async function main() {
	//only purpose of this code is to pull in the hre first so its already loaded, typescript won't execute unused imports
	let artifacts = hre.artifacts;
	let contracts = await artifacts.getAllFullyQualifiedNames();
	Helpers.log("found " + contracts.length + " compiled contracts");
	contracts.forEach((contract) =>
		Helpers.debugLog("found contract: " + contract)
	);

	registerNetworkPipes(); //reads the hardhat configuration networks object and creates pipes for all of them
	startNetworkPipe(); //starts listening on the provider for events on the current network and feeds it to the pipe

	//initialize console
	let infinityConsole = new InfinityConsole();
	await infinityConsole.initialize();
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
