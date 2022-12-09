import { InfinityMintConsole } from "./config";
import { debugLog, log } from "./helpers";
import { InfinityMintWindow } from "./window";
import hre, { ethers } from "hardhat";

//windows
import ConsoleWindow from "./windows/logs";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import Menu from "./windows/menu";

const blessed = require("blessed");
export default class Console {
	private screen: any;
	private options?: InfinityMintConsole;

	protected currentWindow?: InfinityMintWindow;
	protected windows: InfinityMintWindow[];
	protected canExit: boolean;

	private interval?: any;
	private network?: HardhatRuntimeEnvironment["network"];
	private signers?: SignerWithAddress[];

	constructor(options?: InfinityMintConsole) {
		this.screen = blessed.screen(
			options?.blessed || {
				smartCRS: true,
				dockBorders: true,
			}
		);
		this.windows = [];
		this.canExit = true;
		this.options = options;
	}

	public changeNetwork() {}

	public getSigner(): SignerWithAddress {
		if (this.signers === undefined)
			throw new Error(
				"signers must be initialized before getting signer"
			);

		return this.signers[0];
	}

	public getSigners(): SignerWithAddress[] {
		if (this.signers === undefined)
			throw new Error(
				"signers must be initialized before getting signer"
			);

		return this.signers;
	}

	public async initialize() {
		if (this.network !== undefined)
			throw new Error("console already initialized");

		this.network = hre.network;
		this.windows = [ConsoleWindow, Menu];
		this.currentWindow = this.windows[0];
		this.currentWindow.setScreen(this.screen);

		log(
			"initializing InfinityConsole chainId " +
				this.network.config.chainId +
				" network name " +
				this.network.name
		);

		debugLog("getting signers");
		this.signers = await ethers.getSigners();
		debugLog("found " + this.signers.length + " signers");
		this.signers.forEach((signer, index) => {
			debugLog(`${index} => ${signer.address}`);
		});
		log("default account: " + this.signers[0].address);

		//register escape key
		this.screen.key(["escape", "q", "C-c"], (ch: string, key: string) => {
			if (this.canExit) return process.exit(0);
			else debugLog("not allowed to exit but user wants to exit");
		});

		this.screen.key(["show", "s"], (ch: string, key: string) => {
			this.currentWindow?.show();
		});
		this.screen.key(["hide", "h"], (ch: string, key: string) => {
			this.currentWindow?.hide();
		});

		//creating window manager

		let list = blessed.list({
			label: " {bold}{white-fg}Windows{/white-fg} (Enter/Double-Click to hide/show){/bold}",
			tags: true,
			top: "center",
			left: "center",
			width: "95%",
			height: "shrink",
			padding: 3,
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
		});

		this.screen.append(list);
		await this.currentWindow.create();

		this.screen.render();

		this.interval = setInterval(() => {
			if (this.currentWindow) this.currentWindow.update();
			this.screen.render();
			list.setItems(
				[...this.windows].map(
					(window) =>
						window.name +
						(window.isAlive()
							? ` [${window.isVisible() ? "VISIBLE" : "HIDDEN"}]`
							: ` (dead)`)
				)
			);
			this.screen.render();
		}, 33);

		list.on("select", async (el: Element, selected: any) => {
			if (!this.windows[selected].isAlive()) {
				debugLog(
					"tried to select a dead window: " +
						this.windows[selected].name
				);
				return;
			}
			if (!this.windows[selected].hasInitialized()) {
				this.windows[selected].setScreen(this.screen);
				await this.windows[selected].create();
			}

			if (!this.windows[selected].isVisible())
				this.windows[selected].show();
			else this.windows[selected].hide();
			this.currentWindow = this.windows[selected];
			this.screen.render();
		});
	}
}
