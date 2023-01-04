import {
	InfinityMintConfigEventKeys,
	InfinityMintConsoleOptions,
	InfinityMintEventEmit,
	InfinityMintEventKeys,
	InfinityMintScript,
	KeyValue,
} from "./interfaces";
import {
	Blessed,
	BlessedElement,
	debugLog,
	findScripts,
	isEnvTrue,
	isTypescript,
	log,
	requireScript,
	warning,
} from "./helpers";
import { InfinityMintEventEmitter } from "./interfaces";
import { InfinityMintWindow } from "./window";
import hre, { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { changeNetwork, getDefaultSigner, getProvider } from "./web3";
import Pipes from "./pipes";
import { Dictionary } from "form-data";
import { BigNumber } from "ethers";
import events from "events";

//const
const { v4: uuidv4 } = require("uuid");
//node audio
const player = require("play-sound")({ player: "afplay" });

//core windows
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
import { getProjectDeploymentClasses } from "./deployments";

//blessed
const blessed = require("blessed") as Blessed;

/**
 * Powered by Blessed-cli the InfinityConsole is the container of InfinityMintWindows. See {@link app/window.InfinityMintWindow}.
 */
export class InfinityConsole {
	public think?: any;

	protected currentWindow?: InfinityMintWindow;
	protected windows: InfinityMintWindow[];
	protected allowExit: boolean;

	private screen: BlessedElement;
	private options?: InfinityMintConsoleOptions;
	private network?: HardhatRuntimeEnvironment["network"];
	private signers?: SignerWithAddress[];
	private windowManager?: BlessedElement;
	private inputKeys: Dictionary<Array<Function>>;
	private chainId: number;
	private eventEmitter: InfinityMintEventEmitter;
	private account: SignerWithAddress;
	private balance: BigNumber;
	private scripts: InfinityMintScript[];
	private sessionId: string;
	private tick: number;
	private currentAudio: any;
	private currentAudioKilled: boolean;
	private currentAudioAwaitingKill: boolean;

	constructor(options?: InfinityMintConsoleOptions) {
		this.screen = undefined;
		this.windows = [];
		this.allowExit = true;
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

		this.tick = 0;
		this.registerDefaultKeys();
		this.sessionId = this.generateId();
	}

	private generateId() {
		return uuidv4();
	}

	/**
	 * Sets the event emitter of another console to this console. Will not destroy the old event emitter, simply return it.
	 * @param otherConsole
	 */
	public setEventEmitter(otherConsole: InfinityConsole) {
		let oldEmitter = this.eventEmitter;
		this.eventEmitter = otherConsole.eventEmitter;
		return oldEmitter;
	}

	/**
	 * Creates a new event emitter, will remove all listeners on the old event emitter unless first param is true.
	 * @returns
	 */
	public createEventEmitter(dontCleanListeners?: boolean) {
		if (dontCleanListeners !== true)
			try {
				if (
					this.eventEmitter !== undefined &&
					this.eventEmitter !== null
				)
					this.eventEmitter?.removeAllListeners();
			} catch (error) {
				if (isEnvTrue("THROW_ALL_ERRORS")) throw error;

				warning("unable to remove all listeners on eventEMitter");
			}

		this.eventEmitter = new InfinityMintEventEmitter();
		return this.eventEmitter;
	}

	public getSessionId() {
		return this.sessionId;
	}

	public getEventEmitter() {
		return this.eventEmitter;
	}

	public getAccount() {
		return this.account;
	}

	public getBalance() {
		return this.balance;
	}

	public getCurrentChainId() {
		return this.chainId;
	}

	public getPipes() {
		return Pipes;
	}

	public log(...strings: string[]) {
		console.log(...strings);
	}

	public error(...strings: string[]) {
		console.error(...strings);
	}

	public registerDefaultKeys() {
		//default input keys
		this.inputKeys = {
			"C-l": [
				(ch: string, key: string) => {
					if (this.currentWindow?.name !== "Logs")
						this.screen.lastWindow = this.currentWindow;

					this.currentWindow?.openWindow("Logs");
					this.windowManager.setBack();
				},
			],
			"C-r": [
				(ch: string, key: string) => {
					if (this.screen.lastWindow !== undefined) {
						this.currentWindow?.hide();
						this.currentWindow = this.screen.lastWindow;
						delete this.screen.lastWindow;
					}

					this.updateWindowsList();
					if (this.windowManager?.hidden === false)
						this.currentWindow?.show();
				},
			],
			m: [
				(ch: string, key: string) => {
					this.currentAudio?.kill();
				},
			],
			"C-z": [
				(ch: string, key: string) => {
					this.updateWindowsList();
					this.currentWindow?.hide();
					this.windowManager.show();
				},
			],
			"C-c": [
				(ch: string, key: string) => {
					if (!this.allowExit) {
						debugLog("not showing CloseBox as allowExit is false");
						return;
					}

					this.windowManager.setBack();

					if (this?.currentWindow === undefined) {
						this.setWindow("CloseBox");
						return;
					}

					if (this.currentWindow?.name !== "CloseBox") {
						let windows = this.getWindowsByName("CloseBox");
						if (windows.length !== 0)
							windows[0].options.currentWindow =
								this.currentWindow?.name;

						this.setWindow("CloseBox");
						//if the closeBox aka the current window is visible and we press control-c again just exit
					} else if (this.currentWindow?.name === "CloseBox") {
						if (this.currentWindow.isVisible()) {
							this.currentAudio?.kill();
							process.exit(0);
						} else this.currentWindow.show();
					}
				},
			],
		};
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

	public registerEvents(window?: InfinityMintWindow) {
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
				this.registerEvents();
			}
			this.currentWindow.show();
		}
	}

	public async reload() {
		this.emit("reloaded");
		Object.keys(this.inputKeys).forEach((key) => {
			this.unkey(key);
		});
		this.currentWindow = undefined;
		this.windows.forEach((window) => window.destroy());
		this.windowManager.destroy();
		//render
		this.screen.render();
		this.network = undefined;
		this.windowManager = undefined;
		this.registerDefaultKeys();
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

	public getTick() {
		return this.tick;
	}

	public addWindow(window: InfinityMintWindow) {
		if (this.hasWindow(window))
			throw new Error(
				"window with that id is already inside of the console"
			);

		this.windows.push(window);
	}

	public isAwaitingKill() {
		return this.currentAudioAwaitingKill;
	}

	/**
	 *
	 * @param windowName
	 * @returns
	 */
	public getWindow(windowName: string) {
		return this.getWindowsByName(windowName)[0];
	}

	public windowExists(windowName: string) {
		return this.getWindowsByName(windowName).length !== 0;
	}

	public hasAudio() {
		return this.currentAudio !== undefined && this.currentAudio !== null;
	}

	public async stopAudio() {
		this.currentAudio?.kill();
		await this.audioKilled();
	}

	public playAudio(path: string, onFinished?: Function, onKilled?: Function) {
		this.currentAudioKilled = false;
		debugLog("playing => " + process.cwd() + path);
		// configure arguments for executable if any
		this.currentAudio = player.play(
			process.cwd() + path,
			{ afplay: ["-v", 1] /* lower volume for afplay on OSX */ },
			(err: Error | any) => {
				if (err && !this.currentAudio.killed) {
					if (isEnvTrue("THROW_ALL_ERRORS")) throw err;
					else warning("cannot play file: " + err?.message);
					return;
				}

				if (this.currentAudio.killed) {
					debugLog("killed => " + process.cwd() + path);
					this.currentAudio = null;
					this.currentAudioKilled = true;
					if (onKilled) onKilled(this.currentWindow, this);
				} else {
					debugLog("finished playing => " + process.cwd() + path);
					this.currentAudio = null;
					if (onFinished) onFinished(this.currentWindow, this);
				}
			}
		);
	}

	public getCurrentWindow() {
		return this.currentWindow;
	}

	public async audioKilled() {
		if (this.currentAudioKilled) return;

		this.currentAudioAwaitingKill = true;
		await new Promise((resolve, reject) => {
			let int = setInterval(() => {
				if (this.currentAudioKilled) {
					clearInterval(int);
					resolve(true);
					this.currentAudioAwaitingKill = false;
					return;
				}
			}, 1000);
		});
	}

	public hasWindow = (window: InfinityMintWindow) => {
		return (
			this.windows.filter(
				(thatWindow) => thatWindow.getId() === window.getId()
			).length !== 0
		);
	};

	/**
	 * updates the window list with options
	 */
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

	/**
	 * Creates the windows list which lets you select which window you want to open
	 */
	public createWindowManager() {
		//incase this is ran again, delete the old windowManager
		if (this.windowManager !== undefined) {
			this.windowManager?.free();
			this.windowManager?.destroy();
			this.windowManager === undefined;
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
			parent: this.screen,
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
		this.windowManager.on("select", async (_el: Element, selected: any) => {
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
				this.registerEvents();
			} else if (!this.currentWindow.isVisible())
				this.currentWindow.show();
			else this.currentWindow.hide();
			await this.currentWindow.updateFrameTitle();
			//set the window manager to the back of the screne
			this.windowManager.setBack();
		});

		//update the list
		this.updateWindowsList();
		//append window manager to the screen
		this.screen.append(this.windowManager);
		//set to the back of the screen
		this.windowManager.setBack();
	}

	/**
	 * This basically captures errors which occur on keys/events and still pipes them to the current pipe overwrites the key method to capture errors and actually console.error them instead of swallowing them
	 */
	public captureEventErrors() {
		this.screen.oldKey = this.screen.key;
		this.screen.key = (param1: any, cb: any) => {
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
	}

	public displayError(error: Error, onClick?: any) {
		let errorBox = blessed.box({
			top: "center",
			left: "center",
			shrink: true,
			parent: this.screen,
			width: "80%",
			height: "shrink",
			padding: 1,
			content: `{white-bg}{black-fg}CRITICAL ERROR - SYSTEM MALFUCTION: ${
				error.message
			} at ${Date.now()}{/black-fg}{/white-bg}\n\n ${
				error.stack
			} \n\n {white-bg}{black-fg}infinitymint-beta{/black-fg}{/white-bg}`,
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
		}) as BlessedElement;

		if (onClick !== undefined)
			errorBox.on("click", () => {
				onClick(errorBox);
			});

		errorBox.setFront();
		this.screen.append(errorBox);
		this.screen.render();
		errorBox.focus();
	}

	public registerKeys() {
		if (this.inputKeys === undefined) return;

		let keys = Object.keys(this.inputKeys);
		keys.forEach((key) => {
			try {
				this.screen.unkey([key]);
			} catch (error) {
				if (isEnvTrue("THROW_ALL_ERRORS")) throw error;
				warning("could not unkey " + key);
			}

			debugLog(`registering keyboard shortcut method on [${key}]`);
			this.screen.key([key], (ch: string, _key: string) => {
				this.inputKeys[key].forEach((method, index) => {
					method();
				});
			});
		});
	}

	public setAllowExit(canExit: boolean) {
		this.allowExit = canExit;
	}

	public canExit() {
		return this.allowExit;
	}

	/**
	 * Changes
	 * @param string
	 * @returns
	 */
	public async changeNetwork(string: string) {
		changeNetwork(string);
		await this.reload();
		return ethers.provider;
	}

	public key(key: string, cb: Function) {
		if (this.inputKeys === undefined) this.inputKeys = {};

		debugLog(`registering keyboard shortcut method on [${key}]`);
		if (this.inputKeys[key] === undefined) {
			this.inputKeys[key] = [];
			this.screen.key([key], (ch: string, _key: string) => {
				this.inputKeys[key].forEach((method, index) => {
					method();
				});
			});
		}

		this.inputKeys[key].push(cb);
		return cb;
	}

	/**
	 * unmaps a key combination from the console, if no cb is passed then will delete all keys under that key
	 * @param key
	 * @param cb
	 */
	public unkey(key: string, cb?: Function) {
		if (
			this?.inputKeys[key] === undefined ||
			this.inputKeys[key].length <= 1 ||
			cb === undefined
		)
			this.inputKeys[key] = [];
		else {
			this.inputKeys[key] = this.inputKeys[key].filter(
				(cb) => cb.toString() !== cb.toString()
			);
		}

		if (this.inputKeys[key].length === 0) {
			this.screen.unkey([key]);
			delete this.inputKeys[key];
		}
	}

	public errorHandler(error: Error | string) {
		console.error(error);
		if (isEnvTrue("THROW_ALL_ERRORS") || this.options?.throwErrors)
			throw error;

		this.displayError(error as Error, (errorBox: BlessedElement) => {
			errorBox.destroy();
		});
	}

	public async refreshWeb3() {
		this.network = hre.network;
		this.chainId = (await getProvider().getNetwork()).chainId;
		this.account = await getDefaultSigner();
		this.balance = await this.account.getBalance();
	}

	/**
	 * Returns the current web3 provider for the console, you should use this over getProvider at all times
	 * @returns
	 */

	public async getProvider() {
		return getProvider();
	}

	public getScripts() {
		return this.scripts;
	}

	/**
	 * Used to get the deployment classes relating to a project, must pass the Infinity Console.
	 * @param projectName
	 * @param console
	 * @returns
	 */
	public async getDeploymentClasses(
		projectName: string,
		console: InfinityConsole
	) {
		return await getProjectDeploymentClasses(projectName, console);
	}

	public async refreshScripts() {
		//call reloads
		if (this.scripts !== undefined && this.scripts.length !== 0) {
			for (let i = 0; i < this.scripts.length; i++) {
				let script = this.scripts[i];

				if (script?.reloaded !== undefined)
					await script.reloaded({ log, debugLog, console: this });
			}
		}

		let scripts = await findScripts();
		if (isTypescript())
			scripts = [...scripts, ...(await findScripts(".js"))];

		debugLog("found " + scripts.length + " deployment scripts");

		this.scripts = [];
		debugLog("requiring scripts and storing inside console instance...");
		for (let i = 0; i < scripts.length; i++) {
			let script = scripts[i];

			try {
				debugLog(`[${i}] requiring script <${script.name}>`);
				let scriptSource = await requireScript(
					script.dir + "/" + script.base,
					this
				);
				this.scripts.push(scriptSource);
				debugLog(`{green-fg}Success!{/green-fg}`);
			} catch (error) {
				if (isEnvTrue("THROW_ALL_ERRORS")) throw error;

				Pipes.getPipe(Pipes.currentPipeKey).error(error);
				debugLog(
					`{red-fg}Failure: ${
						(error?.message || "literally unknown").split("\n")[0]
					}{/red-fg}`
				);
			}
		}
	}

	public emit(
		eventName: InfinityMintConfigEventKeys | InfinityMintEventKeys,
		eventParameters?: any,
		eventType?: any
	) {
		debugLog("emitting (" + eventName + ")");
		return this.eventEmitter.emit(eventName, {
			infinityConsole: this,
			event: eventParameters,
			log: log,
			eventEmitter: this.eventEmitter,
			debugLog: debugLog,
		} as InfinityMintEventEmit<typeof eventType>);
	}

	public async initialize() {
		if (this.network !== undefined)
			throw new Error("console already initialized");

		this.createEventEmitter();
		await this.refreshWeb3();
		await this.refreshScripts();

		log(`loading InfinityConsole<${this.sessionId}>`);

		if (this.options?.dontDraw !== true)
			try {
				debugLog(
					`starting blessed on InfinityConsole<${this.sessionId}>`
				);
				//create the screen
				this.screen = blessed.screen(
					this.options?.blessed || {
						smartCRS: true,
						dockBorders: true,
						sendFocus: true,
					}
				);

				//captures errors which happen in key events in the window
				this.captureEventErrors();

				//set the current window from the
				if (this.options?.initialWindow === undefined)
					this.currentWindow = this.windows[0];
				else if (
					typeof this.options.initialWindow ===
					typeof InfinityMintWindow
				) {
					let potentialWindow = this.options.initialWindow as unknown;
					this.currentWindow = potentialWindow as InfinityMintWindow;
				} else {
					this.currentWindow = this.getWindowsByName(
						this.options.initialWindow as string
					)[0];
				}
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
					this.registerEvents(instantInstantiate[i]);
				}

				//create the window manager
				this.createWindowManager();

				//if the current window still hasn't been initialized, t
				if (!this.currentWindow.hasInitialized()) {
					this.currentWindow.setContainer(this);
					this.currentWindow.setScreen(this.screen);
					//create window
					await this.currentWindow.create();
					//register events for the windowManager with the currentWindow
					this.registerEvents();
				}

				//the think method for this console
				let int = () => {
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
				};
				this.think = setInterval(() => {
					(this.options?.think || int)();
					this.tick++;

					//bit of a hacky solution but keeps these buttons forward
					if (this.currentWindow !== undefined) {
						Object.values(this.currentWindow.elements).forEach(
							(element) => {
								if (element.alwaysFront) element.setFront();
								if (element.alwaysBack) element.setBack();

								if (
									element.think &&
									typeof element.think === "function" &&
									(!element.hidden || element.alwaysUpdate)
								)
									element.think(
										this.currentWindow,
										this.currentWindow.getElement("frame"),
										blessed
									);
							}
						);
					}
				}, this.options?.tickRate);

				//render
				this.screen.render();
				//register core key events
				this.registerKeys();
				//show the current window
				this.currentWindow.show();
			} catch (error: Error | any) {
				console.error(error);

				if (isEnvTrue("THROW_ALL_ERRORS") || this.options?.throwErrors)
					throw error;

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
						this.currentAudio?.kill();
						process.exit(0);
					}
				);
			}
		else
			warning(
				`not starting blessed on InfinityConsole<${this.sessionId}>`
			);

		log(`successfully loaded InfinityConsole<${this.sessionId}>`);
		this.emit("initialized");
	}
}
export default InfinityConsole;
