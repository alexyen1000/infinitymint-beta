import { Dictionary } from "form-data";
import { Rectangle, Vector, FuncTripple, log } from "./helpers";
import { BlessedElement, Blessed } from "./helpers";

const blessed = require("blessed");
export class InfinityMintWindow {
	public initialize: FuncTripple<
		InfinityMintWindow,
		BlessedElement,
		Blessed,
		void
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
	private scrollbar: any;
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
		this.z = 0;
		this.style = style;
		this.border = border;
		this.scrollbar = scrollbar;
		this.options = options || {};
		this.elements = {};
		this.initialize = () => {};
		this.think = () => {};
	}

	public setScreen(screen: any) {
		this.screen = screen;
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

	public create() {
		if (this.screen === undefined)
			throw new Error("cannot create window with undefined screen");

		//set the title
		this.screen.title = this.name;
		// Create the frame which all other components go into
		this.registerElement(
			"frame",
			blessed.box({
				top: "center",
				left: "center",
				width: "100%",
				height: "100%",
				tags: true,
				padding: 0,
				scrollable: true,
				mouse: true,
				scrollbar: this.scrollbar || {},
				border: this.border || {},
				style: this.style || {},
			})
		);

		//call initialize method
		if (this.initialize)
			this.initialize(this, this.getElement("frame"), blessed);

		//append each element
		Object.values(this.elements).forEach((element) => {
			log("append element to screen: " + element.constructor.name);
			this.screen.append(element);
		});
	}
}
