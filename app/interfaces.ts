import { BigNumber } from "ethers";
import { Dictionary } from "form-data";
import { HardhatUserConfig } from "hardhat/types";
import { FuncSingle } from "./helpers";
import { Server, ServerOptions } from "ganache";
import { EventEmitter } from "events";
import { DeploymentScript } from "./deployments";
import InfinityConsole from "./console";

export interface InfinityMintGem extends InfinityMintDeploymentScript {
	name: string;
	init?: FuncSingle<InfinityMintGemParameters, Promise<void>>;
}

export interface InfinityMintGemParameters
	extends InfinityMintDeploymentParameters {
	gem: InfinityMintGem;
}

export interface InfinityMintGemConfig {
	name?: string;
	homepage?: string;
	git?: string;
	version: string;
	solidityNamespace: string;
	author?: Dictionary<any> | Dictionary<any>[];
}

export interface InfinityMintApplicationConfig {
	productionChains: any[];
	testChains: any[];
}

/**
 * The infinitymint project is responsible for holding the paths, assets and other information relating to the project.
 */
export interface InfinityMintProject {
	/**
	 * the name of the current project
	 */
	name: string;
	/**
	 * custom infinityLinks which can be linked to the token
	 */
	infinityLinks?: Array<InfinityMintProjectSettingsLink>;
	/**
	 * specificy other projects by name to have them deploy along side this minter and be packed together into the export location.
	 */
	system?: Array<string>;
	/**
	 * which infinity mint modules to use in the creation of your minter, here you can specify things such as the the `asset controller` you are using.
	 */
	modules: InfinityMintProjectModules;
	/**
	 * The price of your tokens. This can be in a decimal (for crypto) or as a real life value, for example:
	 * ```js
	 * //price: '$1',
	 * //price: 0.15,
	 * ```
	 */
	price: number | BigNumber | string;
	/**
	 * The information relating to your project.
	 *
	 * @see {@link InfinityMintProjectInformation}
	 */
	information: InfinityMintProjectInformation;
	/**
	 * An array containing the gems which are associated with this project.
	 *
	 * @see {@link InfinityMintProjectGem}
	 */
	gems?: Array<InfinityMintProjectGem>;
	/**
	 * The base path of the project. All values entered into the basePath will be inserted into each of the minters paths. This is similar to `defaultPath` for classic infinitymint.
	 *
	 * @see {@link InfinityMintProjectPath}
	 */
	basePath?: InfinityMintProjectPath;
	/**
	 * The base asset of the project. All values entered into the baseAsset will be inserted into each of the minters paths. This is similar to `defaultAsset` for classic infinitymint.
	 *
	 * @see {@link InfinityMintProjectAsset}
	 */
	baseAsset?: InfinityMintProjectAsset;
	/**
	 * All the possible mint varations of the minter, must be an Array of {@link InfinityMintProjectPath}
	 */
	paths: Array<InfinityMintProjectPath>;
	/**
	 * All the possible asset varations of the minter, must be an Array of {@link InfinityMintProjectAsset}
	 */
	assets?: Array<InfinityMintProjectAsset>;
	/**
	 * The settings of the project. The settings key is which deployment the settings should be for, and you can enter what ever you like here.
	 *
	 * @see {@link InfinityMintProjectSettings}
	 */
	settings?: InfinityMintProjectSettings;
	/**
	 * The permissions of your project. here you can specify if certian addresses get free mint privilages or specific access to gems.
	 *
	 * @see {@link InfinityMintProjectPermissions}
	 */
	permissions?: InfinityMintProjectPermissions;
	/**
	 * Here you can specificy callbacks which will be fired when certain events are triggered.
	 *
	 * @see {@link InfinityMintProjectPermissions}
	 */
	events?: InfinityMintProjectEvents;
	/**
	 * A dictionary containing all of the currently deployed contracts associated with this project. Values inside of this object are inserted based on their key if they are a core infinity mint deployment (erc721, minter, assets) as well as by their contract name (DefaultMinter, RaritySVG) this also applies for gems as well.
	 *
	 * @see {@link InfinityMintDeployment}
	 */
	contracts?: Dictionary<InfinityMintDeployment>;
	/**
	 * Used in keeping track of temporary projects which fail in their deployment. keeps track of stages we have passed so we can continue where we left off if anything goes wrong.
	 */
	stages?: any;
	/**
	 * if this is a deployed project or not
	 */
	deployed?: boolean;
	/**
	 * The version information for this project
	 */
	version?: {
		/**
		 * @defaultValue initial
		 */
		tag: string;
		/**
		 * @defaultValue 0.0.1
		 */
		version: string;
	};
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
	random?: Array<string>;
	royalty?: Array<string>;
	assets?: Array<string>;
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
	disablePreviews?: boolean;
	disableAssets?: boolean;
}

export interface InfinityMintProjectSettingsMinter {
	pathId?: number;
	maxSupply?: number;
	mintBytes?: Dictionary<any>;
	approvedOnly?: boolean;
	onlyImplicitMint?: boolean;
	maxTokensPerWallet?: number;
	previewCount?: number;
}

export interface InfinityMintProjectSettingsAssets {
	incremental?: boolean;
	randomNames?: boolean;
	preventSamePathTwice?: boolean;
	rarity?: {
		pickLeastCommon?: boolean;
		pickMostCommon?: boolean;
	};
	disabledPaths?: Array<any>;
	nameCount?: number;
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

export interface InfinityMintProjectSettingsERC721 extends Dictionary<any> {
	defaultTokenURI?: string;
	allowTransfer?: boolean;
}

export interface InfinityMintProjectSettings {
	erc721?: InfinityMintProjectSettingsERC721;
	minter?: InfinityMintProjectSettingsMinter;
	values?: InfinityMintProjectSettingsValues;
	royalty?: InfinityMintProjectSettingsRoyalty;
	assets?: InfinityMintProjectSettingsAssets;
	gems?: Dictionary<any>;
}

export interface InfinityMintProjectModules {
	assets: string;
	minter: string;
	royalty: string;
	random: string;
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
	fileName: string;
	data?: Dictionary<any>;
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
 * The infinitymint configuation interface, this is what is returnted from the infinitymint.config.js in the current root and holds ganache, hardhat and infinitymint configuration details.
 */
export interface InfinityMintConfig {
	/**
	 * The name of the project.
	 */
	project?: string;
	/**
	 * The hardhat configuration, the same as hre.config. Uses all valid configuration options found within their docs. <https://www.npmjs.com/package/hardhat>
	 */
	hardhat: HardhatUserConfig;
	/**
	 * ipfs cofiguration settings
	 */
	ipfs?: any;
	/**
	 * The settings inputted to ganache within the `server.run()` function of its startup. Uses all valid configuration options found within their docs. <https://www.npmjs.com/package/ganache>
	 */
	ganache?: ServerOptions;
	/**
	 * Other filesystem locations where IM will look for assets such as PNGs, Vectors etc.to create tokens with.
	 */
	imports?: Array<string>;
	/**
	 * InfinityMint-specific config settings. Configures settings such as how networks behave, what wallets to use by default, & if to log a specific chain within `defaultPipe`, & specify whether a chain is *production* or a *testnet*. Also determines what will be used to fetch `Gas Estimates` and *token prices*.
	 */
	settings?: InfinityMintConfigSettings;
}

export interface InfinityMintConfigSettingsNetwork {
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
	networks: Dictionary<InfinityMintConfigSettingsNetwork>;
	deploy?: InfinityMintConfigSettingsDeploy;
	build?: InfinityMintConfigSettingsBuild;
	export?: InfinityMintConfigSettingsExport;
}

export interface InfinityMintScriptArguments {
	name: string;
	optional?: boolean;
	validator?: Function;
	value?: any;
}

export interface InfinityMintConsole {
	blessed?: Dictionary<any>;
}

export interface InfinityMintScript {
	name?: string;
	description?: string;
	execute: FuncSingle<InfinityMintScriptParameters, Promise<void>>;
	arguments?: InfinityMintScriptArguments[];
}

export interface InfinityMintScriptParameters extends Dictionary<any> {
	args?: Dictionary<InfinityMintScriptArguments>;
	eventEmitter?: EventEmitter;
	project?: InfinityMintProject;
	log: FuncSingle<string, void>;
	debugLog: FuncSingle<string, void>;
}

export interface InfinityMintDeploymentParameters extends Dictionary<any> {
	setup?: boolean;
	console?: InfinityConsole;
	eventEmitter?: EventEmitter;
	deployments?: Dictionary<any>;
	deploy?: DeploymentScript;
	log: FuncSingle<string, void>;
	debugLog: FuncSingle<string, void>;
}

/**
 * This interface is the object which is returned when you fetch an InfinityMint deloyment
 * for the current project on the current network.
 *
 * @see {@link InfinityMintDeploymentScript} for how to create an InfinityMintDeployment
 */
export interface InfinityMintDeployment extends Dictionary<any> {
	/**
	 *  The abi of the current dpeloyment.
	 */
	abi?: Array<any>;
	/**
	 * The key name of this contract in the {@link InfinityMintProject} file.
	 */
	key?: string;
	/**
	 * The name of the current deployment, same as the .sol filename.
	 */
	name?: string;
	/**
	 * The address of this deployment on the blockchain.
	 */
	address?: string;
	/**
	 * The name of the project this deployment was deployed under.
	 */
	project?: string;
	/**
	 * The network name and chainId this deployment was deploymend too.
	 */
	network?: {
		name: string;
		chainId: number;
	};
	/**
	 *  The approved addresses for this deployment.
	 */
	approved?: string[];
	/**
	 *  The address of the deployer of this contract.
	 */
	deployer?: string;
	/**
	 * The receipt for this deployment
	 */
	receipt?: Dictionary<any>;
}

export interface InfinityMintDeploymentScript {
	deploy: FuncSingle<InfinityMintDeploymentParameters, Promise<void>>;
	setup: FuncSingle<InfinityMintDeploymentParameters, Promise<void>>;
	permissions?: Array<any>;
	important?: boolean;
	instantlySetup?: boolean;
	solidityNamespace?: string;
	library?: boolean; //if this is a library and not a solidity contract
	key?: string; //will take from the file name the deploy script is called if not specified
	index?: number;
}
