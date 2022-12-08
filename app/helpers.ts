import config from "../infinitymint.config";
import hre from "hardhat";
import Logging from "./logging";
import { HardhatRuntimeEnvironment } from "hardhat/types";

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
