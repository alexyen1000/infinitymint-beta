import { Dictionary } from "form-data";
import { Rectangle, Vector, FuncSingle, FuncDouble, log } from "./helpers";
import { BlessedElement } from "./helpers";
import Logging from "./logging";

const blessed = require("blessed");
export class InfinityMintWindow {
	public initialize: FuncDouble<InfinityMintWindow, BlessedElement, void>;
	public think: FuncSingle<InfinityMintWindow, void>;
	public name: string;
	public elements: Dictionary<BlessedElement>;

	protected width: number;
	protected height: number;
	protected x: number;
	protected y: number;
	protected z: number;
	//blessed
	private screen: any;
	private style: any;
	private border: any;
	constructor(name?: string, style?: any, border?: any) {
		this.name = name || this.constructor.name;
		this.width = 100;
		this.height = 100;
		this.x = 1;
		this.y = 1;
		this.z = 0;
		this.style = style;
		this.border = border;
		this.elements = {};
		this.initialize = () => {};
		this.think = () => {};
	}

	setScreen(screen: any) {
		this.screen = screen;
	}

	setBorder(border: any) {
		this.border = border;
	}

	getBorder(): object {
		return this.border;
	}

	setWidth(num: number) {
		this.width = num;
	}

	setHeight(num: number) {
		this.height = num;
	}

	getRectangle(): Rectangle {
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

	getStyle(): object {
		return this.style;
	}

	setStyle(style: any) {
		this.style = style;
	}

	getWidth() {
		return this.width;
	}

	getX() {
		return this.x;
	}

	get(): Vector {
		return { x: this.y, y: this.y, z: this.z };
	}

	getY() {
		return this.y;
	}

	getHeight() {
		return this.height;
	}

	setSize(width: number, height: number) {
		this.width = width;
		this.height = height;
	}

	registerElement(key: string, element: BlessedElement): BlessedElement {
		if (this.elements[key] !== undefined)
			throw new Error("key already registered in window: " + key);

		this.elements[key] = element;
		return this.elements[key];
	}

	getElement(key: string): BlessedElement {
		return this.elements[key];
	}

	create() {
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
				border: this.border || {},
				style: this.style || {},
			})
		).focus(); //then focus it

		//call initialize method
		this.initialize(this, this.getElement("frame"));

		//append each element
		Object.values(this.elements).forEach((element) => {
			log("append element to screen: " + element.constructor.name);
			this.screen.append(element);
		});
	}
}
