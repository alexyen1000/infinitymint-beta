import config from "../infinitymint.config";
import hre from "hardhat";
import { InfinityMintConfig } from "./config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

export const getConfig = (): InfinityMintConfig => {
	return config;
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
