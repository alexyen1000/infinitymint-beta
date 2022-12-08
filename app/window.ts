import { Dictionary } from "form-data";
import { Rectangle, Vector, FuncSingle } from "./helpers";

export class InfinityMintWindow {
	public initialize: FuncSingle<InfinityMintWindow, void>;
	public think: FuncSingle<InfinityMintWindow, void>;
	public name: string;
	public elements: Dictionary<any>;

	protected width: number;
	protected height: number;
	protected x: number;
	protected y: number;
	protected z: number;
	private screen: any;
	constructor(name?: string) {
		this.name = name || this.constructor.name;
		this.width = 100;
		this.height = 100;
		this.x = 1;
		this.y = 1;
		this.z = 0;
		this.elements = {};
		this.initialize = () => {};
		this.think = () => {};
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

	create() {
		this.initialize(this);
	}
}
