import { InfinityMintConsole } from "./config";
import { BlessedElement, debugLog, isEnvSet, isEnvTrue, log } from "./helpers";
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
import CloseBox from "./windows/closeBox";
import { getProvider } from "./web3";
import { DeploymentScript, getDeploymentScripts } from "./deployments";
import Pipes from "./pipes";

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
	private deployments?: DeploymentScript[];

	constructor(options?: InfinityMintConsole) {
		this.screen = undefined;
		this.windows = [];
		this.canExit = true;
		this.options = options;
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
			CloseBox,
		];
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

	public registerWindowsListEvents(window?: InfinityMintWindow) {
		if (this.currentWindow === undefined && window === undefined) return;
		window = window || this.currentWindow;

		if (window === undefined) return;
		//when the window is destroyed, rebuild the items list

		debugLog(
			"registering events for <" + window.name + `>[${window.getId()}]`
		);
		//so we only fire once
		if (window.options.destroy)
			window.off("destroy", window.options.destroy);

		window.options.destroy = window.on("destroy", () => {
			debugLog("destroyed window " + window?.name);
			this.updateWindowsList();
		});

		//so we only fire once
		if (window.options.hide) window.off("hide", window.options.hude);
		//when the current window is hiden, rebuild the item
		window.options.hide = window.on("hide", () => {
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
				this.registerWindowsListEvents();
			}
			this.currentWindow.show();
		}
	}

	public async reload() {
		this.currentWindow = undefined;
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
					(window.name + " " + `[${window.getId()}]`).padEnd(
						56,
						" "
					) +
					(window.isAlive()
						? " {green-fg}(alive){/green-fg}"
						: " {red-fg}(dead) {/red-fg}") +
					(!window.hasInitialized()
						? " {red-fg}[!] NOT INITIALIZED{/red-fg}"
						: "") +
					(window.isAlive() && window.shouldBackgroundThink()
						? " {cyan-fg}[?] RUNNING IN BACK{/cyan-fg}"
						: "")
			)
		);
	}

	public getDeployments() {
		return this.deployments;
	}

	public displayError(error: any, onClick?: any) {
		let errorBox = blessed.box({
			top: "center",
			left: "center",
			shrink: true,
			width: "80%",
			height: "shrink",
			padding: 1,
			content: `{white-bg}CRITICAL ERROR SYSTEM MALFUCTION: ${error.message}{/white-bg}\n\n ${error.stack} \n\n infinitymint-beta`,
			tags: true,
			border: {
				type: "line",
			},
			style: {
				fg: "white",
				bg: "red",
				border: {
					fg: "#ffffff",
				},
			},
		});

		if (onClick !== undefined)
			errorBox.on("click", () => {
				onClick(errorBox);
			});

		errorBox.setFront();
		this.screen.append(errorBox);
		this.screen.render();
	}

	public errorHandler(error: Error | unknown) {
		if (isEnvTrue("CONSOLE_THROW_ERROR")) throw error;

		console.error(error);
		this.displayError(error, (errorBox: BlessedElement) => {
			errorBox.destroy();
		});
	}

	public async initialize() {
		if (this.network !== undefined)
			throw new Error("console already initialized");

		this.deployments = await getDeploymentScripts();
		this.network = hre.network;

		let chainId = (await getProvider().getNetwork()).chainId;
		log(
			"initializing InfinityConsole chainId " +
				(this.network.config?.chainId || chainId) +
				" network name " +
				this.network.name
		);

		try {
			//create the screen
			this.screen = blessed.screen(
				this.options?.blessed || {
					smartCRS: true,
					dockBorders: true,
				}
			);

			//This basically captures errors which occur on keys/events and still pipes them to the current pipe
			//overwrites the key method to capture errors and actually console.error them instead of swallowing them
			this.screen.oldKey = this.screen.key;
			this.screen.key = (param1: any, cb: any) => {
				this.screen.oldKey(param1, (...any: any[]) => {
					if (typeof cb === typeof Promise)
						this.screen.oldKey(param1, async (...any: any[]) => {
							try {
								await cb(...any);
							} catch (error) {
								this.errorHandler(error);
							}
						});
					else
						this.screen.oldKey(param1, (...any: any[]) => {
							try {
								cb(...any);
							} catch (error) {
								this.errorHandler(error);
							}
						});
				});
			};

			//does the same a above, since for sone reason the on events aren't emitting errors, we can still get them like this
			this.screen.oldOn = this.screen.on;
			this.screen.on = (param1: any, cb: any) => {
				if (typeof cb === typeof Promise)
					this.screen.oldOn(param1, async (...any: any[]) => {
						try {
							await cb(...any);
						} catch (error) {
							this.errorHandler(error);
						}
					});
				else
					this.screen.oldOn(param1, (...any: any[]) => {
						try {
							cb(...any);
						} catch (error) {
							this.errorHandler(error);
						}
					});
			};

			//set the current window
			this.currentWindow = this.windows[0];

			//instantly instante windows which seek such a thing
			let instantInstantiate = this.windows.filter((thatWindow) =>
				thatWindow.shouldInstantiate()
			);

			for (let i = 0; i < instantInstantiate.length; i++) {
				debugLog(
					"initializing <" +
						instantInstantiate[i].name +
						`>[${instantInstantiate[i].getId()}]`
				);

				if (!instantInstantiate[i].hasContainer())
					instantInstantiate[i].setContainer(this);

				instantInstantiate[i].setScreen(this.screen);
				await instantInstantiate[i].create();
				instantInstantiate[i].hide();
				//register events
				this.registerWindowsListEvents(instantInstantiate[i]);
			}

			//if the current window still hasn't been initialized, t
			if (!this.currentWindow.hasInitialized()) {
				this.currentWindow.setContainer(this);
				this.currentWindow.setScreen(this.screen);
				//create window
				await this.currentWindow.create();
				//register events for the windowManager with the currentWindow
				this.registerWindowsListEvents();
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
				vi: true,
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
			this.windowManager.on(
				"select",
				async (_el: Element, selected: any) => {
					//disable the select if the current window is visible
					if (this.currentWindow?.isVisible()) return;
					//set the current window to the one that was selected
					this.currentWindow = this.windows[selected];
					if (!this.currentWindow.hasInitialized()) {
						//sets blessed screen for this window
						this.currentWindow.setScreen(this.screen);
						//set the container of this window ( the console, which is this)
						this.currentWindow.setContainer(this);
						await this.currentWindow.create();
						//registers events on the window
						this.registerWindowsListEvents();
					} else if (!this.currentWindow.isVisible())
						this.currentWindow.show();
					else this.currentWindow.hide();
					await this.currentWindow.setFrameContent();
					//set the window manager to the back of the screne
					this.windowManager.setBack();
				}
			);

			//update the list
			this.updateWindowsList();
			//append window manager to the screen
			this.screen.append(this.windowManager);
			//set to the back of the screen
			this.windowManager.setBack();
			//update interval for thinks
			this.interval = setInterval(() => {
				this.windows.forEach((window) => {
					if (
						window.isAlive() &&
						(window.shouldBackgroundThink() ||
							(!window.shouldBackgroundThink() &&
								window.isVisible()))
					)
						window.update();
				});

				this.screen.render();
			}, 33);

			//register escape key
			this.screen.key(["escape", "C-c"], (ch: string, key: string) => {
				this.windowManager.setBack();

				if (this.currentWindow?.name !== "CloseBox") {
					let windows = this.getWindowsByName("CloseBox");
					if (windows.length !== 0)
						windows[0].options.currentWindow =
							this.currentWindow?.name;
					this.currentWindow?.openWindow("CloseBox");
					//if the closeBox aka the current window is visible and we press control-c again just exit
				} else {
					if (this.currentWindow.isVisible()) process.exit(0);
					else this.currentWindow.show();
				}
			});

			//shows the logs
			this.screen.key(["C-l"], (ch: string, key: string) => {
				if (this.currentWindow?.name !== "Logs")
					this.screen.lastWindow = this.currentWindow;

				this.currentWindow?.openWindow("Logs");
				this.windowManager.setBack();
			});

			//shows the list
			this.screen.key(["C-z"], (ch: string, key: string) => {
				this.updateWindowsList();
				this.currentWindow?.hide();
				this.windowManager.show();
			});
			//restores the current window
			this.screen.key(["C-r"], (ch: string, key: string) => {
				if (this.screen.lastWindow !== undefined) {
					this.currentWindow?.hide();
					this.currentWindow = this.screen.lastWindow;
					delete this.screen.lastWindow;
				}

				this.updateWindowsList();
				if (this.windowManager?.hidden === false)
					this.currentWindow?.show();
			});
			//render
			this.screen.render();
			//show the current window
			this.currentWindow.show();
		} catch (error: Error | any) {
			Pipes.getPipe(Pipes.currentPipe).error(error as any);
			if (isEnvTrue("CONSOLE_THROW_ERROR")) throw error;
			else {
				this.screen.destroy();
				this.screen = blessed.screen(
					this.options?.blessed || {
						smartCRS: true,
						dockBorders: true,
						debug: true,
						sendFocus: true,
					}
				);

				this.displayError(error);

				//register escape key
				this.screen.key(
					["escape", "C-c"],
					(ch: string, key: string) => {
						process.exit(0);
					}
				);
			}
		}
	}
}
