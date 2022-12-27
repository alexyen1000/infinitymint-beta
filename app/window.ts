import { Dictionary } from "form-data";
import {
	Rectangle,
	Vector,
	FuncTripple,
	log,
	debugLog,
	readSession,
	saveSession,
	getSolidityFolder,
	isEnvTrue,
	calculateWidth,
	warning,
} from "./helpers";
import { BlessedElement, Blessed } from "./helpers";
import hre, { ethers } from "hardhat";
import InfinityConsole from "./console";
import { getDefaultAccountIndex, getDefaultSigner } from "./web3";

const { v4: uuidv4 } = require("uuid");
const blessed = require("blessed");

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
	public options: any;
	/**
	 * @default "100%"
	 */
	protected width: number | string;
	/**
	 * @default "100%"
	 */
	protected height: number | string;
	protected hideButton: BlessedElement;
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
		this.options = options || {};
		this.initialCreation = Date.now();
		this.elements = {};
		//replace with GUID
		this.id = this.generateId();
		this.initialize = async () => {};
		this.think = () => {};
	}

	/**
	 * Will hide the close button if true, can be called when ever but be aware screen must be re-rendered in some circumstances.
	 * @param hideCloseButton
	 */
	public setHideCloseButton(hideCloseButton: boolean) {
		this.hideCloseButton = hideCloseButton;

		try {
			if (this.hideCloseButton && this.closeButton !== undefined) {
				this.closeButton.hide();
			} else if (
				!this.hideCloseButton &&
				this.closeButton !== undefined
			) {
				this.closeButton.show();
			}
		} catch (error) {
			if (isEnvTrue("THROW_ALL_ERRORS")) throw error;
			this.warning(
				"failed to edit visiblity of close button: " + error.message
			);
		}
	}

	/**
	 * Will hide the minimize button if true, can be called when ever but be aware screen must be re-rendered in some circumstances
	 * @param hideMinimizeButton
	 */
	public setHideMinimizeButton(hideMinimizeButton: boolean) {
		this.hideMinimizeButton = hideMinimizeButton;

		try {
			if (this.hideMinimizeButton && this.hideButton !== undefined) {
				this.hideButton.hide();
			} else if (
				!this.hideMinimizeButton &&
				this.hideButton !== undefined
			) {
				this.hideButton.show();
			}
		} catch (error) {
			if (isEnvTrue("THROW_ALL_ERRORS")) throw error;
			this.warning(
				"failed to edit visiblity of minimize button: " + error.message
			);
		}
	}

	private generateId() {
		return uuidv4();
	}

	public setScreen(screen: any) {
		if (this.screen !== undefined)
			throw new Error(
				"cannot change screen of window with out destroying it first"
			);

		this.screen = screen;
	}

	public setScrollbar(scrollbar: any) {
		this.scrollbar = scrollbar;

		if (this.elements["frame"] !== undefined)
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
		return this.container !== undefined;
	}

	public shouldInstantiate(): boolean {
		return this.autoInstantiate;
	}

	public shouldBackgroundThink(): boolean {
		return this.backgroundThink;
	}

	public setDestroyId(shouldDestroyId: boolean) {
		this.destroyId = shouldDestroyId;
	}

	public setContainer(container: InfinityConsole) {
		if (this.container !== undefined)
			throw new Error(
				"cannot set container with out destroying window first"
			);

		this.container = container;
	}

	public async openWindow(name: string) {
		this.container?.setWindow(name);
	}

	public getCreation() {
		return this.creation;
	}

	public getInitialCreation() {
		return this.initialCreation;
	}

	/**
	 * A fully mutable object which can hold options which persist between InfinityMint terminal sessions. You can use this along with saveOptions to write variables to the .session file.
	 *
	 * See {@link app/interfaces.InfinityMintSession}
	 * @param defaultOptions
	 */
	public loadOptions(defaultOptions: Dictionary<any>) {
		let session = readSession();
		this.options = session.environment["Window_" + this.name] || {};

		Object.keys(defaultOptions).forEach((key) => {
			if (this.options[key] === undefined)
				this.options[key] = defaultOptions[key];
		});
	}

	public saveOptions() {
		let session = readSession();
		session.environment["Window_" + this.name] = this.options;
		this.log("saving window options");
		saveSession(session);
	}

	public getContainer() {
		if (this.container === undefined)
			throw new Error("container is undefined");

		return this.container;
	}

	public setBorder(border: any) {
		this.border = border;

		if (this.elements["frame"] !== undefined)
			this.getElement("frame").border = border;
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

		if (this.elements["frame"] !== undefined)
			this.getElement("frame").style = style;
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
		debugLog(`showing <${this.name}>[${this.id}]`);
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

		debugLog(string + ` => <${window.name}>[${window.getId()}]`);
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
		element: BlessedElement
	): BlessedElement {
		if (this.elements[key] !== undefined)
			throw new Error("key already registered in window: " + key);

		if (element.window !== undefined)
			throw new Error(
				this.log(
					"element (" +
						element.constructor.name +
						") is already registered to ",
					null,
					true
				)
			);

		if (
			this.frame !== undefined &&
			(element.parent === undefined || element.parent === null)
		)
			element.parent = this.frame;

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
						this.getContainer().errorHandler(error);
					}
				});
			else
				this.elements[key].oldOn(param1, (...any: any[]) => {
					try {
						cb(...any);
					} catch (error) {
						this.getContainer().errorHandler(error);
					}
				});
		};
		element?.focus();
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
		if (this.think) this.think(this, this.getElement("frame"), blessed);
	}

	public getScreen() {
		return this.screen;
	}

	public destroy() {
		this.log("destroying");
		this.destroyed = true; //window needs to be set as destroyed
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

		//unkeys everything to do with the window
		if (this.inputKeys !== undefined)
			Object.keys(this.inputKeys).forEach((key) => {
				Object.values(this.inputKeys[key]).forEach((cb) => {
					this.unkey(key, cb);
				});
			});

		this.container = undefined;
		this.screen = undefined;
		this.elements = {};
	}

	/**
	 * Registers a key command to the window which then executes a function
	 * @param key
	 * @param cb
	 */

	public key(key: string, cb: Function) {
		if (this.inputKeys === undefined) this.inputKeys = {};

		this.getContainer().key(key, cb);

		if (this.inputKeys[key] === undefined) this.inputKeys[key] = [];
		this.inputKeys[key].push(cb);
	}

	/**
	 * Removes a key binding on the window, pass it a callback of the key to only remove that one. Else will remove all keys
	 * @param key
	 * @param cb
	 * @returns
	 */
	public unkey(key: string, cb?: Function) {
		if (this.inputKeys === undefined || this.inputKeys[key] === undefined)
			return;

		if (cb !== undefined) this.getContainer().unkey(key, cb);
		else {
			//unmap all keys
			Object.values(this.inputKeys[key]).forEach((cb) => {
				this.getContainer().unkey(key, cb);
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
		return this.initialized && this.destroyed === false;
	}

	public on(event: string, listener: Function): Function {
		if (this.getElement("frame") === undefined)
			throw new Error("frame has not been created");

		return this.getElement("frame").on(event, listener);
	}

	public off(event: string, listener?: Function) {
		if (this.getElement("frame") === undefined) return;
		this.getElement("frame").off(event, listener);
	}

	public isVisible() {
		return this.getElement("frame")?.hidden === false;
	}

	public async updateFrameTitle() {
		let account = this.getContainer().getAccount();
		let balance = this.getContainer().getBalance();
		let getAccountIndex = getDefaultAccountIndex();
		this.log(
			"main account: [" + getAccountIndex + "] => " + account.address
		);
		let etherBalance = ethers.utils.formatEther(balance);
		this.log("balance of account: " + etherBalance);
		this.getElement("frame").setContent(
			`{bold}{yellow-fg}${
				hre.network.name
			} [${this.getContainer().getCurrentChainId()}]{/bold} {underline}${
				account.address
			}{/underline}{/yellow-fg} {black-bg}{white-fg}{bold}${etherBalance} ETH ($${(
				parseFloat(etherBalance) * 2222
			).toFixed(
				2
			)}){/bold}{/white-fg}{/black-bg} {black-bg}{red-fg}{bold}150.2 gwei{/bold}{/red-fg}{/black-bg} {black-bg}{yellow-fg}{bold}120.2 gwei{/bold}{/yellow-fg}{/black-bg} {black-bg}{green-fg}{bold}110.2 gwei{/bold}{/red-fg}{/green-bg}`
		);
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
		options: any,
		type?: "box" | "list" | "image" | "bigtext"
	) {
		type = type || "box";
		if (this.elements["frame"] === undefined && options?.parent)
			throw new Error("no frame or parent for this element");

		if (blessed[type] === undefined || typeof blessed[type] !== "function")
			throw new Error("bad blessed element: " + type);

		let base = options?.parent || this.getElement("frame");

		if (options.left === undefined && options.right === undefined)
			options.left = 0;

		(options.left !== undefined ||
			(options.left === undefined && options.right === undefined)) &&
		typeof options.left === "number"
			? (options.left =
					base.left +
					(options.left || 0) +
					(typeof this.padding === "number" ? this.padding : 0))
			: false;

		options.right !== undefined && typeof options.right === "number"
			? (options.right =
					base.right +
					(options.right || 0) +
					(typeof this.padding === "number" ? this.padding : 0))
			: false;

		(options.top !== undefined ||
			(options.top === undefined && options.bottom === undefined)) &&
		typeof options.top === "number"
			? (options.top =
					base.top +
					(options.top || 0) +
					(typeof this.padding === "number" ? this.padding : 0))
			: false;

		options.bottom !== undefined && typeof options.bottom === "number"
			? (options.bottom =
					base.bottom +
					(options.bottom || 0) +
					(typeof this.padding === "number" ? this.padding : 0))
			: false;

		//deducts the base left and base right starting positions from the options width so it is 100% of the frame/base not the screen
		if (
			options.width !== undefined &&
			typeof options.width === "string" &&
			options.width?.indexOf("%") !== -1 &&
			(options.width?.indexOf("-") === -1 ||
				options.width?.indexOf("+") === -1)
		)
			options.width = options.width + "-" + (base.left + base.right);

		//if its just a percentage then add the base onto it, if not leave it and have them do it
		if (
			options.height !== undefined &&
			typeof options.height === "string" &&
			options.height?.indexOf("%") !== -1 &&
			(options.height?.indexOf("-") === -1 ||
				options.height?.indexOf("+") === -1)
		)
			options.height = options.height + "-" + (base.top + base.bottom);

		return this.registerElement(key, blessed[type](options));
	}

	public async create() {
		if (this.initialized && this.destroyed === false)
			throw new Error("already initialized");
		if (this.screen === undefined)
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
			blessed.box({
				top: this.x,
				left: this.y,
				width: this.width,
				height: this.height,
				tags: true,
				parent: this.screen,
				padding: this.padding || 1,
				scrollbar: this.scrollbar || {},
				border: this.border || {},
				style: this.style || {},
			})
		);
		this.frame.setBack();

		this.closeButton = this.createElement("closeButton", {
			top: 0,
			right: 0,
			width: 7,
			height: 5,
			tags: true,
			padding: 1,
			content: "[x]",
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
			this.destroy();
		});
		this.closeButton.focus();
		this.hideButton = this.createElement("hideButton", {
			top: 0,
			right: this.hideCloseButton ? 0 : calculateWidth(this.closeButton),
			width: 7,
			height: 5,
			tags: true,
			padding: 1,
			content: "[-]",
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
		this.hideButton.focus();

		if (this.hideCloseButton) this.closeButton.hide();
		if (this.hideMinimizeButton) this.hideButton.hide();

		this.log("calling initialize");
		await this.initialize(this, this.frame, blessed);
		this.initialized = true;
		this.destroyed = false;

		//append each element
		Object.values(this.elements).forEach((element) => {
			this.log(
				`appending element (${element.constructor.name}) to screen`
			);

			this.screen.append(element);
		});
		this.screen.render();

		this.hideButton.setFront();
		this.closeButton.setFront();
		//frame title
		await this.updateFrameTitle();
	}
}
