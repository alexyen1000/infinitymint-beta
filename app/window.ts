import { Dictionary } from "form-data";
import { Rectangle, Vector, FuncTripple, log, debugLog } from "./helpers";
import { BlessedElement, Blessed } from "./helpers";
import hre, { ethers } from "hardhat";
import InfinityConsole from "./console";

const blessed = require("blessed");
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

	protected width: number;
	protected height: number;
	protected x: number;
	protected y: number;
	protected z: number;
	//blessed
	private screen: any;
	private style: any;
	private border: any;
	private destroyed: boolean;
	private scrollbar: any;
	private initialized: boolean;
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
		this.initialized = false;
		this.options = options || {};
		this.elements = {};
		this.initialize = async () => {};
		this.think = () => {};
	}

	public setScreen(screen: any) {
		this.screen = screen;
	}

	public setContainer(container: InfinityConsole) {
		this.container = container;
	}

	public async openWindow(name: string) {
		this.container?.setWindow(name);
	}

	public setBorder(border: any) {
		this.border = border;
	}

	public getBorder(): object {
		return this.border;
	}

	public setWidth(num: number) {
		this.width = num;
	}

	public setHeight(num: number) {
		this.height = num;
	}

	public getRectangle(): Rectangle {
		return {
			startX: this.x,
			endX: this.x + this.width,
			startY: this.y,
			endY: this.y + this.height,
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

	public etX() {
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
		debugLog("hiding " + this.name);
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
		debugLog("showing " + this.name);
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

	public setSize(width: number, height: number) {
		this.width = width;
		this.height = height;
	}

	public registerElement(
		key: string,
		element: BlessedElement
	): BlessedElement {
		if (this.elements[key] !== undefined)
			throw new Error("key already registered in window: " + key);
		debugLog(
			"registering element key " +
				key +
				" for window " +
				this.name +
				" typeof " +
				element.constructor.name
		);
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
		this.destroyed = true;
		Object.keys(this.elements).forEach((index) => {
			debugLog(
				"destroying element " +
					this.elements[index].constructor.name +
					" for window " +
					this.name
			);
			this.elements[index].free(); //unsubscribes to events saving memory
			this.elements[index].destroy();
			delete this.elements[index];
		});

		this.elements = {};
	}

	public registerKey() {}

	public isAlive() {
		return this.destroyed === false;
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

	public async setFrameContent() {
		let signers = await ethers.getSigners();
		debugLog("found " + signers.length + " signers");
		signers.forEach((signer, index) => {
			debugLog(`[${index}] => ${signer.address}`);
		});
		let balance = await signers[0].getBalance();
		debugLog("main account: " + signers[0].address);
		debugLog("balance of account: " + balance);
		this.getElement("frame").setContent(
			` > {bold}${this.name}{/bold} | 0 => {underline}${
				signers[0].address
			}{/underline} {magenta-bg}${
				hre.network.name
			}{/magenta-bg} {green-fg}balance: ${ethers.utils.formatEther(
				balance
			)} ETH{/green-fg}`
		);
		debugLog("initializing window " + this.name);
	}

	public async create() {
		debugLog("creating initial window: " + this.name);

		if (this.initialized && this.destroyed === false)
			throw new Error("already initialized");
		if (this.screen === undefined)
			throw new Error("cannot create window with undefined screen");

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
				padding: 1,
				scrollbar: this.scrollbar || {},
				border: this.border || {},
				style: this.style || {},
			})
		);
		frame.setBack();
		await this.setFrameContent();

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

		await this.initialize(this, frame, blessed);
		this.initialized = true;
		this.destroyed = false;

		//append each element
		Object.values(this.elements).forEach((element) => {
			debugLog(
				"appending element to screen: " + element.constructor.name
			);
			this.screen.append(element);
		});
	}
}
