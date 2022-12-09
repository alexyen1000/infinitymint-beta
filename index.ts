import * as Helpers from "./app/helpers";
import InfinityConsole from "./app/console";
import hre, { ethers } from "hardhat";
import Pipes from "./app/pipes";

async function main() {
	let artifacts = hre.artifacts;
	let contracts = await artifacts.getAllFullyQualifiedNames();
	Helpers.log("found " + contracts.length + " compiled contracts");
	contracts.forEach((contract) =>
		Helpers.debugLog("found contract: " + contract)
	);

	//TODO: Move somewhee else?
	//create a pipe for the provider/network name so we can log stuff there for that network
	Pipes.registerSimplePipe(hre.network.name);
	//register events
	ethers.provider.on("block", (blockNumber) => {
		Helpers.log("new block: #" + blockNumber, hre.network.name);
	});
	ethers.provider.on("pending", (tx) => {
		Helpers.log("new transaction pending: " + tx.toString());
	});
	ethers.provider.on("error", (tx) => {
		Helpers.log("tx error: " + tx.toString());
	});

	//initialize console
	let infinityConsole = new InfinityConsole();
	await infinityConsole.initialize();
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
