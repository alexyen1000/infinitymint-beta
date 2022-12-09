import * as Helpers from "./app/helpers";
import Console from "./app/console";
import hre, { ethers } from "hardhat";

async function main() {
	let network = hre.network;
	let console = new Console();
	console.initialize();
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
