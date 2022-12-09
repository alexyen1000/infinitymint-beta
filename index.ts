import * as Helpers from "./app/helpers";
import hre, { ethers } from "hardhat";
import Console from "./app/console";

async function main() {
	let console = new Console();
	let network = hre.network;

	console.initialize();
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
