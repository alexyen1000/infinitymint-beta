import { Dictionary } from "form-data";
import { HardhatUserConfig } from "hardhat/types";

/**
 * Interface for the InfinityMint configuration file
 */
export interface InfinityMintConfig {
	hardhat: HardhatUserConfig;
	ipfs?: object;
	settings?: object;
}

export interface InfinityMintScriptArguments {
	name: string;
	validator?: Function;
}

export interface InfinityMintScript {
	name?: string;
	description?: string;
	execute: Function;
	arguments?: Dictionary<InfinityMintScriptArguments>;
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
