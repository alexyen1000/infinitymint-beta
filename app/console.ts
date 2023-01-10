import {
	InfinityMintConfigEventKeys,
	InfinityMintConsoleOptions,
	InfinityMintEventEmit,
	InfinityMintEventKeys,
	InfinityMintScript,
} from './interfaces';
import {ethers} from 'hardhat';
import {
	BlessedElement,
	createPipes,
	debugLog,
	findScripts,
	findWindows,
	getConfigFile,
	getInfinityMintVersion,
	isEnvTrue,
	logDirect,
	requireScript,
	requireWindow,
	warning,
} from './helpers';
import hre from 'hardhat';
import {
	getTelnetOptions,
	hasLoggedIn,
	SessionEntry,
	TelnetServer,
} from './telnet';
import {InfinityMintEventEmitter} from './interfaces';
import {InfinityMintWindow} from './window';
import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {changeNetwork, getDefaultSigner} from './web3';
import {defaultFactory, PipeFactory} from './pipes';
import {Dictionary} from 'form-data';
import {BigNumber} from 'ethers';
import {getProjectDeploymentClasses} from './deployments';
import {getImports, hasImportCache, ImportCache} from './imports';
//blessed
import blessed from 'blessed';
import {findProjects, saveProjects} from './projects';
import {ProjectCache} from './projects';

//uuid stuff
const {v4: uuidv4} = require('uuid');

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
	private network?: HardhatRuntimeEnvironment['network'];
	private signers?: SignerWithAddress[];
	private windowManager?: BlessedElement;
	private loadingBox?: BlessedElement;
	private errorBox?: BlessedElement;
	private inputKeys: Dictionary<Array<Function>>;
	private chainId: number;
	private eventEmitter: InfinityMintEventEmitter;
	private account: SignerWithAddress;
	private balance: BigNumber;
	private scripts: InfinityMintScript[];
	private sessionId: string;
	private tick: number;
	private currentAudio: any;
	private client: any;
	private currentAudioKilled: boolean;
	private hasInitialized: boolean;
	private currentAudioAwaitingKill: boolean;
	private player: any;
	private imports: ImportCache;
	private user: any;
	private session: SessionEntry;
	private server: TelnetServer;
	private logs: PipeFactory;
	private projects: ProjectCache;

	constructor(
		options?: InfinityMintConsoleOptions,
		pipeFactory?: PipeFactory,
		telnetServer?: TelnetServer,
		eventEmitter?: InfinityMintEventEmitter,
	) {
		this.logs = pipeFactory || defaultFactory;
		createPipes(this.logs);

		this.windows = [];
		this.allowExit = true;
		this.options = options;
		this.windows = [];
		this.tick = 0;
		this.registerDefaultKeys();
		this.server = telnetServer;
		this.sessionId = this.generateId();
		this.eventEmitter = eventEmitter || this.createEventEmitter();

		if (!options.dontDraw) {
			let config = getConfigFile();
			if (config.music) this.player = require('play-sound')({player: 'afplay'});

			this.debugLog(`starting blessed on InfinityConsole<${this.sessionId}>`);
			this.screen = blessed.screen(
				this.options?.blessed || {
					smartCRS: true,
					fullUnicode: true,
					autoPadding: true,
					dockBorders: true,
					sendFocus: true,
				},
			);
			//captures errors which happen in key events in the window
			this.captureEventErrors();
			this.loadingBox = blessed.loading({
				top: 'center',
				left: 'center',
				width: '90%',
				height: 20,
				horizonal: true,
				parent: this.screen,
				pch: '-',
				padding: 1,
				border: 'line',
				style: {
					bg: 'black',
					fg: 'green',
					border: {
						fg: 'green',
					},
				},
			});
			this.screen.append(this.loadingBox);
			this.loadingBox.setFront();
			this.loadingBox.show();
			this.screen.render();
		}
	}

	private generateId() {
		return uuidv4();
	}

	public getUsername() {
		if (!this.client) return 'root';
	}

	public setClient(client: any) {
		this.client = client;
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
	 *
	 * @returns
	 */
	public getServer() {
		return this.server;
	}

	/**
	 *
	 * @returns
	 */
	public isTelnet() {
		let config = getConfigFile();
		return config.telnet && this.server !== undefined;
	}

	/**
	 * Creates a new event emitter, will remove all listeners on the old event emitter unless first param is true.
	 * @returns
	 */
	public createEventEmitter(dontCleanListeners?: boolean) {
		let config = getConfigFile();
		if (!dontCleanListeners)
			try {
				if (this.eventEmitter) this.eventEmitter?.removeAllListeners();
			} catch (error) {
				if (isEnvTrue('THROW_ALL_ERRORS')) throw error;

				warning('unable to remove all listeners on eventEMitter');
			}

		this.eventEmitter = new InfinityMintEventEmitter();

		//define these events
		if (config.events)
			Object.keys(config.events).forEach(event => {
				this.debugLog('new event registered => ' + event);
				try {
					this.eventEmitter.off(event, config.events[event]);
				} catch (error) {}
				this.eventEmitter.on(event, config.events[event]);
			});

		//define these events
		let telnetEvents = getTelnetOptions();
		if (telnetEvents?.events)
			Object.keys(telnetEvents.events).forEach(event => {
				this.debugLog('new telnet event registered => ' + event);
				try {
					this.eventEmitter.off(event, telnetEvents.events[event]);
				} catch (error) {}

				this.eventEmitter.on(event, telnetEvents.events[event]);
			});

		return this.eventEmitter;
	}

	public getSessionId() {
		return this.sessionId;
	}

	public getEventEmitter() {
		return this.eventEmitter;
	}

	public getScreen() {
		return this.screen;
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
		return PipeFactory;
	}

	public log(msg: string, pipe?: string) {
		this.logs.log(msg, pipe || 'default');
	}

	public error(error: Error) {
		if (this.isTelnet())
			this.logs.log(
				'{red-fg}' + error.message + ' ' + error.stack + '{/red-fg}',
			);

		this.logs.error(error);
	}

	public registerDefaultKeys() {
		//default input keys
		this.inputKeys = {
			'C-l': [
				(ch: string, key: string) => {
					if (this.currentWindow?.name !== 'Logs')
						this.screen.lastWindow = this.currentWindow;

					this.currentWindow?.openWindow('Logs');
				},
			],
			'C-r': [
				(ch: string, key: string) => {
					if (
						this.currentWindow &&
						this.currentWindow.isVisible() &&
						this.currentWindow.canRefresh()
					)
						this.reloadWindow(this.currentWindow);
					else this.reload();
				},
			],
			'C-i': [
				(ch: string, key: string) => {
					this.reload();
				},
			],
			'C-p': [
				(ch: string, key: string) => {
					this.gotoWindow('Projects');
				},
			],
			//shows the current video
			'C-x': [
				(ch: string, key: string) => {
					if (this.screen.lastWindow) {
						this.currentWindow?.hide();
						this.currentWindow = this.screen.lastWindow;
						delete this.screen.lastWindow;
					}

					this.updateWindowsList();
					if (this.windowManager?.hidden === false) this.currentWindow?.show();
				},
			],
			//hides the current window
			'C-z': [
				(ch: string, key: string) => {
					this.updateWindowsList();
					this.currentWindow?.hide();
					this.windowManager.show();
				},
			],
			up: [
				(ch: string, key: string) => {
					if (this.currentWindow?.isVisible()) return;
					this.windowManager.focus();
				},
			],
			down: [
				(ch: string, key: string) => {
					if (this.currentWindow?.isVisible()) return;
					this.windowManager.focus();
				},
			],
			'C-c': [
				(ch: string, key: string) => {
					if (!this.allowExit) {
						this.debugLog('not showing CloseBox as allowExit is false');
						return;
					}

					if (this.errorBox && !this.errorBox.hidden) {
						this.errorBox.destroy();
						this.errorBox = undefined;
						return;
					}

					if (!this.currentWindow) {
						this.gotoWindow('CloseBox');
						return;
					}

					if (this.currentWindow?.name !== 'CloseBox') {
						let windows = this.getWindowsByName('CloseBox');
						if (windows.length !== 0)
							windows[0].options.currentWindow = this.currentWindow?.name;

						this.gotoWindow('CloseBox');
						//if the closeBox aka the current window is visible and we press control-c again just exit
					} else if (this.currentWindow?.name === 'CloseBox') {
						if (this.client) {
							this.destroy();
							return;
						}

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
		if (!this.signers)
			throw new Error('signers must be initialized before getting signer');

		return this.signers[0];
	}

	public getSigners(): SignerWithAddress[] {
		if (!this.signers)
			throw new Error('signers must be initialized before getting signer');

		return this.signers;
	}

	public async reloadWindow(thatWindow: string | InfinityMintWindow) {
		this.setLoading('Reloading ' + thatWindow.toString());
		for (let i = 0; i < this.windows.length; i++) {
			let window = this.windows[i];

			if (
				window.toString() !== thatWindow.toString() &&
				window.name !== thatWindow.toString()
			)
				continue;

			try {
				let shouldInstantiate = false;
				if (
					this.currentWindow.toString() === window.toString() ||
					this.currentWindow.name === window.name
				) {
					shouldInstantiate = true;
					this.currentWindow.hide();
				}
				let fileName = window.getFileName();
				window.log('reloading');
				window.destroy();

				let newWindow = requireWindow(fileName);
				newWindow.setFileName(fileName);

				this.windows[i] = newWindow;
				this.currentWindow = newWindow;
				if (shouldInstantiate) {
					await this.createCurrentWindow();
				}
			} catch (error) {
				this.errorHandler(error);
			}
		}

		this.stopLoading();
	}

	public registerEvents(window?: InfinityMintWindow) {
		if (!this.currentWindow && !window) return;
		window = window || this.currentWindow;

		if (!window) return;
		//when the window is destroyed, rebuild the items list

		this.debugLog(
			'registering events window specific for <' +
				window.name +
				`>[${window.getId()}]`,
		);
		//so we only fire once
		if (window.data.destroy) window.off('destroy', window.data.destroy);

		window.data.destroy = window.on('destroy', () => {
			this.updateWindowsList();
		});

		//so we only fire once
		if (window.data.hide) window.off('hide', window.data.hide);
		//when the current window is hiden, rebuild the item
		window.data.hide = window.on('hide', () => {
			this.updateWindowsList();
		});
	}

	public async gotoWindow(thatWindow: string | Window) {
		if (this.currentWindow?.isForcedOpen()) return;
		if (this.currentWindow) this.currentWindow.hide();

		for (let i = 0; i < this.windows.length; i++) {
			let window = this.windows[i];
			if (
				window.toString() !== thatWindow.toString() &&
				window.name !== thatWindow.toString()
			) {
				if (thatWindow === 'CloseBox') window.hide();
				continue;
			}

			this.currentWindow = window;
			await this.createCurrentWindow();
			this.currentWindow.show();
		}
	}

	public destroy() {
		this.emit('destroyed');
		this.cleanup();
		this.screen.destroy();
		if (this?.client?.writable) {
			try {
				this.client?.destroy();
			} catch (error) {
				warning('could not destroy: ' + error.message);
			}
		}
		this.client = undefined;
	}

	public cleanup() {
		this.hasInitialized = false;

		//then start destorying
		Object.keys(this.inputKeys).forEach(key => {
			this.unkey(key);
		});

		//more destroying
		this.imports = undefined;
		this.currentWindow = undefined;
		this.windows?.forEach(window => window?.destroy());
		this.windows = [];
		this.network = undefined;
		this.windowManager = undefined;
		this.windowManager?.destroy();
		this?.registerDefaultKeys();
	}

	/**
	 *
	 */
	public async reloadProjects() {
		let projects = await findProjects();
		this.projects = saveProjects(projects);
	}

	public async reload() {
		this.emit('reloaded');
		this.setLoading('Reloading InfinityConsole', 10);
		this.cleanup();
		//render
		this.screen.render();

		//do a hard refresh of imports (TODO: Maybe remove)
		await this.refreshImports(true);
		this.setLoading('Initializing', 90);
		await this.initialize();

		this.updateWindowsList();
		this.stopLoading();

		if (this.client && !hasLoggedIn(this.client, this.getSessionId()))
			this.gotoWindow('Login');
	}

	public getWindows() {
		return [...this.windows];
	}

	public getWindowById(id: string | Window) {
		return this.windows
			.filter(thatWindow => thatWindow.getId() === id.toString())
			.pop();
	}

	public getImports() {
		return this.imports;
	}

	public getWindowByAge(name: string, oldest: boolean) {
		return this.windows
			.filter(thatWindow => thatWindow.name === name)
			.sort((a, b) =>
				oldest
					? a.getCreation() - b.getCreation()
					: b.getCreation() - a.getCreation(),
			)
			.pop();
	}

	public getWindowsByName(name: string) {
		return this.windows.filter(thatWindow => thatWindow.name === name);
	}

	public getTick() {
		return this.tick;
	}

	public addWindow(window: InfinityMintWindow) {
		if (this.hasWindow(window))
			throw new Error('window with that id is already inside of the console');

		this.windows.push(window);
	}

	public isAwaitingKill() {
		if (!getConfigFile().music) return false;
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

	/**
	 * Returns true if audio is playing
	 * @returns
	 */
	public hasAudio() {
		if (!getConfigFile().music) false;
		return !!this.currentAudio;
	}

	public async stopAudio() {
		if (!getConfigFile().music) return;

		if (this.currentAudio?.kill) {
			this.currentAudio?.kill();
			await this.audioKilled();
		} else {
			this.currentAudioAwaitingKill = false;
			this.currentAudioKilled = true;
		}
	}

	public playAudio(path: string, onFinished?: Function, onKilled?: Function) {
		if (!getConfigFile().music) return;
		this.currentAudioKilled = false;
		this.debugLog('playing => ' + process.cwd() + path);
		// configure arguments for executable if any
		this.currentAudio = this.player.play(
			process.cwd() + path,
			{afplay: ['-v', 1] /* lower volume for afplay on OSX */},
			(err: Error | any) => {
				if (err && !this.currentAudio.killed) {
					if (isEnvTrue('THROW_ALL_ERRORS')) throw err;
					else warning('cannot play file: ' + err?.message);
					return;
				}

				if (this.currentAudio.killed) {
					this.debugLog('killed => ' + process.cwd() + path);
					this.currentAudio = null;
					this.currentAudioKilled = true;
					if (onKilled) onKilled(this.currentWindow, this);
				} else {
					this.debugLog('finished playing => ' + process.cwd() + path);
					this.currentAudio = null;
					if (onFinished) onFinished(this.currentWindow, this);
				}
			},
		);
	}

	public getCurrentWindow() {
		return this.currentWindow;
	}

	/**
	 * Returns true if we have a current window selected
	 * @returns
	 */
	public hasCurrentWindow() {
		return !!this.currentWindow;
	}

	public async audioKilled() {
		if (!getConfigFile().music) return;
		if (this.currentAudioKilled) return;

		this.currentAudioAwaitingKill = true;
		await new Promise((resolve, reject) => {
			let int = setInterval(() => {
				if (this.currentAudioKilled || !this.currentWindow.isAlive()) {
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
			this.windows.filter(thatWindow => thatWindow.getId() === window.getId())
				.length !== 0
		);
	};

	/**
	 * updates the window list with options
	 */
	public updateWindowsList() {
		if (this.options.dontDraw) return;

		this.windowManager.setBack();
		this.windowManager.enableKeys();
		this.windowManager.enableMouse();
		try {
			this.windowManager.setItems(
				[...this.windows]
					.filter(window => !window.isHiddenFromMenu())
					.map(
						(window, index) =>
							`{bold}[${index.toString().padEnd(4, '0')}]{bold}` +
							((window.isAlive()
								? ` {green-fg}0x${index.toString(16).padEnd(4, '0')}{/green-fg}`
								: ' {red-fg}0x0000{/red-fg}') +
								(!window.hasInitialized()
									? ' {gray-fg}[!]{/gray-fg}'
									: ' {gray-fg}[?]{/gray-fg}') +
								' ' +
								window.name +
								(window.isAlive() && window.shouldBackgroundThink()
									? ' {gray-fg}(running in background){/gray-fg}'
									: '')),
					),
			);
		} catch (error) {
			if (isEnvTrue('THROW_ALL_ERRORS')) throw error;
			warning('cannot update window manager: ' + error?.message);
		}
	}

	public setLoading(msg: string, filled?: number) {
		if (this.options.dontDraw) return;

		this.loadingBox.show();
		this.loadingBox.setFront();
		this.loadingBox.load(msg);

		this.loadingBox.filled = this.loadingBox.filled || filled || 100;
	}

	public stopLoading() {
		if (this.options.dontDraw) return;

		//so you can see wtf IM is doing, it so fast...
		setTimeout(() => {
			this.loadingBox.stop();
			this.loadingBox.setFront();
			this.loadingBox.hide();
		}, 350);
	}

	/**
	 * Creates the windows list which lets you select which window you want to open
	 */
	public createWindowManager() {
		//incase this is ran again, delete the old windowManager
		if (this.windowManager) {
			this.windowManager?.free();
			this.windowManager?.destroy();
			this.windowManager = undefined;
		}

		//creating window manager
		this.windowManager = blessed.list({
			label:
				' {bold}{white-fg}Windows{/white-fg} (Enter/Double-Click to hide/show){/bold}',
			tags: true,
			top: 'center',
			left: 'center',
			width: '95%',
			height: '95%',
			padding: 2,
			keys: true,
			mouse: true,
			parent: this.screen,
			vi: true,
			border: 'line',
			scrollbar: {
				ch: ' ',
				track: {
					bg: 'black',
				},
				style: {
					inverse: true,
				},
			},
			style: {
				bg: 'black',
				fg: 'white',
				item: {
					hover: {
						bg: 'green',
						fg: 'black',
					},
				},
				selected: {
					bg: 'grey',
					fg: 'green',
					bold: true,
				},
			},
		});
		//when an item is selected form the list box, attempt to show or hide that Windoiw.
		this.windowManager.on('select', async (_el: Element, selected: any) => {
			try {
				if (this.currentWindow?.isForcedOpen()) {
					this.currentWindow.show();
					return;
				}
				//disable the select if the current window is visible
				if (this.currentWindow?.isVisible()) return;
				//set the current window to the one that was selected
				this.currentWindow = this.windows.filter(
					window => !window.isHiddenFromMenu(),
				)[selected];

				if (!this.currentWindow) {
					warning('current window is undefined');
					this.updateWindowsList();
					this.currentWindow = this.getWindow('Menu');
					return;
				}

				if (!this.currentWindow.hasInitialized()) {
					//reset it
					this.currentWindow.destroy();
					//create it again
					await this.createCurrentWindow();
				} else if (!this.currentWindow.isVisible()) this.currentWindow.show();
				else this.currentWindow.hide();
				await this.currentWindow.updateFrameTitle();
			} catch (error) {
				this.currentWindow?.hide();
				this.currentWindow?.destroy();

				try {
					this.windows[selected]?.hide();
					this.destroyWindow(this.windows[selected]);
				} catch (error) {
					warning('cannot destroy window: ' + error.message);
				}

				this.errorHandler(error);
			}
		});
		this.windowManager.setBack();
		//update the list
		this.updateWindowsList();
		//append window manager to the screen
		this.screen.append(this.windowManager);
	}

	/**
	 * This basically captures errors which occur on keys/events and still pipes them to the current pipe overwrites the key method to capture errors and actually console.error them instead of swallowing them
	 */
	public captureEventErrors() {
		//captures errors in keys
		if (!this.screen.oldKey) this.screen.oldKey = this.screen.key;

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
		if (!this.screen.oldOn) this.screen.oldOn = this.screen.on;

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
		if (this.errorBox) {
			this.errorBox?.destroy();
			this.errorBox = undefined;
		}

		this.errorBox = blessed.box({
			top: 'center',
			left: 'center',
			shrink: true,
			width: '80%',
			mouse: true,
			keyboard: true,
			parent: this.windowManager,
			height: '80%',
			scrollable: true,
			scrollbar: {
				ch: ' ',
				track: {
					bg: 'black',
				},
				style: {
					inverse: true,
				},
			},
			padding: 1,
			content: `{white-bg}{black-fg}CRITICAL ERROR - SYSTEM MALFUCTION: ${
				error.message
			} at ${Date.now()}{/black-fg}{/white-bg}\n\n ${
				error.stack
			} \n\n {white-bg}{black-fg}infinitymint-beta ${getInfinityMintVersion()}{/black-fg}{/white-bg}`,
			tags: true,
			border: {
				type: 'line',
			},
			style: {
				fg: 'white',
				bg: 'red',
				border: {
					fg: '#ffffff',
				},
			},
		}) as BlessedElement;

		this.errorBox.on('click', () => {
			if (onClick) onClick(this.errorBox);
			else this.errorBox.destroy();
		});

		this.screen.append(this.errorBox);
		this.screen.render();
		this.errorBox.setFront();
		this.errorBox.focus();
		this.screen.focus();
	}

	public registerKeys() {
		if (!this.inputKeys) return;

		let keys = Object.keys(this.inputKeys);
		keys.forEach(key => {
			try {
				this.screen.unkey([key]);
			} catch (error) {
				if (isEnvTrue('THROW_ALL_ERRORS')) throw error;
				warning('could not unkey ' + key);
			}

			this.debugLog(`registering keyboard shortcut method on [${key}]`);
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
	public setSession(session: any) {
		this.session = session;
	}

	public setUser(user: any) {
		this.user = user;
	}

	public getClient() {
		return this.client;
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
		if (!this.inputKeys) this.inputKeys = {};

		this.debugLog(`registering keyboard shortcut method on [${key}]`);
		if (!this.inputKeys[key]) {
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

	public getLogs() {
		return this.logs;
	}

	/**
	 * unmaps a key combination from the console, if no cb is passed then will delete all keys under that key
	 * @param key
	 * @param cb
	 */
	public unkey(key: string, cb?: Function) {
		if (!this.inputKeys[key] || this.inputKeys[key].length <= 1 || !cb)
			this.inputKeys[key] = [];
		else {
			this.inputKeys[key] = this.inputKeys[key].filter(
				cb => cb.toString() !== cb.toString(),
			);
		}

		if (this.inputKeys[key].length === 0) {
			this.screen.unkey([key]);
			delete this.inputKeys[key];
		}
	}

	public errorHandler(error: Error) {
		this.error(error);

		if (isEnvTrue('THROW_ALL_ERRORS') || this.options?.throwErrors) {
			this.stopLoading();
			throw error;
		}

		this.displayError(error as Error, () => {
			this.errorBox.destroy();
			this.errorBox = undefined;
		});
	}

	public async refreshWeb3() {
		try {
			this.network = hre.network;
			this.chainId = (await ethers.provider.getNetwork()).chainId;
			this.account = await getDefaultSigner();
			this.balance = await this.account.getBalance();
		} catch (error) {
			warning('BAD WEB3: ' + error?.message);
		}
	}

	/**
	 * Returns the current web3 provider for the console, you should use this over getProvider at all times
	 * @returns
	 */

	public async getProvider() {
		return ethers.provider;
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
		console: InfinityConsole,
	) {
		return await getProjectDeploymentClasses(projectName, console);
	}

	public async refreshScripts() {
		let config = getConfigFile();

		try {
			//call reloads
			if (this.scripts && this.scripts.length !== 0) {
				for (let i = 0; i < this.scripts.length; i++) {
					let script = this.scripts[i];

					if (script?.reloaded)
						await script.reloaded({
							log: this.log,
							debugLog: this.debugLog,
							console: this,
						});
				}
			}
		} catch (error) {
			warning('bad reload: ' + error.message);
		}

		let scripts = await findScripts();
		this.debugLog('found ' + scripts.length + ' deployment scripts');

		this.scripts = [];
		this.debugLog('requiring scripts and storing inside console instance...');
		for (let i = 0; i < scripts.length; i++) {
			let script = scripts[i];

			try {
				this.debugLog(
					`[${i}] requiring script <${script.name}> => ${
						script.dir + '/' + script.base
					}`,
				);

				if (script.ext === '.ts') {
					let scriptSource = await requireScript(
						script.dir + '/' + script.base,
						this,
						this.isTelnet(),
					);
					scriptSource.fileName = script.dir + '/' + script.base;
					this.scripts.push(scriptSource);
				} else {
					let _potentialSource: any = {};
					if (
						config.settings.scripts.disableJavascriptRequire.filter(
							(value: string) => script.dir.indexOf(value) !== -1,
						).length === 0
					) {
						(process as any)._exit = (code?: number) => {
							warning('prevented process exit');
						};
						_potentialSource = await requireScript(
							script.dir + '/' + script.base,
							this,
							this.isTelnet(),
						);
						(process as any).exit = (process as any)._exit;
					} else
						this.debugLog(
							`[${i}] script skipping require <${script.name}> => ${
								script.dir + '/' + script.base
							}`,
						);

					this.scripts.push({
						..._potentialSource,
						name: _potentialSource?.name || script.name,
						fileName: script.dir + '/' + script.base,
						javascript: true,
						execute: async infinitymint => {
							(process as any)._exit = (code?: number) => {
								if (code === 1) warning('exited with code 0');
							};
							let result = await requireScript(
								script.dir + '/' + script.base,
								this,
								this.isTelnet(),
							);
							if (typeof result === 'function')
								await (result as any)(infinitymint);
							else if (result.execute) await result.execute(infinitymint);

							(process as any).exit = (process as any)._exit;
						},
					});
				}

				this.debugLog(`{green-fg}Success!{/green-fg}`);
			} catch (error) {
				if (isEnvTrue('THROW_ALL_ERRORS')) throw error;

				this.logs.getPipe(this.logs.currentPipeKey).error(error);
				this.debugLog(
					`{red-fg}Failure: ${
						(error?.message || 'literally unknown').split('\n')[0]
					}{/red-fg}`,
				);
			}
		}
	}

	public debugLog(msg: string) {
		//throw away debug log
		if (!this.logs.pipes['debug']) return;

		return this.logs.log(msg, 'debug');
	}

	public emitAny(eventName: string, eventParameters?: any, eventType?: any) {
		return this.emit(eventName as any, eventParameters, eventType);
	}

	public emit(
		eventName: InfinityMintConfigEventKeys | InfinityMintEventKeys,
		eventParameters?: any,
		eventType?: any,
	) {
		this.debugLog('emitting (' + eventName + ')');
		return this.eventEmitter.emit(eventName, {
			infinityConsole: this,
			event: eventParameters,
			log: msg => {
				this.getLogs().log(msg.toString());
			},
			eventEmitter: this.eventEmitter,
			debugLog: msg => {
				this.getLogs().log(msg.toString(), 'debug');
			},
		} as InfinityMintEventEmit<typeof eventType>);
	}

	/**
	 * Similar to gotoWindow except it does require the window to exist in the window manager
	 * @param window
	 */

	public async setWindow(window: InfinityMintWindow) {
		if (this.currentWindow?.isForcedOpen()) return;
		if (this.currentWindow) this.currentWindow?.hide();

		for (let i = 0; i < this.windows.length; i++) {
			let thatWindow = this.windows[i];
			if (window.toString() !== thatWindow.toString()) {
				if (window.isAlive()) window.hide();
			}
		}

		this.currentWindow = window;

		if (!this.currentWindow.hasInitialized()) await this.createCurrentWindow();

		this.currentWindow.show();
		this.addWindowToList(window);
	}

	/**
	 *
	 */
	public async createCurrentWindow() {
		if (this.currentWindow.hasInitialized()) {
			return;
		}

		if (!this.currentWindow.hasContainer())
			this.currentWindow.setContainer(this);

		this.currentWindow.setScreen(this.screen);

		this.windowManager.hide();
		this.currentWindow.createFrame();
		await this.currentWindow.create();
		this.windowManager.show();
		this.windowManager.setBack();
		this.registerEvents();
	}

	/**
	 *
	 * @param window
	 */
	public async addWindowToList(window: InfinityMintWindow) {
		if (
			this.windows.filter(
				thatWindow => thatWindow.toString() === window.toString(),
			).length !== 0
		)
			warning('window is already in list');
		else {
			this.windows.push(window);
			this.updateWindowsList();
		}
	}

	/**
	 *
	 * @param windowOrIdOrName
	 */
	public async destroyWindow(windowOrIdOrName: InfinityMintWindow | string) {
		for (let i = 0; i < this.windows.length; i++) {
			if (
				this.windows[i].toString() === windowOrIdOrName.toString() ||
				this.windows[i].name === windowOrIdOrName.toString() ||
				this.windows[i].getId() === windowOrIdOrName.toString()
			) {
				//if its a clone then just kill it. InfinityMint will clean it up automatically
				if (this.windows[i].data.clone) {
					this.windows[i].destroy();
					//init a dummy window to not kill console
					this.windows[i] = new InfinityMintWindow(this.windows[i].name);
					//hide it from the menu
					this.windows[i].setHiddenFromMenu(true);
					return;
				}

				let fileName = this.windows[i].getFileName();
				this.windows[i].log('reimporting ' + fileName);
				this.windows[i].destroy();
				this.windows[i] = requireWindow(fileName);
				this.windows[i].setFileName(fileName);
			}
		}
	}

	/**
	 *
	 */
	public async refreshWindows() {
		let windows = await findWindows();

		this.debugLog('requiring windows and storing inside console instance...');
		for (let i = 0; i < windows.length; i++) {
			let window = requireWindow(windows[i], this.isTelnet());
			if (!window.hasContainer(this)) window.setContainer(this);
			else warning('window has container already');

			window.setFileName(windows[i]);
			this.windows.push(Object.create(window) as InfinityMintWindow);
			this.debugLog(
				`[${i}]` +
					' {green-fg}successfully required{/green-fg} => ' +
					windows[i],
			);
		}
	}

	/**
	 *
	 * @param useFresh
	 */
	public async refreshImports(useFresh?: boolean) {
		this.imports = await getImports(useFresh);
	}

	/**
	 *
	 * @returns
	 */
	public getProjects() {
		return this.projects.database;
	}

	public async initialize() {
		//if the network member has been defined then we have already initialized
		if (this.network) throw new Error('console already initialized');
		this.setLoading('Loading Imports', 10);
		//refresh imports
		if (!this.imports || !hasImportCache()) await this.refreshImports();

		this.setLoading('Loading Web3', 10);
		await this.refreshWeb3();

		this.setLoading('Loading Scripts', 25);
		await this.refreshScripts();

		//create the window manager
		this.setLoading('Loading Windows', 35);
		await this.refreshWindows();

		this.setLoading('Loading Projects', 45);
		await this.reloadProjects();

		if (this.options.dontDraw) {
			this.hasInitialized = true;
			return;
		}

		this.log(`loading InfinityConsole<${this.sessionId}>`);
		//the think method for this console
		let int = () => {
			this.windows.forEach(window => {
				if (
					window.isAlive() &&
					(window.shouldBackgroundThink() ||
						(!window.shouldBackgroundThink() && window.isVisible()))
				)
					window.update();
			});

			this.screen.render();
		};

		this.think = setInterval(() => {
			if (!this.hasInitialized) return;
			(this.options?.think || int)();
			this.tick++;

			//bit of a hacky solution but keeps these buttons forward
			if (this.currentWindow) {
				Object.values(this.currentWindow.elements)
					.filter(element => !element.hidden)
					.forEach(element => {
						if (!this.options.dontDraw && element.alwaysBack) element.setBack();
						if (!this.options.dontDraw && element.alwaysFront)
							element.setFront();
						if (!this.options.dontDraw && element.alwaysFocus) element.focus();
						if (
							!this.options.dontDraw &&
							(element.options.mouse || element.options.keys)
						)
							element.enableInput();

						if (
							element.think &&
							typeof element.think === 'function' &&
							(!element.hidden || element.alwaysUpdate)
						)
							element.think(this.currentWindow, element, blessed);
					});
			}

			this.windowManager.setBack();
			this.loadingBox.setFront();

			if (this.errorBox && !this.errorBox.hidden) this.errorBox.setFront();
		}, this.options?.tickRate || 33);

		this.setLoading('Loading InfinityMint', 50);

		//dont draw
		if (!this.options.dontDraw)
			try {
				//register core key events
				this.registerKeys();
				//create the window manager
				this.createWindowManager();
				//set the current window from the

				if (!this.options?.initialWindow)
					this.currentWindow =
						this.getWindowsByName('Menu')[0] || this.windows[0];
				else if (
					typeof this.options.initialWindow === typeof InfinityMintWindow
				) {
					let potentialWindow = this.options.initialWindow as unknown;
					this.currentWindow = potentialWindow as InfinityMintWindow;
				} else {
					this.currentWindow = this.getWindowsByName(
						this.options.initialWindow as string,
					)[0];
				}
				//instantly instante windows which seek such a thing
				let instantInstantiate = this.windows.filter(thatWindow =>
					thatWindow.shouldInstantiate(),
				);

				this.debugLog(`initializing ${instantInstantiate.length} windows`);
				for (let i = 0; i < instantInstantiate.length; i++) {
					this.setLoading('Loading Window ' + instantInstantiate[i].name, 50);
					try {
						this.debugLog(
							`[${i}] initializing <` +
								instantInstantiate[i].name +
								`>[${instantInstantiate[i].getId()}]`,
						);

						if (!instantInstantiate[i].hasContainer())
							instantInstantiate[i].setContainer(this);

						instantInstantiate[i].setScreen(this.screen);
						instantInstantiate[i].createFrame();
						await instantInstantiate[i].create();
						instantInstantiate[i].hide();
						//register events
						this.registerEvents(instantInstantiate[i]);
					} catch (error) {
						warning(
							`[${i}] error initializing <` +
								instantInstantiate[i].name +
								`>[${instantInstantiate[i].getId()}]: ` +
								error.message,
						);
						//simply try and hide
						try {
							instantInstantiate[i].hide();
						} catch (error) {}
						this.errorHandler(error);
					}
				}

				this.debugLog(
					`finished initializing ${instantInstantiate.length} windows`,
				);

				this.setLoading('Loading Current Window', 70);
				await this.createCurrentWindow(); //create the current window
				//render
				this.screen.render();
				//set window manager to the back
				this.windowManager.setBack();
				//show the current window
				this.currentWindow.show();
			} catch (error: Error | any) {
				console.error(error);

				if (isEnvTrue('THROW_ALL_ERRORS') || this.options?.throwErrors) {
					this.stopLoading();
					throw error;
				}

				this.screen.destroy();

				this.screen = blessed.screen(
					this.options?.blessed || {
						smartCRS: true,
						dockBorders: true,
						fullUnicore: true,
						cursor: {
							artificial: true,
							shape: {
								bg: 'red',
								fg: 'white',
								bold: true,
								ch: '#',
							},
							blink: true,
						},
					},
				);

				this.displayError(error);

				//register escape key
				this.screen.key(['escape', 'C-c'], (ch: string, key: string) => {
					this.currentAudio?.kill();
					process.exit(0);
				});
			}
		else warning(`not starting blessed on InfinityConsole<${this.sessionId}>`);

		this.log(`successfully initialized InfinityConsole<${this.sessionId}>`);
		//stop loading
		this.stopLoading();
		this.hasInitialized = true;
		this.emit('initialized');
	}
}
export default InfinityConsole;
