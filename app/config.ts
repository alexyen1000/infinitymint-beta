import { Dictionary } from "form-data";
import { HardhatUserConfig } from "hardhat/types";

/**
 * Interface for the InfinityMint configuration file
 */
export interface InfinityMintConfig {
	project?: string;
	networks?: any;
	hardhat: HardhatUserConfig;
	ipfs?: any;
	settings?: InfinityMintConfigSettings;
}

export interface InfinityMintConfigNetworkSettings {
	defaultAccount?: number;
	useDefaultPipe?: boolean;
}

export interface InfinityMintConfigSettings {
	networks: Dictionary<InfinityMintConfigNetworkSettings>;
	values?: any;
}

export interface InfinityMintScriptArguments {
	name: string;
	optional?: boolean;
	validator?: Function;
}

export interface InfinityMintConsole {
	blessed?: Dictionary<any>;
}

export interface InfinityMintScript {
	name?: string;
	description?: string;
	execute: Function;
	arguments?: InfinityMintScriptArguments[];
}

/**
 * Interface for the InfinityMint deployments (gems included)
 */
export interface InfinityMintDeployment {
	deploy: Function;
	setup: Function;
	permissions?: Array<any>;
	important?: boolean;
	instantlySetup?: boolean;
	library?: boolean; //if this is a library and not a solidity contract
	key?: string; //will take from the file name the deploy script is called if not specified
	index?: number;
}
