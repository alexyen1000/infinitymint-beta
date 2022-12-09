import Logging from "./logging";

export interface Vector {
	x: number;
	y: number;
	z: number;
}

export interface Blessed {
	screen: any;
	box: any;
	button: any;
	list: any;
	form: any;
}

export interface BlessedElement extends Element {
	focus: Function;
	render: Function;
	hide: Function;
	setFront: Function;
	on: Function;
	setBack: Function;
	setScroll: Function;
	removeLabel: Function;
	pushLine: Function;
	setItems: Function;
	enterSelected: Function;
	enableKeys: Function;
	width: number;
	height: number;
	style: any;
	setContent: Function;
	enableMouse: Function;
	enableInput: Function;
	enableDrag: Function;
	disableDrag: Function;
	show: Function;
	toggle: Function;
	destroy: Function;
	free: Function;
	setLine: FuncDouble<number, string, Function>;
	insertLine: FuncDouble<number, string, Function>;
	key: FuncDouble<string, Function, Function>;
	onceKey: FuncDouble<string, Function, Function>;
	onScreenEvent: FuncDouble<string, Function, Function>;
	unkey: FuncDouble<string, Function, Function>;
}

/**
 * Can somebody educate me on a better way?
 *  - Lyds
 */
export interface FuncSingle<T, TResult> {
	(param0: T): TResult;
}

export interface FuncDouble<T, T2, TResult> {
	(param0: T, param1: T2): TResult;
}

export interface FuncTripple<T, T2, T3, TResult> {
	(param0: T, param1: T2, param3: T3): TResult;
}

export interface FuncQuad<T, T2, T3, T4, TResult> {
	(param0: T, param1: T2, param3: T3, param4: T4): TResult;
}

export interface Rectangle {
	startX: number;
	endX: number;
	startY: number;
	endY: number;
	width: number;
	height: number;
	z: number;
}
export const log = (msg: string, pipe?: string) => {
	Logging.log(msg, pipe);
};

export const debugLog = (msg: string) => {
	log(msg, "debug");
};

export const error = (error: string | Error) => {
	Logging.log(error.toString());
};

export const isEnvTrue = (key: string): boolean => {
	return process.env[key] !== undefined && process.env[key] === "true";
};

export const isEnvSet = (key: string): boolean => {
	return (
		process.env[key] !== undefined && process.env[key]?.trim().length !== 0
	);
};
