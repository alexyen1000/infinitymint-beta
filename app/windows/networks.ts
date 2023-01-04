import { InfinityMintWindow } from "../window";
import hre from "hardhat";
import { readSession, saveSession } from "../helpers";
import { changeNetwork } from "../web3";

const Networks = new InfinityMintWindow("Networks");

Networks.initialize = async (window, frame, blessed) => {
	let form = window.registerElement(
		"form",
		blessed.list({
			label: " {bold}{white-fg}Select Network{/white-fg} (Enter/Double-Click to select){/bold}",
			tags: true,
			top: "center",
			left: "center",
			width: "95%",
			height: "60%",
			padding: 2,
			keys: true,
			vi: true,
			mouse: true,
			border: "line",
			scrollbar: {
				ch: " ",
				track: {
					bg: "black",
				},
				style: {
					inverse: true,
				},
			},
			style: {
				bg: "grey",
				fg: "white",
				item: {
					hover: {
						bg: "white",
					},
				},
				selected: {
					bg: "white",
					bold: true,
				},
			},
		})
	);
	let keys = Object.keys(hre.config.networks);
	form.setItems(keys);
	form.on("select", async (el: any, selected: any) => {
		let session = readSession();
		await window.getInfinityConsole().changeNetwork(keys[selected]);
		session.environment.defaultNetwork = keys[selected];
		saveSession(session);
	});
	form.focus();
};

export default Networks;
