import { InfinityMintConsole } from "./config";
import { debugLog, log } from "./helpers";
import { InfinityMintWindow } from "./window";
import hre, { ethers } from "hardhat";

//windows
import Logs from "./windows/logs";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import Menu from "./windows/menu";
import Browser from "./windows/browser";
import Deployments from "./windows/deployments";
import Gems from "./windows/gems";
import Networks from "./windows/networks";
import Scaffold from "./windows/scaffold";
import Scripts from "./windows/scripts";
import Settings from "./windows/settings";
import Deploy from "./windows/deploy";
import Tutorial from "./windows/tutorial";
import Projects from "./windows/projects";

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
	private windowManager?: any;

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

	public registerEvents() {
		if (this.currentWindow === undefined) return;
		//when the window is destroyed, rebuild the items list

		debugLog("registering events for " + this.currentWindow.name);
		//so we only fire once
		if (this.currentWindow.options.destroy)
			this.currentWindow.off(
				"destroy",
				this.currentWindow.options.destroy
			);
		this.currentWindow.options.destroy = this.currentWindow.on(
			"destroy",
			() => {
				this.setListItems();
			}
		);

		//so we only fire once
		if (this.currentWindow.options.hide)
			this.currentWindow.off("hude", this.currentWindow.options.hude);
		//when the current window is hiden, rebuild the item
		this.currentWindow.options.hide = this.currentWindow.on("hide", () => {
			this.setListItems();
		});
	}

	public setListItems() {
		this.windowManager.setItems(
			[...this.windows].map(
				(window) =>
					window.name +
					" " +
					(window.isAlive() ? "(alive)" : "(dead)")
			)
		);
	}

	public async initialize() {
		if (this.network !== undefined)
			throw new Error("console already initialized");

		this.network = hre.network;
		this.windows = [
			Menu,
			Tutorial,
			Projects,
			Logs,
			Browser,
			Deployments,
			Gems,
			Networks,
			Scaffold,
			Scripts,
			Settings,
			Deploy,
		];
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

		//creating window manager
		this.windowManager = blessed.list({
			label: " {bold}{white-fg}Windows{/white-fg} (Enter/Double-Click to hide/show, press Z to refresh){/bold}",
			tags: true,
			top: "center",
			left: "center",
			width: "95%",
			height: "95%",
			padding: 2,
			keys: true,
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

		this.windowManager.on("select", async (el: Element, selected: any) => {
			//disable the select if the current window is visible
			if (this.currentWindow?.isVisible()) return;
			if (!this.windows[selected].isAlive()) {
				debugLog(
					"tried to select a dead window: " +
						this.windows[selected].name
				);
				return;
			}
			this.currentWindow = this.windows[selected];
			if (!this.currentWindow.hasInitialized()) {
				this.currentWindow.setScreen(this.screen);
				await this.windows[selected].create();
				this.registerEvents();
			} else if (!this.currentWindow.isVisible())
				this.currentWindow.show();
			else this.currentWindow.hide();
		});

		this.setListItems();

		//append list
		this.screen.append(this.windowManager);
		//create window
		await this.currentWindow.create();
		//render
		this.screen.render();
		//register events
		this.registerEvents();

		//update interval
		this.interval = setInterval(() => {
			if (this.currentWindow) this.currentWindow.update();
			this.screen.render();
		}, 33);

		//register escape key
		this.screen.key(["escape", "q", "C-c"], (ch: string, key: string) => {
			if (this.canExit) return process.exit(0);
			else debugLog("not allowed to exit but user wants to exit");
		});
		//shows the list
		this.screen.key(["windows", "z"], (ch: string, key: string) => {
			this.setListItems();
			this.currentWindow?.hide();
			this.windowManager.show();
		});
		//restores the current window
		this.screen.key(["restore", "r"], (ch: string, key: string) => {
			this.setListItems();
			if (this.windowManager?.hidden === false)
				this.currentWindow?.show();
		});
	}
}
