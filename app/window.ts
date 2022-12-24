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

	protected width: number | string;
	protected height: number | string;
	protected x: number;
	protected y: number;
	protected z: number;
	//blessed
	private screen: any;
	private style: any;
	private border: any;
	private id: any;
	private destroyed: boolean;
	private backgroundThink: boolean;
	private destroyId: boolean;
	private scrollbar: any;
	private initialized: boolean;
	private creation: any;
	private initialCreation: any;
	private autoInstantiate: boolean;
	private container?: InfinityConsole;

	constructor(
		name?: string,
		style?: any,
		border?: any,
		scrollbar?: any,
		options?: any
	) {
		this.name = name || this.constructor.name;
		this.width = 100;
		this.height = 100;
		this.x = 1;
		this.y = 1;
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

	private generateId() {
		return uuidv4();
	}

	public setScreen(screen: any) {
		this.screen = screen;
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
	}

	public getBorder(): object {
		return this.border;
	}

	public setWidth(num: number | string) {
		this.width = num;
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
					? this.x + (this.width as number)
					: this.width,
			startY: this.y,
			endY:
				typeof this.height === "number"
					? this.y + (this.height as number)
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
	}

	public getWidth() {
		return this.width;
	}

	public getX() {
		return this.x;
	}

	public get(): Vector {
		return { x: this.y, y: this.y, z: this.z };
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

		if (element.parent === undefined) element.parent = this.screen;

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

		this.elements = {};
	}

	public registerKey() {}

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
		let defaultSigner = await getDefaultSigner();
		let balance = await defaultSigner.getBalance();
		let getAccountIndex = getDefaultAccountIndex();
		this.log(
			"main account: [" +
				getAccountIndex +
				"] => " +
				defaultSigner.address
		);
		let etherBalance = ethers.utils.formatEther(balance);
		this.log("balance of account: " + etherBalance);
		this.getElement("frame").setContent(
			` {bold}${
				this.name
			}{/bold} | {yellow-fg}[${getAccountIndex}]{/yellow-fg} {underline}${
				defaultSigner.address
			}{/underline} | {magenta-bg}${
				hre.network.name
			}{/magenta-bg} | gas: {red-fg}50gwei{/red-fg} balance: {green-fg}${etherBalance} ETH{/green-fg} | Solidity Namespace: {cyan-fg}${getSolidityFolder()}{/cyan-fg}`
		);
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
		let frame = this.registerElement(
			"frame",
			blessed.box({
				top: "center",
				left: "center",
				width: "100%",
				height: "100%",
				tags: true,
				parent: this.screen,
				padding: 1,
				scrollbar: this.scrollbar || {},
				border: this.border || {},
				style: this.style || {},
			})
		);
		frame.setBack();

		let close = this.registerElement(
			"closeButton",
			blessed.box({
				top: 0,
				right: 0,
				width: "shrink",
				height: "shrink",
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
			})
		);
		close.on("click", () => {
			this.destroy();
		});
		close.focus();
		let hide = this.registerElement(
			"hideButton",
			blessed.box({
				top: 0,
				right: 6,
				width: "shrink",
				height: "shrink",
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
			})
		);
		hide.on("click", () => {
			this.hide();
		});
		hide.focus();

		this.log("calling initialize");
		await this.initialize(this, frame, blessed);
		this.initialized = true;
		this.destroyed = false;

		//append each element
		Object.values(this.elements).forEach((element) => {
			this.log(
				`appending element (${element.constructor.name}) to screen`
			);

			this.screen.append(element);
		});
		//frame title
		await this.updateFrameTitle();
	}
}
