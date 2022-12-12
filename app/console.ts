import { InfinityMintConsole } from "./config";
import { debugLog, log } from "./helpers";
import { InfinityMintWindow } from "./window";
import hre, { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
//windows
import Logs from "./windows/logs";
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
import Music from "./windows/music";
import Ganache from "./windows/ganache";

const blessed = require("blessed");
export default class InfinityConsole {
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
				debugLog("destroyed window " + this.currentWindow?.name);
				this.updateWindowsList();
			}
		);

		//so we only fire once
		if (this.currentWindow.options.hide)
			this.currentWindow.off("hude", this.currentWindow.options.hude);
		//when the current window is hiden, rebuild the item
		this.currentWindow.options.hide = this.currentWindow.on("hide", () => {
			this.updateWindowsList();
		});
	}

	public async setWindow(thatWindow: string | Window) {
		if (this.currentWindow) this.currentWindow.hide();

		for (let i = 0; i < this.windows.length; i++) {
			let window = this.windows[i];
			if (window.name !== thatWindow.toString()) {
				if (window.isAlive()) window.hide();
				continue;
			}

			this.currentWindow = window;
			if (!this.currentWindow.hasInitialized()) {
				this.currentWindow.setScreen(this.screen);
				this.currentWindow.setContainer(this);
				await this.currentWindow.create();
				this.registerEvents();
			}
			this.currentWindow.show();
		}
	}

	public getWindows() {
		return [...this.windows];
	}

	public getWindowById(id: string | Window) {
		return this.windows
			.filter((thatWindow) => thatWindow.getId() === id.toString())
			.pop();
	}

	public getWindowByAge(name: string, oldest: boolean) {
		return this.windows
			.filter((thatWindow) => thatWindow.name === name)
			.sort((a, b) =>
				oldest
					? a.getCreation() - b.getCreation()
					: b.getCreation() - a.getCreation()
			)
			.pop();
	}

	public getWindowsByName(name: string) {
		return this.windows.filter((thatWindow) => thatWindow.name === name);
	}

	public addWindow(window: InfinityMintWindow) {
		if (this.hasWindow(window))
			throw new Error(
				"window with that id is already inside of the console"
			);

		this.windows.push(window);
	}

	public hasWindow(window: InfinityMintWindow) {
		return (
			this.windows.filter(
				(thatWindow) => thatWindow.getId() === window.getId()
			).length !== 0
		);
	}

	public updateWindowsList() {
		this.windowManager.setItems(
			[...this.windows].map(
				(window) =>
					(
						window.name +
						" " +
						`[${window.getId()}]` +
						(window.isAlive() ? "(alive)" : "(dead)")
					).padEnd(36, " ") +
					(!window.hasInitialized() ? " ! NOT INITIALIZED !" : "") +
					(window.isAlive() && window.shouldBackgroundThink()
						? " * RUNNING IN BACK *"
						: "")
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
			Ganache,
			Deployments,
			Gems,
			Networks,
			Scaffold,
			Music,
			Scripts,
			Settings,
			Deploy,
		];
		this.currentWindow = this.windows[0];
		this.currentWindow.setContainer(this);
		this.currentWindow.setScreen(this.screen);

		log(
			"initializing InfinityConsole chainId " +
				this.network.config.chainId +
				" network name " +
				this.network.name
		);

		//creating window manager
		this.windowManager = blessed.list({
			label: " {bold}{white-fg}Windows{/white-fg} (Enter/Double-Click to hide/show){/bold}",
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
		//when an item is selected form the list box, attempt to show or hide that Windoiw.
		this.windowManager.on("select", async (el: Element, selected: any) => {
			//disable the select if the current window is visible
			if (this.currentWindow?.isVisible()) return;
			this.currentWindow = this.windows[selected];
			if (!this.currentWindow.hasInitialized()) {
				this.currentWindow.setScreen(this.screen);
				this.currentWindow.setContainer(this);
				await this.windows[selected].create();
				this.registerEvents();
			} else if (!this.currentWindow.isVisible())
				this.currentWindow.show();
			else this.currentWindow.hide();
			await this.currentWindow.setFrameContent();
		});

		this.updateWindowsList();

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
			this.windows.forEach((window) => {
				if (
					window.isAlive() &&
					(window.shouldBackgroundThink() ||
						(!window.shouldBackgroundThink() && window.isVisible()))
				)
					window.update();
			});

			this.screen.render();
		}, 33);

		//register escape key
		this.screen.key(["escape", "C-c"], (ch: string, key: string) => {
			if (this.canExit) return process.exit(0);
			else debugLog("not allowed to exit but user wants to exit");
		});
		//shows the list
		this.screen.key(["windows", "C-z"], (ch: string, key: string) => {
			this.updateWindowsList();
			this.currentWindow?.hide();
			this.windowManager.show();
		});
		//restores the current window
		this.screen.key(["restore", "C-r"], (ch: string, key: string) => {
			this.updateWindowsList();
			if (this.windowManager?.hidden === false)
				this.currentWindow?.show();
		});
	}
}
