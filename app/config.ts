import { BigNumber } from "ethers";
import { Dictionary } from "form-data";
import { HardhatUserConfig } from "hardhat/types";
import { FuncSingle } from "./helpers";
import { Server, ServerOptions } from "ganache";

export interface InfinityMintApplicationConfig {
	productionChains: string[];
}

export interface InfinityMintProject {
	name: string;
	infinityLinks?: Array<InfinityMintProjectSettingsLink>;
	system?: Array<string>;
	modules: InfinityMintProjectModules;
	price: number | BigNumber | string;
	information: InfinityMintProjectInformation;
	defaultPath?: InfinityMintProjectPath;
	gems?: Array<InfinityMintProjectGem>;
	defaultAsset?: InfinityMintProjectAsset;
	paths: Array<InfinityMintProjectPath>;
	assets?: Array<InfinityMintProjectAsset>;
	settings?: InfinityMintProjectSettings;
	permissions?: InfinityMintProjectPermissions;
	events?: InfinityMintProjectEvents;
	contracts?: any;
	stages?: any;
	deployed?: boolean;
}

export interface InfinityMintProjectEvent<T, T2, T3, T4, TResult> {
	(param0: T, param1: T2, param3: T3, param4: T4): TResult;
}
export interface InfinityMintProjectEvents extends Dictionary<any> {
	setup?: FuncSingle<InfinityMintProject, Promise<void>>;
	deploy?: FuncSingle<InfinityMintProject, Promise<void>>;
	export?: FuncSingle<InfinityMintProject, Promise<void>>;
}

export interface InfinityMintProjectInformation {
	tokenSymbol: string;
	tokenSingular: string;
	tokenMultiple?: string;
	fullName?: string;
	shortName?: string;
	description?: string;
}

export interface InfinityMintProjectPermissions extends Dictionary<any> {
	all?: Array<string>;
	erc721?: Array<string>;
	minter?: Array<string>;
	randomController?: Array<string>;
	royaltyController?: Array<string>;
	assetController?: Array<string>;
	gems?: Array<string>;
}

export interface InfinityMintProjectGem {
	name: string;
	enabled: boolean;
	settings?: Dictionary<any>;
}

export interface InfinityMintProjectSettingsLink {
	key: string;
	name: string;
	description?: string;
	verify?: boolean;
	forcedOnly?: boolean;
	contract?: string;
	settings?: InfinityMintProjectSettingsLinkSettings;
	interfaceId?: any;
}

export interface InfinityMintProjectSettingsLinkSettings {
	erc721?: boolean;
}

export interface InfinityMintProjectSettingsValues extends Dictionary<any> {
	maxSupply?: number;
	maxTokensPerWallet?: number;
	approvedOnly?: boolean;
}

export interface InfinityMintProjectSettingsMinter {
	incremental?: boolean;
	randomNames?: boolean;
}

export interface InfinityMintProjectSettingsRoyaltySplit
	extends Dictionary<any> {
	address: string;
	mints: number;
	stickers: number;
}

export interface InfinityMintProjectSettingsRoyaltyCuts
	extends Dictionary<any> {
	stickers: number;
}

export interface InfinityMintProjectSettingsRoyalty extends Dictionary<any> {
	cuts: InfinityMintProjectSettingsRoyaltyCuts;
	splits?:
		| InfinityMintProjectSettingsRoyaltySplit
		| InfinityMintProjectSettingsRoyaltySplit[];
}

export interface InfinityMintProjectSettings {
	minter?: InfinityMintProjectSettingsMinter;
	values?: InfinityMintProjectSettingsValues;
	royalty?: InfinityMintProjectSettingsRoyalty;
}

export interface InfinityMintProjectModules {
	assetController: string;
	minter: string;
	royaltyController: string;
	randomController: string;
}

export interface InfinityMintProjectPathExport {
	data: string;
	size: number;
	extension: string;
	ipfs: boolean;
	localStorage: boolean;
	projectStorage: boolean;
	ipfsUrl: string;
	ipfsCid: string;
}

export interface InfinityMintProjectPath {
	name: string;
	fileName?: string;
	key?: string;
	settings?: Dictionary<any>;
	description?: string;
	content?: Dictionary<InfinityMintProjectContent>;
	export?: InfinityMintProjectPathExport;
	encrypted?: boolean;
}

export interface InfinityMintProjectContent extends InfinityMintProjectPath {
	onlyOwners?: boolean;
	onlyApproved?: boolean;
}

export interface InfinityMintProjectAsset extends InfinityMintProjectPath {
	path?: string | number;
	section?: string;
}

/**
 * Interface for the InfinityMint configuration file
 */
export interface InfinityMintConfig {
	project?: string;
	networks?: any;
	hardhat: HardhatUserConfig;
	ipfs?: any;
	ganache?: ServerOptions;
	imports?: Array<string>;
	settings?: InfinityMintConfigSettings;
}

export interface InfinityMintConfigNetworkSettings {
	defaultAccount?: number;
	useDefaultPipe?: boolean;
}

export interface InfinityMintSession {
	environment?: any;
	created: number;
}

export interface InfinityMintConfigSettingsDeploy extends Dictionary<any> {}

export interface InfinityMintConfigSettingsBuild extends Dictionary<any> {}

export interface InfinityMintConfigSettingsExport extends Dictionary<any> {}

export interface InfinityMintConfigSettings extends Dictionary<any> {
	networks: Dictionary<InfinityMintConfigNetworkSettings>;
	deploy?: InfinityMintConfigSettingsDeploy;
	build?: InfinityMintConfigSettingsBuild;
	export?: InfinityMintConfigSettingsExport;
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
