import * as Helpers from "./app/helpers";
import InfinityConsole from "./app/console";
import hre, { ethers } from "hardhat";
import { registerNetworkPipes, startNetworkPipe } from "./app/web3";

async function main() {
	let artifacts = hre.artifacts;
	let contracts = await artifacts.getAllFullyQualifiedNames();
	Helpers.log("found " + contracts.length + " compiled contracts");
	contracts.forEach((contract) =>
		Helpers.debugLog("found contract: " + contract)
	);

	registerNetworkPipes();
	startNetworkPipe();

	//initialize console
	let infinityConsole = new InfinityConsole();
	await infinityConsole.initialize();
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
