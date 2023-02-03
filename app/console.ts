import {
	InfinityMintCompiledProject,
	InfinityMintConfigEventKeys,
	InfinityMintConsoleOptions,
	InfinityMintEventEmit,
	InfinityMintEventKeys,
	InfinityMintProject,
	InfinityMintScript,
	InfinityMintTempProject,
} from './interfaces';
import {ethers} from 'hardhat';
import fs from 'fs';
import {
	BlessedElement,
	createPipes,
	cwd,
	findScripts,
	findWindows,
	getConfigFile,
	getInfinityMintVersion,
	isEnvTrue,
	requireScript,
	requireWindow,
	warning,
} from './helpers';
import hre from 'hardhat';
import {getTelnetOptions, SessionEntry, TelnetServer} from './telnet';
import {InfinityMintEventEmitter} from './interfaces';
import {InfinityMintWindow} from './window';
import {HardhatRuntimeEnvironment, Network} from 'hardhat/types';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {changeNetwork, getDefaultAccountIndex} from './web3';
import {defaultFactory as globalLogs, PipeFactory} from './pipes';
import {Dictionary} from './helpers';
import {BigNumber} from 'ethers';
import {
	getProjectDeploymentClasses,
	InfinityMintDeployment,
} from './deployments';
import path from 'path';
import {getImports, hasImportCache, ImportCache} from './imports';
import {JsonRpcProvider} from '@ethersproject/providers';
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
	/**
	 * this is handle to a setInterval that is used to update the console. the setInterval is cleared when the console is closed. the setInterval is used to update the console every 100ms by default. You can change this by changing the tickRate option in the console options.
	 */
	public think?: any;
	/**
	 * the loading box element
	 */
	public loadingBox?: BlessedElement;
	/**
	 * the current window of the console
	 */
	protected currentWindow?: InfinityMintWindow;
	/**
	 * the windows for the console
	 */
	protected windows: InfinityMintWindow[];
	/**
	 * is the console is allowed to exit
	 */
	protected allowExit: boolean;

	/**
	 * the screen of the console. This is a blessed cli element.
	 */
	private screen: BlessedElement;
	/**
	 * the options for the console, see {@link app/interfaces.InfinityMintConsoleOptions}
	 */
	private options?: InfinityMintConsoleOptions;
	/**
	 * the hardhat runtime environment for the console. See {@link https://hardhat.org/hardhat-network/#hardhat-runtime-environment}.
	 */
	private network?: HardhatRuntimeEnvironment['network'];
	/**
	 * the signers for the console. See {@link https://docs.ethers.io/v5/api/signer/#Signer}
	 */
	private signers?: SignerWithAddress[];
	/**
	 * the window manager element for the console
	 */
	private windowManager?: BlessedElement;
	/**
	 * the error box element for the console
	 */
	private errorBox?: BlessedElement;
	/**
	 * the keyboard shortcuts for the console, is a dictionary of key combinations and their respective functions
	 */
	private inputKeys: Dictionary<Array<Function>>;
	/**
	 * the current networks chainId of the console
	 */
	private chainId: number;
	/**
	 * the event emitter for the console
	 */
	private eventEmitter: InfinityMintEventEmitter;
	/**
	 * the current account of the console
	 */
	private account: SignerWithAddress;
	/**
	 * the current balance of the console
	 */
	private balance: BigNumber;
	/**
	 * the scripts for the console
	 */
	private scripts: InfinityMintScript[];
	/**
	 * the session id of the console
	 */
	private sessionId: string;
	/**
	 * the current tick of the console
	 */
	private tick: number;
	/**
	 * the current audio being played
	 */
	private currentAudio: any;
	/**
	 * the telnets client instance
	 */
	private client: any;
	/**
	 * if the current audio has been killed or is not playing
	 */
	private currentAudioKilled: boolean;
	/**
	 * if the console has been initialized
	 */
	private hasInitialized: boolean;
	/**
	 * if the audio is currently awaiting kill
	 */
	private currentAudioAwaitingKill: boolean;
	/**
	 * the audio player for the console
	 */
	private player: any;
	/**
	 * the imports cache for the console
	 */
	private imports: ImportCache;
	/**
	 * the telnet user entry
	 */
	private user: any;
	/**
	 * the telnet session entry
	 */
	private session: SessionEntry;
	/**
	 * the telnet server instance
	 */
	private server: TelnetServer;
	/**
	 * loggers for the console
	 */
	private logs: PipeFactory;
	/**
	 * projects cache
	 */
	private projects: ProjectCache;

	/**
	 * constructor for the InfinityConsole, see {@link app/window.InfinityMintWindow}
	 * @param options
	 * @param pipeFactory
	 * @param telnetServer
	 * @param eventEmitter
	 */
	constructor(
		options?: InfinityMintConsoleOptions,
		pipeFactory?: PipeFactory,
		telnetServer?: TelnetServer,
		eventEmitter?: InfinityMintEventEmitter,
	) {
		this.logs = pipeFactory || globalLogs;
		createPipes(this.logs);

		this.windows = [];
		this.allowExit = true;
		this.options = options;
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
				height: '75%',
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

	/**
	 * returns a guuidv4 id
	 * @returns
	 */
	private generateId() {
		return uuidv4();
	}

	/**
	 * will return the telnet username of this console
	 * @returns
	 */
	public getTelnetUsername() {
		if (!this.client) return 'root';
	}

	/**
	 * set the telnet client of this console. you should not need to call this method.
	 * @param client
	 */
	public setTelnetClient(client: any) {
		this.client = client;
	}

	/**
	 * sets the event emitter of this console to another consoles event emitter returning the old one
	 * @param otherConsole
	 * @returns
	 */
	public setEventEmitter(otherConsole: InfinityConsole) {
		let oldEmitter = this.eventEmitter;
		this.eventEmitter = otherConsole.eventEmitter;
		return oldEmitter;
	}

	/**
	 * returns the telnet server of this console
	 * @returns
	 */
	public getTelnetServer() {
		return this.server;
	}

	/**
	 * retursn true if this console is a telnet console
	 * @returns
	 */
	public isTelnet() {
		let config = getConfigFile();
		return config.telnet && this.server !== undefined;
	}

	/**
	 * creates a new event emitter for this console
	 * @param dontCleanListeners
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

	/**
	 * gets the consoles session id. this is used to identify the console in the telnet server as well as also being used to identify the console in the event emitter
	 * @returns
	 */
	public getSessionId(): string {
		return this.sessionId;
	}

	/**
	 * gets the consoles event emitter
	 * @returns
	 */
	public getEventEmitter(): InfinityMintEventEmitter {
		return this.eventEmitter;
	}

	/**
	 * gets the screen the console is running on
	 * @returns
	 */
	public getScreen(): BlessedElement {
		return this.screen;
	}

	/**
	 * returns the current account of the console which is the first member of the signers array but with a correctly resolved address
	 * @returns
	 */
	public getAccount(): SignerWithAddress {
		return this.account;
	}

	/**
	 * returns the current balance of the account
	 * @returns
	 */
	public getBalance(): BigNumber {
		return this.balance;
	}

	/**
	 * returns the current chain id
	 * @returns
	 */
	public getCurrentChainId(): number {
		return this.chainId;
	}

	/**
	 * returns the pipe factory which holds the loggers for the console
	 * @returns
	 */
	public getGlobalLogs(): PipeFactory {
		return globalLogs;
	}

	/**
	 * logs a message to the console
	 * @param msg
	 * @param pipe
	 */
	public log(msg: string, pipe?: string) {
		this.logs.log(msg, pipe || 'default');
	}

	/**
	 * logs an error to the console
	 * @param error
	 */
	public error(error: Error) {
		if (this.isTelnet())
			this.logs.log(
				'{red-fg}' + error.message + '\n' + error.stack + '{/red-fg}',
			);
		else console.error(error);

		this.logs.error(error);
	}

	/**
	 * initializes the input keys property to equal the default keyboard shortcuts allowing the user to navigate the console and close windows
	 */
	public registerDefaultKeys() {
		const close = (ch: string, key: string) => {
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
		};
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
					if (!this.windowManager?.hidden) this.currentWindow?.show();
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
			'C-c': [close],
		};
	}

	/**
	 * gets the first signer currently set in the console
	 * @returns
	 */
	public getSigner(): SignerWithAddress {
		return this.getSigners()[0];
	}

	/**
	 * gets all the signers currently set in the console
	 * @returns
	 */
	public getSigners(): SignerWithAddress[] {
		if (!this.signers)
			throw new Error('signers must be initialized before getting signer');

		return this.signers;
	}

	/**
	 * reloads a window by removing it from the windows array, removing the cached window and then re-instantiating it. This reloads the script which defines the window with code updates and re-renders the window
	 * @param thatWindow
	 */
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
				this.debugLog('{cyan-fg}Reimporting ' + window.name + '{/cyan-fg}');
				let newWindow = requireWindow(fileName, this);
				this.debugLog(
					'{green-fg}Successfully Reimported ' +
						newWindow.name +
						`{/green-fg} <${newWindow.getId()}>`,
				);
				window.destroy();
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

	/**
	 * registers events on the window
	 * @param window
	 * @returns
	 */
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

		window.data.destroy = () => {
			this.updateWindowsList();
		};
		window.on('destroy', window.data.destroy);

		//so we only fire once
		if (window.data.hide) window.off('hide', window.data.hide);

		//when the current window is hiden, rebuild the item
		window.data.hide = () => {
			this.updateWindowsList();
		};
		window.on('hide', window.data.hide);
	}

	/**
	 * sets current window to what ever is passed in and shows it
	 * @param thatWindow
	 * @returns
	 */
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

	/**
	 * destroys the console
	 */
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

	/**
	 * cleans up the console ready to be reloaded
	 */
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
		this.windowManager?.destroy();
		this.windowManager = undefined;

		this?.registerDefaultKeys();
	}

	/**
	 * reloads the projects
	 */
	public async reloadProjects() {
		let projects = await findProjects();
		this.projects = saveProjects(projects);
	}

	/**
	 * reloads the console
	 * @param dontRefreshImports
	 */
	public async reload(dontRefreshImports?: boolean) {
		this.hasInitialized = false;
		try {
			this.log(`📦 Reinitializing UI<${this.sessionId}>`);
			this.emit('reloaded');
			this.cleanup();
			//render
			this.screen.render();

			this.setLoading('Reinitializing', 20);
			this.stopLoading();
			await this.initialize();

			//render
			this.screen.render();

			await this.refreshImports(!dontRefreshImports);
			await this.reloadWindow(this.currentWindow);
		} catch (error) {
			this.errorHandler(error);
		}
	}

	/**
	 * Returns the current consoles windows
	 * @returns
	 */
	public getWindows(): InfinityMintWindow[] {
		return this.windows;
	}

	/**
	 * gets a window by its guid
	 * @param id
	 * @returns
	 */
	public getWindowById(id: string | Window): InfinityMintWindow {
		return this.windows
			.filter(thatWindow => thatWindow.getId() === id.toString())
			.pop();
	}

	/**
	 * returns the current consoles imports
	 * @returns
	 */
	public getImports(): ImportCache {
		return this.imports;
	}

	/**
	 * gets a list of windows orderd by creation date
	 * @param name
	 * @param oldest
	 * @returns
	 */
	public getWindowByAge(name: string, oldest: boolean): InfinityMintWindow[] {
		let windows = this.getWindowsByName(name);
		if (oldest) {
			windows = windows.sort((a, b) => {
				return a.getCreation() - b.getCreation();
			});
		} else {
			windows = windows.sort((a, b) => {
				return b.getCreation() - a.getCreation();
			});
		}

		return windows;
	}

	/**
	 * Returns a list of windows with the same name
	 * @param name
	 * @returns
	 */
	public getWindowsByName(name: string): InfinityMintWindow[] {
		return this.windows.filter(thatWindow => thatWindow.name === name);
	}

	/**
	 * gets the current tick of the console. The tick is the number of times the console has been updated. The speed of which the console updates is determined by the config file
	 * @returns
	 */
	public getTick(): number {
		return this.tick;
	}

	/**
	 * Adds a window to the console
	 * @param window
	 */
	public addWindow(window: InfinityMintWindow) {
		if (this.hasWindow(window))
			throw new Error('window with that id is already inside of the console');

		this.windows.push(window);
	}

	/**
	 * returns true if there is a request to kill the current audio stream
	 * @returns
	 */
	public audioAwaitingKill(): boolean {
		if (!getConfigFile().music) return false;
		return this.currentAudioAwaitingKill;
	}

	/**
	 * returns a window by name
	 * @param windowName
	 * @returns
	 */
	public getWindow(windowName: string): InfinityMintWindow {
		return this.getWindowsByName(windowName)[0];
	}

	/**
	 * returns true if the window exists
	 * @param windowName
	 * @returns
	 */
	public windowExists(windowName: string): boolean {
		return this.getWindowsByName(windowName).length !== 0;
	}

	/**
	 * returns true if audio is current playing
	 * @returns
	 */
	public isAudioPlaying(): boolean {
		if (!getConfigFile().music) false;
		return !!this.currentAudio;
	}

	/**
	 * Stops the current audio file
	 * @returns
	 */
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

	/**
	 * plays an audio file using a child process to a music player executable on the system. Does not work if music is disabled in config. Will not work over telnet. Might not work on windows.
	 * @param path
	 * @param onFinished
	 * @param onKilled
	 * @returns
	 */
	public playAudio(path: string, onFinished?: Function, onKilled?: Function) {
		if (!getConfigFile().music) return;
		this.currentAudioKilled = false;
		this.debugLog('playing => ' + cwd() + path);
		// configure arguments for executable if any
		this.currentAudio = this.player.play(
			cwd() + path,
			{afplay: ['-v', 1] /* lower volume for afplay on OSX */},
			(err: Error | any) => {
				if (err && !this.currentAudio.killed) {
					if (isEnvTrue('THROW_ALL_ERRORS')) throw err;
					else warning('cannot play file: ' + err?.message);
					return;
				}

				if (this.currentAudio.killed) {
					this.debugLog('killed => ' + cwd() + path);
					this.currentAudio = null;
					this.currentAudioKilled = true;
					if (onKilled) onKilled(this.currentWindow, this);
				} else {
					this.debugLog('finished playing => ' + cwd() + path);
					this.currentAudio = null;
					if (onFinished) onFinished(this.currentWindow, this);
				}
			},
		);
	}

	/**
	 * gets the current window
	 * @returns
	 */
	public getCurrentWindow(): InfinityMintWindow {
		return this.currentWindow;
	}

	/**
	 * Returns true if there is a current window
	 * @returns
	 */
	public hasCurrentWindow(): boolean {
		return !!this.currentWindow;
	}

	/**
	 * Returns true if the current window has killed the audio after it was requested to stop playing.
	 * @returns
	 */
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

	public hasWindow = (window: InfinityMintWindow): boolean => {
		return (
			this.windows.filter(thatWindow => thatWindow.getId() === window.getId())
				.length !== 0
		);
	};

	/**
	 * Updates the windows list with the current windows in the console
	 * @returns
	 */
	public updateWindowsList() {
		if (this.options.dontDraw) return;

		this.windowManager.setBack();
		this.windowManager.enableKeys();
		this.windowManager.enableMouse();
		try {
			this.windowManager.setItems(
				this.windows
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

	/**
	 * shows a loading bar with a message in the center of the screen
	 * @param msg
	 * @param filled
	 * @returns
	 */
	public setLoading(msg: string, filled?: number) {
		if (this.options.dontDraw) return;

		this.loadingBox.setFront();
		this.loadingBox.load(msg);
		this.loadingBox.filled = this.loadingBox.filled || filled || 100;
		this.screen.render();
	}

	public isDrawing() {
		return this.options.dontDraw !== true;
	}

	/**
	 * stops the loading bar from appearing
	 * @returns
	 */
	public stopLoading() {
		if (this.options.dontDraw) return;

		this.loadingBox.stop();
		this.loadingBox.setBack();
		this.screen.render();
	}

	/**
	 * creates the window manager
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
		this.windowManager.on('select', async (_el: any, selected: any) => {
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
		//append window manager to the screen
		this.screen.append(this.windowManager);
	}

	/**
	 * Overwrites the key and mouse events on the blessed screen object to capture errors
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

	/**
	 *
	 * @param scriptName
	 * @returns
	 */
	public getScript(scriptName: string): InfinityMintScript {
		return this.scripts.find(
			script =>
				script.name.toLowerCase() === scriptName.toLowerCase() ||
				script.fileName.split('.')[0].toLowerCase() ===
					scriptName.toLowerCase(),
		);
	}

	/**
	 * Displays an error in a box. Will not display if the console is not drawing.
	 * @param error
	 * @param onClick
	 */
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
			keys: true,
			mouse: true,
			keyboard: true,
			parent: this.screen,
			height: '80%',
			scrollable: true,
			draggable: true,
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
			content: `{white-bg}{black-fg}CRITICAL ERROR - SYSTEM MALFUCTION{/white-bg} {underline}(control-c/cmd-c to close this box){/underline}\n\n{black-bg}{white-fg}${
				error.message
			}{/black-bg}{/white-fg}\n\n{white-bg}{black-fg}thrown on ${new Date(
				Date.now(),
			).toString()}{/black-fg}{/white-bg}\n{white-bg}{black-fg}infinitymint-beta ${getInfinityMintVersion()}{/black-fg}{/white-bg}\n\n${
				error.stack
			}`,
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

		this.screen.append(this.errorBox);
		this.screen.render();

		this.errorBox.setFront();
		this.errorBox.focus();
		this.errorBox.enableInput();
		this.errorBox.enableKeys();
	}

	/**
	 * This method is used to register keyboard shortcuts which are included in each console by default. It is also used to register new keys if the console is reloaded.
	 * @returns
	 */
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

	/**
	 * sets the allow exit flag for this console.
	 * @param canExit
	 */
	public setAllowExit(canExit: boolean) {
		this.allowExit = canExit;
	}
	/**
	 * Sets the telnet session for this console.
	 * @param session
	 */
	public setTelnetSession(session: any) {
		this.session = session;
	}

	/**
	 * Sets the telnet user for this console.
	 * @param user
	 */
	public setTelnetUser(user: any) {
		this.user = user;
	}

	/**
	 * Returns the telnet client for this console.
	 * @returns
	 */
	public getTelnetClient(): any {
		return this.client;
	}

	/**
	 * Used by the close method to determine if the console can exit or not.
	 * @returns
	 */
	public canCloseInfinityMint(): boolean {
		return this.allowExit;
	}

	/**
	 * Changes the web3 provider to a new network, reloading the console and all windows and elements.
	 * @param string
	 * @returns
	 */
	public async changeNetwork(string: string): Promise<JsonRpcProvider> {
		changeNetwork(string);
		await this.reload(true);
		return ethers.provider;
	}

	/**
	 * assigns a key to a method for this console. Used by the console, windows and elements to register keyboard shortcuts
	 * @param key
	 * @param cb
	 * @returns
	 */
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

	/**
	 * Returns the PipeFactory instance associated with this console
	 * @returns
	 */
	public getConsoleLogs() {
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
	/**
	 * handles errors
	 * @param error
	 * @param cb
	 */
	public errorHandler(error: Error, cb?: Function) {
		this.error(error);

		if (isEnvTrue('THROW_ALL_ERRORS') || this.options?.throwErrors) {
			this.stopLoading();
			throw error;
		}

		if (!this.options?.dontDraw)
			this.displayError(error as Error, () => {
				this.errorBox.destroy();
				this.errorBox = undefined;
				if (cb) cb();
			});
	}

	public getCurrentTokenSymbol(): string {
		return 'eth';
	}

	public getCurrentNetwork(): Network {
		return this.network;
	}

	public async refreshWeb3() {
		try {
			this.network = hre.network;
			this.setLoading('Refreshing "' + hre.network.name + '"', 10);
			this.chainId = (await ethers.provider.getNetwork()).chainId;
			this.signers = await ethers.getSigners();
			this.account = this.signers[getDefaultAccountIndex()];
			this.balance = await this.account.getBalance();
		} catch (error) {
			this.stopLoading();
			this.errorHandler(error, async () => {
				this.errorBox.destroy();
				this.errorBox = undefined;
				try {
					await this.refreshWeb3();
				} catch (error) {
					warning('could not refresh web3');
				}
			});
		}
		this.stopLoading();
	}

	/**
	 * Returns the current web3 provider for the console, you should use this over getProvider at all times
	 * @returns
	 */

	public getProvider(): JsonRpcProvider {
		return ethers.provider;
	}

	public getScripts(): InfinityMintScript[] {
		return this.scripts || [];
	}

	/**
	 * Used to get the deployment classes relating to a project, must pass the Infinity Console.
	 * @param projectName
	 * @param console
	 * @returns
	 */
	public async getProjectDeploymentClasses(
		projectName: string | InfinityMintTempProject | InfinityMintCompiledProject,
		gems?: boolean,
	): Promise<InfinityMintDeployment[]> {
		return await getProjectDeploymentClasses(projectName, this);
	}

	public async refreshScripts() {
		let config = getConfigFile();
		this.setLoading('Refreshing Scripts', 10);
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

		this.debugLog('{yellow-fg}{bold}Refreshing Scripts...{/}');
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
						config?.settings?.scripts?.disableJavascriptRequire.filter(
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
					} else this.debugLog(`\tusing old cache <${script.name}>`);

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

				this.debugLog(
					`{green-fg}Script Required Successfully{/green-fg} <${script.name}>`,
				);
			} catch (error) {
				if (isEnvTrue('THROW_ALL_ERRORS')) throw error;

				this.logs.getPipe(this.logs.currentPipeKey).error(error);
				this.debugLog(
					`{red-fg}Script Failure: {/red-fg} ${error.message} <${script.name}>`,
				);
			}
		}
		this.stopLoading();
	}

	/**
	 * logs to console but on the debug pipe
	 * @param msg
	 * @returns
	 */
	public debugLog(msg: string) {
		//throw away debug log
		if (!this.logs.pipes['debug']) return;

		return this.logs.log(msg, 'debug');
	}

	/**
	 * non typed emit
	 * @param eventName
	 * @param eventParameters
	 * @param eventType
	 * @returns
	 */
	public emitAny(eventName: string, eventParameters?: any, eventType?: any) {
		return this.emit(eventName as any, eventParameters, eventType);
	}

	/**
	 * typed emit
	 * @param eventName
	 * @param eventParameters
	 * @param eventType
	 * @returns
	 */
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
				this.log(msg.toString());
			},
			eventEmitter: this.eventEmitter,
			debugLog: msg => {
				this.log(msg.toString(), 'debug');
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
	 * creates the current window
	 * @returns
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
	 * destroys a window, can pass in a window, id, or name
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
				this.debugLog(
					'{cyan-fg}Reimporting ' + this.windows[i].name + '{/cyan-fg}',
				);
				this.windows[i].destroy();
				this.windows[i] = requireWindow(fileName, this);
				this.windows[i].setFileName(fileName);
				this.debugLog(
					'{green-fg}Successfully Reimported ' +
						this.windows[i].name +
						`{/green-fg} <${this.windows[i].getId()}>`,
				);
			}
		}
	}

	/**
	 * refreshes all windows
	 */
	public async refreshWindows() {
		let windows = await findWindows();

		this.windows = [];
		this.debugLog('{yellow-fg}{bold}Refreshing Windows...{/}');
		for (let i = 0; i < windows.length; i++) {
			this.debugLog('{cyan-fg}Importing{/cyan-fg} => ' + windows[i]);
			let window = requireWindow(windows[i], this) as InfinityMintWindow;
			if (!window.hasContainer()) window.setContainer(this);
			else warning('window has container already');
			window.setFileName(windows[i]);
			this.windows.push(window);
			this.debugLog(
				`{green-fg}Succesfully Required ${window.name}{/green-fg} <` +
					window.getId() +
					'>',
			);
			this.updateWindowsList();
		}
	}

	/**
	 * refreshs the imports in the cache to be used by the window manager. Imports are gathers from the imports folder.
	 * @param useFresh
	 */
	public async refreshImports(useFresh?: boolean) {
		this.setLoading('Refreshing Imports');
		this.imports = await getImports(useFresh, this);
		this.stopLoading();
	}

	/**
	 * Returns the list of paths to projects which have been found
	 * @returns
	 */
	public getParsedProjects(): Dictionary<path.ParsedPath> {
		return this.projects.database;
	}

	/**
	 * Loads infinity mint and all of its components, used if we are not drawing console
	 */
	public async load() {
		this.setLoading('Loading Imports', 10);
		//refresh imports
		if (!this.imports || !hasImportCache()) await this.refreshImports();

		await this.refreshWeb3();
		await this.refreshScripts();
		//create the window manager
		await this.refreshWindows();
		await this.reloadProjects();
	}

	/**
	 * Creates the window manager and all of its components, including the current window and any windows which are set to be instantiated on startup
	 */
	public async create() {
		try {
			//register core key events
			this.registerKeys();
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
				this.stopLoading();
			}

			this.debugLog(
				`finished initializing ${instantInstantiate.length} windows`,
			);

			this.setLoading('Loading Current Window', 70);
			await this.createCurrentWindow(); //create the current window
			this.stopLoading();
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
	}

	/**
	 * Initializes the InfinityConsole, calling all necessary functions to get the console up and running. This function is asynchronous and should be called with await.
	 * @returns
	 */
	public async initialize() {
		//if the network member has been defined then we have already initialized
		if (this.network) throw new Error('console already initialized');

		if (this.options.dontDraw) {
			await this.load();
			this.hasInitialized = true;
			return;
		}

		if (!fs.existsSync('./artifacts')) {
			this.setLoading('Compiling Contracts', 10);
			await hre.run('compile');
			this.stopLoading();
		}
		//create the window manager
		this.createWindowManager();
		this.setLoading('Loading Projects', 20);
		await this.reloadProjects();
		this.stopLoading();
		this.debugLog(`initializing windows and scripts<${this.sessionId}>`);
		await this.refreshWindows();
		await this.refreshScripts();
		this.debugLog(`updating imports<${this.sessionId}>`);
		await this.refreshImports();
		this.debugLog(`initializing  web3<${this.sessionId}>`);
		await this.refreshWeb3();
		this.debugLog(`loading InfinityConsole<${this.sessionId}>`);

		//dont draw
		if (!this.options.dontDraw) {
			await this.create();
			//the think method for this console
			let int = () => {
				if (!this.hasInitialized) return;
				this.loadingBox.setFront();
				if (this.errorBox !== undefined) this.errorBox.setFront();

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
							if (!this.options.dontDraw && element.alwaysBack)
								element.setBack();
							if (!this.options.dontDraw && element.alwaysFront)
								element.setFront();
							if (!this.options.dontDraw && element.alwaysFocus)
								element.focus();
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
			}, this.options?.tickRate || 66);
		} else
			warning(`not starting blessed on InfinityConsole<${this.sessionId}>`);

		this.log(`🎨 Initialized UI<${this.sessionId}>`);
		this.stopLoading();
		this.hasInitialized = true;
		this.emit('initialized');
	}
}
export default InfinityConsole;
