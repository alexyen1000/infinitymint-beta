import * as Helpers from "./app/helpers";
import hre, { ethers } from "hardhat";

import Menu from "./app/windows/menu";
const blessed = require("blessed");
async function main() {
	let network = hre.network;

	console.log("test");
	Helpers.log("test 2");
	Helpers.log("test 3");

	let screen = blessed.screen({
		smartCRS: true,
	});
	// Quit on Escape, q, or Control-C.
	screen.key(["escape", "q", "C-c"], (ch: string, key: string) => {
		return process.exit(0);
	});
	//set the screen to render on
	Menu.setScreen(screen);

	//create the menu
	Menu.create();

	//render it
	screen.render();
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
