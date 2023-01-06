import { Dictionary } from "form-data";
import {
	Rectangle,
	FuncTripple,
	debugLog,
	readSession,
	saveSession,
	isEnvTrue,
	calculateWidth,
	warning,
	BlessedElementOptions,
	getConfigFile,
	log,
	getCurrentProjectPath,
} from "./helpers";
import { BlessedElement, Blessed } from "./helpers";
import hre, { ethers } from "hardhat";
import InfinityConsole from "./console";
import { KeyValue } from "./interfaces";

const { v4: uuidv4 } = require("uuid");
const blessed = require("blessed") as Blessed;

/**
 * @experimental
 */
export class InfinityMintWindow {
	public initialize: FuncTripple<
		InfinityMintWindow,
		BlessedElement,
		Blessed,
		Promise<void>
	>;
	public think: FuncTripple<
		InfinityMintWindow,
		BlessedElement,
		Blessed,
		void
	>;
	public name: string;
	public elements: Dictionary<BlessedElement>;
	/**
	 * data which is saved to session file
	 */
	public options: KeyValue;
	/**
	 * data which is not saved
	 */
	public data: KeyValue;
	/**
	 * @default "100%"
	 */
	protected width: number | string;
	/**
	 * @default "100%"
	 */
	protected height: number | string;
	protected hideButton: BlessedElement;
	protected refreshButton: BlessedElement;
	protected closeButton: BlessedElement;
	protected frame: BlessedElement;
	/**
	 * @default 1
	 */
	protected padding: number | string;
	protected style: any;
	protected border: any;
	/**
	 * @default "center"
	 */
	protected x: number | string;
	/**
	 * @default "center"
	 */
	protected y: number | string;
	protected scrollbar: any;
	protected hideCloseButton: boolean;
	protected hideMinimizeButton: boolean;
	protected hideRefreshButton: boolean;
	protected hideFromMenu: boolean;
	protected refresh: boolean;
	protected z: number;
	protected screen: BlessedElement;
	protected container?: InfinityConsole;
	protected inputKeys?: Dictionary<Array<Function>>;

	private id: any;
	private destroyed: boolean;
	private backgroundThink: boolean;
	private destroyId: boolean;
	private initialized: boolean;
	private creation: any;
	private initialCreation: any;
	private autoInstantiate: boolean;
	private fileName: string;

	constructor(
		name?: string,
		style?: any,
		border?: any,
		scrollbar?: any,
		position?: {
			x: string | number;
			y: string | number;
		},
		size?: {
			width: string | number;
			height: string | number;
		},
		options?: any
	) {
		this.name = name || this.constructor.name;
		this.width = size?.width || "100%";
		this.height = size?.height || "100%";
		this.x = position?.x || "center";
		this.y = position?.y || "center";
		this.destroyed = false;
		this.z = 0;
		this.style = style;
		this.border = border;
		this.scrollbar = scrollbar;
		this.backgroundThink = false;
		this.initialized = false;
		this.destroyId = true;
		this.autoInstantiate = false;
		this.refresh = true;
		this.options = options || {};
		this.initialCreation = Date.now();
		this.elements = {};
		this.data = {};
		//replace with GUID
		this.id = this.generateId();
		this.initialize = async () => {};
	}

	public setFileName(fileName?: string) {
		this.fileName = fileName || __filename;
	}

	public getFileName() {
		return this.fileName;
	}

	public setHiddenFromMenu(hidden: boolean) {
		this.hideFromMenu = hidden;
	}

	public isHiddenFromMenu() {
		return this.hideFromMenu;
	}
	/**
	 * Will hide the close button if true, can be called when ever but be aware screen must be re-rendered in some circumstances.
	 * @param hideCloseButton
	 */
	public setHideCloseButton(hideCloseButton: boolean) {
		this.hideCloseButton = hideCloseButton;

		if (!this.closeButton && !this.hideButton) return;

		if (this.hideCloseButton) {
			this.closeButton.hide();
			this.hideButton.right = 0;
		} else {
			this.closeButton.show();
			this.hideButton.right = calculateWidth(this.closeButton) + 2;
		}
	}

	/**
	 * Will hide the minimize button if true, can be called when ever but be aware screen must be re-rendered in some circumstances
	 * @param hideMinimizeButton
	 */
	public setHideMinimizeButton(hideMinimizeButton: boolean) {
		this.hideMinimizeButton = hideMinimizeButton;

		if (!this.hideButton) return;
	}

	private generateId() {
		return uuidv4();
	}

	public setScreen(screen: any) {
		if (this.screen)
			this.warning(`setting screen with out window object first`);

		this.screen = screen;
	}

	public setScrollbar(scrollbar: any) {
		this.scrollbar = scrollbar;

		if (this.elements["frame"])
			this.getElement("frame").scrollbar = scrollbar;
	}

	public setBackgroundThink(backgroundThink: boolean) {
		this.backgroundThink = backgroundThink;
	}

	public setShouldInstantiate(instantiateInstantly: boolean) {
		this.autoInstantiate = instantiateInstantly;
	}

	///TODO: needs to be stricter
	public hasContainer() {
		return !!this.container;
	}

	public shouldInstantiate(): boolean {
		return this.autoInstantiate;
	}

	public shouldBackgroundThink(): boolean {
		return this.backgroundThink;
	}

	/**
	 * sets if the window should destroy its id upon being destoryed. or have a persistant id.
	 * @param shouldDestroyId
	 */
	public setDestroyId(shouldDestroyId: boolean) {
		this.destroyId = shouldDestroyId;
	}

	/**
	 * Set the current window container / infinityconsole / terminal container for this window
	 * @param container
	 */
	public setContainer(container: InfinityConsole) {
		if (this.container)
			throw new Error(
				"cannot set container with out destroying window first"
			);

		this.container = container;
	}

	/**
	 * Opens another infinity mint window, closing this one.
	 * @param name
	 */
	public async openWindow(name: string) {
		this.container?.gotoWindow(name);
	}

	/**
	 *
	 * @returns
	 */
	public getCreation() {
		return this.creation;
	}

	/**
	 *
	 * @returns
	 */
	public getInitialCreation() {
		return this.initialCreation;
	}

	/**
	 * A fully mutable object which can hold options which persist between InfinityMint terminal sessions. You can use this along with saveOptions to write variables to the .session file.
	 *
	 * See {@link app/interfaces.InfinityMintSession}
	 * @param defaultOptions
	 */
	public loadOptions(
		defaultOptions?: Dictionary<any>,
		elementDefaultOptions?: Dictionary<KeyValue>
	) {
		let session = readSession();
		this.options = session.environment["Window_" + this.name] || {};

		Object.keys(defaultOptions || {}).forEach((key) => {
			if (!this.options[key]) this.options[key] = defaultOptions[key];
		});

		Object.keys(this.elements).forEach((key) => {
			let element = this.elements[key];
			element.options =
				session.environment["Window_" + this.name + "_" + key] || {};

			if (elementDefaultOptions[key])
				Object.keys(elementDefaultOptions[key] || {}).forEach(
					(elementKey) => {
						if (!element.options[elementKey])
							element.options[elementKey] =
								elementDefaultOptions[key][elementKey];
					}
				);
		});
	}

	public saveOptions() {
		let session = readSession();
		session.environment["Window_" + this.name] = this.options;

		Object.keys(this.elements).forEach((key) => {
			let element = this.elements[key];
			if (element?.options)
				session.environment["Window_" + this.name + "_" + key] =
					element?.options;
		});

		this.log("saving window options");
		saveSession(session);
	}

	/**
	 * Returns a clone of this window
	 * @param options
	 * @param data
	 * @returns
	 */
	public clone(name?: string, style?: {}, options?: {}, data?: {}) {
		let clone = new InfinityMintWindow(
			name || this.name,
			style || this.style,
			this.border,
			this.scrollbar,
			{ x: this.x, y: this.y },
			{ width: this.width, height: this.height },
			{ ...this.options, ...(options || {}) }
		);
		clone.initialize = this.initialize;
		clone.think = this.think;
		clone.setBackgroundThink(this.backgroundThink);
		clone.setShouldInstantiate(this.autoInstantiate);
		clone.setHideMinimizeButton(this.hideMinimizeButton);
		clone.setHideCloseButton(this.hideCloseButton);
		clone.setHideRefreshButton(this.hideRefreshButton);
		clone.setCanRefresh(this.refresh);
		clone.data = { ...this.data, ...(data || {}) };
		clone.data.clone = true;
		return clone;
	}

	/**
	 * Returns true if this window can be refreshed
	 * @returns
	 */
	public canRefresh() {
		return this.refresh;
	}

	/**
	 * Sets if this window can be refreshed
	 * @param canRefresh
	 */
	public setCanRefresh(canRefresh: boolean) {
		this.refresh = canRefresh;
	}

	/**
	 * Returns true if we have an InfinityConole set on this window
	 * @returns
	 */
	public hasInfinityConsole() {
		return !!this.container;
	}

	/**
	 * Get the infinity console this window is contained in. Through the InfinityConsole you can change the network, refresh web3 and do a lot more!
	 * @returns
	 */
	public getInfinityConsole() {
		if (!this.container)
			throw new Error("no infinityconsole associated with this window");

		return this.container;
	}

	public setBorder(border: any) {
		this.border = border;

		if (this.elements["frame"]) this.getElement("frame").border = border;
	}

	public getBorder(): object {
		return this.border;
	}

	public setWidth(num: number | string) {
		this.width = num;
	}

	public setPadding(num: number | string) {
		this.padding = num;
	}

	public getId() {
		return this.id;
	}

	public isEqual(thatWindow: InfinityMintWindow) {
		return this.id === thatWindow.id;
	}

	public toString() {
		return this.id;
	}

	public setHeight(num: number | string) {
		this.height = num;
	}

	public getRectangle(): Rectangle {
		return {
			startX: this.x,
			endX:
				typeof this.width === "number"
					? parseInt(this.x.toString()) + (this.width as number)
					: this.width,
			startY: this.y,
			endY:
				typeof this.height === "number"
					? parseInt(this.y.toString()) + (this.height as number)
					: this.height,
			width: this.width,
			height: this.height,
			z: this.z,
		};
	}

	public getStyle(): object {
		return this.style;
	}

	public setStyle(style: any) {
		this.style = style;

		if (this.elements["frame"]) this.getElement("frame").style = style;
	}

	public getWidth() {
		return this.width;
	}

	public getX() {
		return this.x;
	}

	public getY() {
		return this.y;
	}

	public getHeight() {
		return this.height;
	}

	public hide() {
		this.log("hiding");
		Object.values(this.elements).forEach((element) => {
			if (!element.hidden) {
				element.shouldUnhide = true;
				element.hide();
			}
			try {
				element.disableMouse();
			} catch (error) {
				//element might not have disable mouse method
			}
		});
	}

	public show() {
		this.log(`showing`);
		Object.values(this.elements).forEach((element) => {
			if (element.shouldUnhide) {
				element.shouldUnhide = false;
				element.show();
			}
			try {
				element.enableMouse();
			} catch (error) {
				//element might not have enable mouse method so
			}
		});
	}

	public setSize(width: number | string, height: number | string) {
		this.width = width;
		this.height = height;
	}

	public log(
		string?: string | string[],
		window?: any,
		returnString?: boolean
	) {
		window = window || this;
		if (typeof string === typeof Array)
			string = (string as string[]).join(" ");

		if (returnString)
			return string + ` => <${window.name}>[${window.getId()}]`;

		log(string + ` => <${window.name}>[${window.getId()}]`, "windows");
	}

	public warning(
		string?: string | string[],
		window?: any,
		returnString?: boolean
	) {
		window = window || this;
		if (typeof string === typeof Array)
			string = (string as string[]).join(" ");

		if (returnString)
			return string + ` => <${window.name}>[${window.getId()}]`;

		warning(string + ` => <${window.name}>[${window.getId()}]`);
	}

	/**
	 * Registers a new blessed element with the window.
	 * @param key
	 * @param element
	 * @returns
	 */
	public registerElement(
		key: string,
		element: BlessedElement,
		dontRegister?: boolean
	): BlessedElement {
		if (this.elements[key])
			throw new Error("key already registered in window: " + key);

		if (element.window)
			throw new Error(
				this.log(
					"element (" +
						element.constructor.name +
						") is already registered to ",
					null,
					true
				)
			);

		if (this.frame && !element.parent) element.parent = this.frame;

		this.log("registering element (" + element.constructor.name + ")");

		element.window = this;
		//does the same a above
		element.oldOn = element.on;
		element.on = (param1: any, cb: any) => {
			if (typeof cb === typeof Promise)
				this.elements[key].oldOn(param1, async (...any: any[]) => {
					try {
						await cb(...any);
					} catch (error) {
						this.getInfinityConsole().errorHandler(error);
					}
				});
			else
				this.elements[key].oldOn(param1, (...any: any[]) => {
					try {
						cb(...any);
					} catch (error) {
						this.getInfinityConsole().errorHandler(error);
					}
				});
		};
		element?.focus();

		if (dontRegister) return element;

		this.elements[key] = element;
		return this.elements[key];
	}

	public getElement(key: string): BlessedElement {
		return this.elements[key];
	}

	public getScrollbar() {
		return this.scrollbar;
	}

	public update() {
		if (this.think) {
			this.think(this, this.getElement("frame"), blessed);
		}
	}

	public getScreen() {
		return this.screen;
	}

	public destroy() {
		this.log("destroying");
		this.destroyed = true;
		this.initialized = false;
		//unkeys everything to do with the window
		if (this.inputKeys)
			Object.keys(this.inputKeys).forEach((key) => {
				Object.values(this.inputKeys[key]).forEach((cb) => {
					this.unkey(key, cb);
				});
			});

		Object.keys(this.elements).forEach((index) => {
			this.log(
				"destroying element (" +
					this.elements[index].constructor.name +
					")"
			);

			try {
				this.elements[index].free(); //unsubscribes to events saving memory
			} catch (error) {}
			try {
				this.elements[index].destroy();
			} catch (error) {}
			delete this.elements[index];
		});

		this.container = undefined;
		this.screen = undefined;

		this.elements = {};
		this.data = {};
		this.options = {};
	}

	/**
	 * Registers a key command to the window which then executes a function
	 * @param key
	 * @param cb
	 */

	public key(key: string, cb: Function) {
		if (!this.inputKeys) this.inputKeys = {};

		this.getInfinityConsole().key(key, cb);

		if (!this.inputKeys[key]) this.inputKeys[key] = [];
		this.inputKeys[key].push(cb);
	}

	/**
	 * Removes a key binding on the window, pass it a callback of the key to only remove that one. Else will remove all keys
	 * @param key
	 * @param cb
	 * @returns
	 */
	public unkey(key: string, cb?: Function) {
		if (!this.inputKeys || !this.inputKeys[key]) return;

		if (cb) this.getInfinityConsole().unkey(key, cb);
		else {
			//unmap all keys
			Object.values(this.inputKeys[key]).forEach((cb) => {
				this.getInfinityConsole().unkey(key, cb);
			});
			this.inputKeys[key] = [];
			return;
		}

		if (this.inputKeys[key].length <= 1) this.inputKeys[key] = [];
		else {
			this.inputKeys[key] = this.inputKeys[key].filter(
				(thatCb) => thatCb.toString() === cb.toString()
			);
		}
	}

	public isAlive() {
		return this.destroyed === false && this.initialized;
	}

	public hasInitialized() {
		return this.initialized;
	}

	public on(event: string, listener: Function): Function {
		if (!this.getElement("frame"))
			throw new Error("frame has not been created");

		return this.getElement("frame").on(event, listener);
	}

	public off(event: string, listener?: Function) {
		if (!this.getElement("frame")) return;
		this.getElement("frame").off(event, listener);
	}

	public isVisible() {
		return this.getElement("frame")?.hidden === false;
	}

	public async updateFrameTitle() {
		if (!this.hasInfinityConsole()) return;

		let account = this.getInfinityConsole().getAccount();
		let balance = this.getInfinityConsole().getBalance();
		let etherBalance = ethers.utils.formatEther(balance);
		let musicOptions = this.getInfinityConsole().windowExists("Music")
			? this.getInfinityConsole().getWindow("Music").options
			: {
					currentTrack: "nothing",
			  };
		let seconds = musicOptions.clock || 0;
		let minutes = seconds <= 0 ? 0 : Math.floor(musicOptions.clock / 60);

		this.getElement("frame").setContent(
			`{bold}${this.name}{/bold} {magenta-fg}=>{/magenta-fg} {yellow-fg}${
				hre.network.name
			}[${this.getInfinityConsole().getCurrentChainId()}] {underline}${account.address.substring(
				0,
				16
			)}...{/underline}{/yellow-fg} {black-bg}{white-fg}${
				getCurrentProjectPath().base ||
				"{red-fg}NO CURRENT PROJECT{red-fg}"
			}{/white-fg}{/black-bg} {white-fg}{bold}${etherBalance.substring(
				0,
				8
			)} ETH ($${(parseFloat(etherBalance) * 2222).toFixed(
				2
			)}){/bold}{/white-fg} {black-bg}{red-fg}{bold}150.2 gwei{/bold}{/red-fg}{/black-bg} {black-bg}{yellow-fg}{bold}120.2 gwei{/bold}{/yellow-fg}{/black-bg} {black-bg}{green-fg}{bold}110.2 gwei{/bold}{/green-fg}{/black-bg} {bold}{cyan-fg}♫{/cyan-fg}{/bold} {underline}{cyan-fg}${
				!getConfigFile().music
					? "music disabled"
					: musicOptions.currentTrack
			}{/cyan-fg}{/underline} {black-bg}{white-fg}${(minutes % 60)
				.toString()
				.padStart(2, "0")}:${(seconds % 60)
				.toString()
				.padStart(2, "0")}{/white-fg}{/black-bg}`
		);
	}

	/**
	 *
	 * @param hideRefreshButton
	 */
	public setHideRefreshButton(hideRefreshButton?: boolean) {
		this.hideRefreshButton = hideRefreshButton;

		if (this.refreshButton) {
			if (this.hideRefreshButton || !this.canRefresh)
				this.refreshButton.hide();
			else {
				this.refreshButton.show();
			}
		}
	}

	/**
	 *
	 * @param key
	 * @param options
	 * @param type - default of `box`
	 * @returns
	 */
	public createElement(
		key: string,
		options: BlessedElementOptions,
		type?:
			| "box"
			| "list"
			| "image"
			| "bigtext"
			| "listbar"
			| "listtable"
			| "layout"
	) {
		type = type || "box";

		if (!blessed[type] || typeof blessed[type] !== "function")
			throw new Error("bad blessed element: " + type);

		let element = this.registerElement(key, blessed[type](options));
		if (element?.options.parent) delete element.options.parent;
		if (options.alwaysFront) element.alwaysFront = options.alwaysFront;
		if (options.alwaysBack) element.alwaysBack = options.alwaysBack;
		if (options.alwaysUpdate) element.alwaysUpdate = options.alwaysUpdate;
		if (options.think) element.think = options.think;
		if (options.shouldFocus) element.shouldFocus = options.shouldFocus;

		if (options.instantlyCreate || options.instantlyAppend) {
			this.screen.append(element);
			this.screen.render();
		}

		return element;
	}

	public async create() {
		if (this.initialized && this.destroyed === false)
			throw new Error("already initialized");
		if (!this.screen)
			throw new Error("cannot create window with undefined screen");

		if (this.initialized && this.destroyed && this.destroyId) {
			let oldId = this.id;
			this.id = this.generateId();
			debugLog(`old id <${this.name}>[${oldId}] destroyed`);
		}
		this.creation = Date.now();
		this.log(`creating`);

		//set the title
		this.screen.title = this.name;
		// Create the frame which all other components go into
		this.frame = this.registerElement(
			"frame",
			blessed.layout({
				top: this.x,
				left: this.y,
				width: this.width,
				height: this.height.toString(),
				layout: "grid",
				tags: true,
				parent: this.screen,
				padding: this.padding || 1,
				scrollbar: this.scrollbar || {},
				border: this.border || {},
				style: this.style || {},
			}),
			true
		);
		this.elements["frame"] = this.frame;
		this.screen.append(this.frame);
		this.screen.render();

		this.frame.setBack();

		this.closeButton = this.createElement("closeButton", {
			top: -1,
			right: 2,
			width: 3,
			height: 3,
			shouldFocus: true,
			tags: true,
			padding: 0,
			alwaysFront: true,
			content: " ",
			border: this.border || {},
			style: {
				bg: "red",
				fg: "white",
				hover: {
					bg: "grey",
				},
			},
		});
		this.closeButton.on("click", () => {
			this.getInfinityConsole().destroyWindow(this);
		});
		this.hideButton = this.createElement("hideButton", {
			top: -1,
			right: this.hideCloseButton
				? 2
				: calculateWidth(this.closeButton) + 2,
			width: 3,
			height: 3,
			alwaysFront: true,
			shouldFocus: true,
			tags: true,
			padding: 0,
			content: " ",
			border: this.border || {},
			style: {
				bg: "yellow",
				fg: "white",
				hover: {
					bg: "grey",
				},
			},
		});
		this.hideButton.on("click", () => {
			this.hide();
		});
		this.refreshButton = this.createElement("refreshButton", {
			top: -1,
			right: this.hideCloseButton
				? calculateWidth(this.hideButton) + 2
				: calculateWidth(this.hideButton, this.closeButton) + 2,
			width: 3,
			height: 3,
			alwaysFront: true,
			shouldFocus: true,
			tags: true,
			padding: 0,
			content: " ",
			border: this.border || {},
			style: {
				bg: "blue",
				fg: "white",
				hover: {
					bg: "grey",
				},
			},
		});
		this.refreshButton.on("click", () => {
			this.getInfinityConsole().reloadWindow(this);
		});

		if (this.hideCloseButton) this.closeButton.hide();
		if (this.hideMinimizeButton) this.hideButton.hide();
		if (this.hideRefreshButton || !this.canRefresh)
			this.refreshButton.hide();

		this.log("calling initialize");
		try {
			await this.initialize(this, this.frame, blessed);
			this.destroyed = false;
			this.initialized = true;
		} catch (error) {
			this.getInfinityConsole().errorHandler(error);
		}

		//append each element
		Object.keys(this.elements).forEach((key) => {
			let element = this.elements[key];

			if (
				key !== "frame" &&
				!element.instantlyAppend &&
				!element.instantlyCreate
			) {
				this.screen.append(element);
			}

			if (element.shouldFocus) element.focus();
			if (element.alwaysBack) element.setBack();
			if (element.alwaysFront) element.setFront();
		});

		//render the screen
		this.screen.render();
		//update the title and frame
		this.hideButton.setFront();
		this.closeButton.setFront();
		//frame title
		await this.updateFrameTitle();
	}
}
