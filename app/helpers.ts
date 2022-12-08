import config from "../infinitymint.config";
import hre from "hardhat";
import Logging from "./logging";
import { HardhatRuntimeEnvironment } from "hardhat/types";

export interface Vector {
	x: number;
	y: number;
	z: number;
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
export const log = (msg: string) => {
	Logging.log(msg);
};

export const error = (error: string | Error) => {
	Logging.log(error.toString());
};
export const getHardhatRuntime = (): HardhatRuntimeEnvironment => {
	return hre;
};

export const isEnvTrue = (key: string): boolean => {
	return process.env[key] !== undefined && process.env[key] === "true";
};

export const isEnvSet = (key: string): boolean => {
	return (
		process.env[key] !== undefined && process.env[key]?.trim().length !== 0
	);
};
