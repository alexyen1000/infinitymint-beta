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
	private optionsBox?: any;

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

	public async reload() {
		this.windows.forEach((window) => window.destroy());
		this.windowManager.destroy();
		//render
		this.screen.render();
		this.network = undefined;
		this.windowManager = undefined;
		await this.initialize();
		this.updateWindowsList();
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

	public hasWindow = (window: InfinityMintWindow) => {
		return (
			this.windows.filter(
				(thatWindow) => thatWindow.getId() === window.getId()
			).length !== 0
		);
	};

	public updateWindowsList() {
		this.windowManager.setItems(
			[...this.windows].map(
				(window) =>
					(
						window.name +
						" " +
						`[${window.getId()}] ` +
						(window.isAlive() ? "(alive)" : "(dead)")
					).padEnd(60, " ") +
					(!window.hasInitialized() ? " ! NOT INITIALIZED !" : "") +
					(window.isAlive() && window.shouldBackgroundThink()
						? " * RUNNING IN BACK *"
						: "")
			)
		);
	}

	private reallyClose() {
		this.optionsBox = blessed.box({
			label: 'Close InfinityMint???',
			top: "center",
			left: "center",
			width: "95%",
			height: "95%",
			padding: 2,
			border: {
				type: "line",
			},
			style: {
				fg: "white",
				bg: "grey",
				border: {
					fg: "#ffffff",
				},
				hover: {
					bg: "grey",
				},
			},
		});

		let left = blessed.box({
			top: 'center',
			content: "YAH",
			left: "5%",
			width: "shrink",
			padding: 2,
			style: {
				bg: "red",
				fg: "white",

				hover: {
					bg: "white",
				},
			},
		});

		let right = blessed.box({
			top: 'center',
			content: "NAH",
			left: "5%+26",
			width: "shrink",
			padding: 2,
			style: {
				bg: "green",
				fg: "white",

				hover: {
					bg: "white",
				},
			},
		});

		left.on('click', (_data: any) => {
		  kill();
		});
		
		right.on('click', (_data: any) => {
			if (this.canExit) {
				this.optionsBox.destroy();
				process.exit(0);
			}
		});

		let kill = () => {
			this.optionsBox.hide();
			this.screen.render();
			this.optionsBox.destroy();
		};

		this.screen.append(this.optionsBox);
		this.screen.append(left);
		this.screen.append(right);
		this.optionsBox.focus();

		this.optionsBox.key("escape", (_ch: any, _key: any): void => {
			if (this.canExit) {
				this.optionsBox.destroy();
				process.exit(0);
			}

			debugLog("not allowed to exit but user wants to exit");
		});

		this.optionsBox.key("enter", (_ch: any, _key: any): void => {
			kill();
		});

		this.screen.render();
	}

	public async initialize() {
		if (this.network !== undefined)
			throw new Error("console already initialized");

		this.network = hre.network;
		let chainId = (await ethers.provider.getNetwork()).chainId;
		log(
			"initializing InfinityConsole chainId " +
				(this.network.config?.chainId || chainId) +
				" network name " +
				this.network.name
		);

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

		let instantInstantiate = this.windows.filter((thatWindow) =>
			thatWindow.shouldInstantiate()
		);

		for (let i = 0; i < instantInstantiate.length; i++) {
			debugLog(
				"initializing " +
					instantInstantiate[i].name +
					`[${instantInstantiate[i].getId()}]`
			);

			if (!instantInstantiate[i].hasContainer())
				instantInstantiate[i].setContainer(this);

			instantInstantiate[i].setScreen(this.screen);
			await instantInstantiate[i].create();
			instantInstantiate[i].hide();
		}

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
		this.windowManager.on("select", async (_el: Element, selected: any) => {
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
			this.windowManager.setBack();
		});

		//append list
		this.screen.append(this.windowManager);

		//if it hasn't been initialized
		if (!this.currentWindow.hasInitialized()) {
			this.currentWindow.setContainer(this);
			this.currentWindow.setScreen(this.screen);
			//create window
			await this.currentWindow.create();
		}

		this.updateWindowsList();
		//render
		this.screen.render();
		//register events
		this.registerEvents();
		//show the current window
		this.currentWindow.show();
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
			if (this.canExit) {
				this.reallyClose();
			}
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
