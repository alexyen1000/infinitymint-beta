import { BigNumber } from "ethers";
import { Dictionary } from "form-data";
import { HardhatUserConfig } from "hardhat/types";
import { debugLog, FuncDouble, FuncSingle, log } from "./helpers";
import { ServerOptions } from "ganache";
import { EventEmitter } from "events";
import { Contract } from "@ethersproject/contracts";
import InfinityConsole from "./console";
import { InfinityMintDeployment } from "./deployments";
import { PathLike } from "fs";
import { InfinityMintSVGSettings } from "./content";
import { GasPriceFunction, TokenPriceFunction } from "./gasAndPrices";

/**
 * Gems are our plugins. They allow you to easily extend the functionality of InfinityMint. Gems an contain solidity code, react code and more and integrate with every aspect of InfinityMint
 */
export interface InfinityMintGemScript extends InfinityMintDeploymentScript {
	/**
	 * the name of this gem, does not have to be the same name as the folder it sits in
	 */
	name: string;
	/**
	 * called when the gem is first loaded into InfinityMint, useful when registering new windows with the InfinityConsole. Is initialized
	 * based on the load order of the gem. You get all of the same order of execution options as you would do with a {@link InfinityMintDeploymentScript}
	 */
	init?: FuncSingle<InfinityMintGemParameters, Promise<void>>;
	/**
	 * Allows event hooks to be defined the same as inside of the InfinityMint project file. *Please note that the context here in relation to pre build, pre set up and pre compile is in relation to the project and events will not be fired when the gem is set up, compiled or built. You need to use gemPostSetup and gemPreSetup if you would like to do calls when your gem is setup and after it has set up.
	 */
	events?: InfinityMintEvents;
}

/**
 * Parameters which are passed into the deploy, setup and init methods inside of a {@link InfinityMintGemScript}.
 */
export interface InfinityMintGemParameters
	extends InfinityMintDeploymentParameters {
	gem: InfinityMintGemScript;
}

/**
 * passed to event functions
 */
export interface InfinityMintProjectEventParameters<T>
	extends InfinityMintDeploymentParameters,
		Dictionary<any> {
	event?: T;
	gems: Dictionary<InfinityMintGemScript>;
}

/**
 * returned from the .json file inside of a gem folder. Contains metadata information about the gem as well as its git location and verison and solidity root
 */
export interface InfinityMintGemConfig {
	name?: string;
	homepage?: string;
	git?: string;
	version: string;
	solidityFolder: string;
	author?: Dictionary<any> | Dictionary<any>[];
}

export interface InfinityMintApplicationConfig {
	productionChains: any[];
	testChains: any[];
}

/**
 * For backwards compatability and JavaScript support. A Definition for the classic InfinityMint omega project. Iss used when projects are .js and not .ts before they have been compiled. When they get compiled they get turned into normal project interface. See {@link InfinityMintProject}.
 */
export interface InfinityMintProjectJavascript
	extends InfinityMintProject,
		Dictionary<any> {
	/**
	 * will always be true
	 */
	javascript: true;
	mods: Dictionary<boolean>;
	contracts: Dictionary<any>;
	description: Dictionary<any>;
	static: Dictionary<any>;
	deployment: Dictionary<any>;
	royalty?: Dictionary<any>;
	approved: Dictionary<string>;
	assetConfig: Dictionary<any>;
	names: Array<string>;
}

/**
 * classic paths, used when project file is a .js
 */
export interface InfinityMintProjectJavascriptPaths {
	default: Dictionary<any>;
	indexes: Array<InfinityMintProjectPath>;
}

/**
 * classic assets, used when project file is a .js
 */
export interface InfinityMintProjectJavascriptAssets
	extends Dictionary<InfinityMintProjectAsset> {}

/**
 * The infinitymint project is responsible for holding the paths, assets and other information relating to the project. You can set which modules are used in the creation of the minter, along with other specific settings relating to the project. Each project is stored inside of the `./projects/` in the root of where ever InfinityMint is run.
 *
 * @see {@link InfinityMintDeploymentLive}
 * @see {@link InfinityMintProjectModules}
 * @see {@link InfinityMintProjectAsset}
 * @see {@link InfinityMintProjectPath}
 * @see {@link InfinityMintProjectSettings}
 */
export interface InfinityMintProject {
	/**
	 * the name of the current project
	 */
	name: string;
	/**
	 * custom infinityLinks which can be linked to the token
	 */
	links?: Array<InfinityMintProjectSettingsLink>;
	/**
	 * specificy other projects by name to have them deploy along side this minter and be packed together into the export location.
	 */
	system?: Array<string>;
	/**
	 * which infinity mint modules to use in the creation of your minter, here you can specify things such as the the `asset, minter, royalty or random` solidity contract you are using.
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
	paths: Array<InfinityMintProjectPath> | InfinityMintProjectJavascriptPaths;
	/**
	 * All the possible asset varations of the minter, must be an Array of {@link InfinityMintProjectAsset}
	 */
	assets?:
		| Array<InfinityMintProjectAsset>
		| InfinityMintProjectJavascriptAssets
		| Dictionary<InfinityMintProjectAsset[]>;
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
	 * @see {@link InfinityMintEvents}
	 */
	events?: InfinityMintEvents;
	/**
	 * A dictionary containing all of the currently deployed contracts associated with this project. Values inside of this object are inserted based on their key if they are a core infinity mint deployment (erc721, minter, assets) as well as by their contract name (DefaultMinter, RaritySVG) this also applies for gems as well.
	 *
	 * @see {@link InfinityMintDeploymentLive}
	 */
	deployments?: Dictionary<InfinityMintDeploymentLive>;
	/**
	 * Used in keeping track of temporary projects which fail in their deployment. keeps track of stages we have passed so we can continue where we left off if anything goes wrong.
	 */
	stages?: Dictionary<any>;
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
	/**
	 * only available in deployed InfinityMint projects
	 */
	network?: {
		/**
		 * chain id of the network this project was deployed too
		 */
		chainId?: number;
		/**
		 * rpc url if added, must specify in the config to add. See {@link InfinityMintConfig}
		 */
		url?: string;
		/**
		 * the name of the network
		 */
		name?: string;
		/**
		 * the token symbol
		 */
		tokenSymbol?: string;
	};
	/**
	 * is true if this is a compiled infinitymint project.
	 */
	compiled?: boolean;
	/**
	 * Holds any IPFS locations of the project, react build and deployments
	 */
	ipfs?: Dictionary<any>;
	/**
	 * is true if the source file for this project is a javascript file, using javascript InfinityMint project.
	 * @private
	 */
	javascript?: boolean;
	/**
	 * Only set when the project is compiled, the SolidityFolder this project was compiled with
	 * @default undefined
	 */
	compiledSolidityFolder?: PathLike;
}

/**
 * Events can be defined which can then be called directly from the project file or a gem. The EventEmitter where ever the project is used is responsible for handling the automatic assignment of these events. All you need to do is return a promise which returns void. Please be aware that promises will not be waited for.
 */
export interface InfinityMintEvents
	extends Dictionary<
		FuncSingle<
			InfinityMintProjectEventParameters<any>,
			Promise<void | boolean>
		>
	> {
	preCompile?: FuncSingle<
		InfinityMintProjectEventParameters<void>,
		Promise<void | boolean>
	>;
	/**
	 * Will be called when project is compiled
	 */
	postCompile?: FuncSingle<
		InfinityMintProjectEventParameters<void>,
		Promise<void>
	>;
	/**
	 * Will be called when setup is about to take place. Can return false to abort setup silently.
	 */
	preSetup?: FuncSingle<
		InfinityMintProjectEventParameters<void>,
		Promise<void | boolean>
	>;
	postSetup?: FuncSingle<
		InfinityMintProjectEventParameters<void>,
		Promise<void>
	>;
	/**
	 * Will be called when deploy complete.
	 */
	postDeploy?: FuncSingle<
		InfinityMintProjectEventParameters<
			Dictionary<InfinityMintDeploymentLive[]>
		>,
		Promise<void>
	>;
	preDeploy?: FuncSingle<
		InfinityMintProjectEventParameters<void>,
		Promise<void | boolean>
	>;
	gemPreSetup?: FuncSingle<
		InfinityMintProjectEventParameters<InfinityMintGemScript>,
		Promise<void>
	>;
	gemPostSetup?: FuncSingle<
		InfinityMintProjectEventParameters<InfinityMintGemScript>,
		Promise<void | boolean>
	>;
	gemPreDeploy?: FuncSingle<
		InfinityMintProjectEventParameters<InfinityMintGemScript>,
		Promise<void>
	>;
	gemPostDeploy?: FuncSingle<
		InfinityMintProjectEventParameters<
			InfinityMintDeploymentLive | InfinityMintDeploymentLive[]
		>,
		Promise<void | boolean>
	>;
	postGems?: FuncSingle<
		InfinityMintProjectEventParameters<void>,
		Promise<void>
	>;
	preGems?: FuncSingle<
		InfinityMintProjectEventParameters<void>,
		Promise<void | boolean>
	>;
	postGem?: FuncSingle<
		InfinityMintProjectEventParameters<InfinityMintGemScript>,
		Promise<void>
	>;
	preGem?: FuncSingle<
		InfinityMintProjectEventParameters<InfinityMintGemScript>,
		Promise<void | boolean>
	>;
	postExport?: FuncSingle<
		InfinityMintProjectEventParameters<string[]>,
		Promise<void>
	>;
	/**
	 * Will be called when export is about to begin. Can return false to abort/skip export silently.
	 */
	preExport?: FuncSingle<
		InfinityMintProjectEventParameters<string[]>,
		Promise<void | boolean>
	>;
	preBuild?: FuncSingle<
		InfinityMintProjectEventParameters<void>,
		Promise<void | boolean>
	>;
	postBuild?: FuncSingle<
		InfinityMintProjectEventParameters<void>,
		Promise<void>
	>;
	success?: FuncSingle<
		InfinityMintProjectEventParameters<void>,
		Promise<void>
	>;
	failure?: FuncSingle<
		InfinityMintProjectEventParameters<Error>,
		Promise<void>
	>;
}

export type InfinityMintEventKeys = Array<keyof InfinityMintEvents>;

/**
 * The project information is where you can set the token symbol, other language definitions such as the full name of your project, short name and a brief description for metadata purposes.
 */
export interface InfinityMintProjectInformation {
	/**
	 * The symbol of your token. `appears on OpenSea and inside of the contract as the ERC721 tokenSymbol`.
	 */
	tokenSymbol: string;
	tokenSingular: string;
	tokenMultiple?: string;
	fullName?: string;
	shortName?: string;
	description?: string;
}

/**
 * Here you can specify addresses which will be given admin permissions inside of the InfinityMint deployments.
 */
export interface InfinityMintProjectPermissions extends Dictionary<any> {
	/**
	 * Will give all addresses inside the array admin access to all deployments.
	 */
	all?: Array<string>;
	/**
	 * Will give all addresses inside the array admin access to only the erc721 (InfinityMint) deployment.
	 */
	erc721?: Array<string>;
	/**
	 * Will give all addresses inside the array admin access to only the minter deployment.
	 *
	 * @see {@link InfinityMintProjectModules}
	 */
	minter?: Array<string>;
	/**
	 * Will give all addresses inside the array admin access to only the random deployment.
	 *
	 * @see {@link InfinityMintProjectModules}
	 */
	random?: Array<string>;
	/**
	 * Will give all addresses inside the array admin access to only the royalty deployment.
	 *
	 * @see {@link InfinityMintProjectModules}
	 */
	royalty?: Array<string>;
	/**
	 * Will give all addresses inside the array admin access to only the assets deployment.
	 *
	 * @see {@link InfinityMintProjectModules}
	 */
	assets?: Array<string>;
	/**
	 * Will give all addresses inside the array admin access on all gem contracts.
	 */
	gems?: Array<string>;
}

/**
 * Holds settings and other information relating to a gem inside of the project file. This is not the gem file its self but simply a configuration option inside of the projects where users can state if a gem is enable or disabled and pass settings from the project directly to all of the gem scripts and windows for them to read and use.
 *
 * @see {@link InfinityMintGemScript}
 */
export interface InfinityMintProjectGem {
	/**
	 * The name of the gem to enable/disable.
	 *
	 * @see {@link InfinityMintGemScript}
	 */
	name: string;
	/**
	 * If the gem is enabled or disabled.
	 */
	enabled: boolean;
	/**
	 * The settings for the gem.
	 *
	 * @see {@link InfinityMintGemScript}
	 */
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

/**
 * Settings for the values deployment. Can contain either booleans or numbers. All values here will be set on chain inside of the InfinityMintValues contract.
 *
 * @see {@link InfinityMintProjectSettings}
 */
export interface InfinityMintProjectSettingsValues extends Dictionary<any> {
	disablePreviews?: boolean;
	disableAssets?: boolean;
}

/**
 * Settings for the minter deployment.
 *
 * @see {@link InfinityMintProjectSettings}
 */
export interface InfinityMintProjectSettingsMinter {
	pathId?: number;
	maxSupply?: number;
	mintBytes?: Dictionary<any>;
	approvedOnly?: boolean;
	onlyImplicitMint?: boolean;
	maxTokensPerWallet?: number;
	previewCount?: number;
}

/**
 * Settings for the asset controller deployment. Here you can configure algorithmic properties which define how InfinityMint will create you toke. You can also change how many random names InfinityMint should mint for your token and for instance if you would like to prevent the same pathId from minting twice.
 *
 * @see {@link InfinityMintProjectSettings}
 */
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

/**
 * Settings for the royalty deployment.
 *
 * @see {@link InfinityMintProjectSettings}
 */
export interface InfinityMintProjectSettingsRoyalty extends Dictionary<any> {
	cuts: InfinityMintProjectSettingsRoyaltyCuts;
	splits?:
		| InfinityMintProjectSettingsRoyaltySplit
		| InfinityMintProjectSettingsRoyaltySplit[];
}

/**
 * Settings for the erc721 (InfinityMint) deployment.
 *
 * @see {@link InfinityMintProjectSettings}
 */
export interface InfinityMintProjectSettingsERC721 extends Dictionary<any> {
	defaultTokenURI?: string;
	allowTransfer?: boolean;
}

/**
 * All of the InfinityMint environment variables
 */
export interface InfinityMintEnvironment {
	INFINITYMINT_PROJECT?: string;
	ETHERSCAN_API_KEY?: string;
	POLYGONSCAN_API_KEY?: string;
	PIPE_ECHO_DEFAULT?: boolean;
	PIPE_ECHO_DEBUG?: boolean;
	DEFAULT_WALLET_MNEMOMIC?: string;
	BACKUP_WALLET_MNEMONIC?: string;
	PIPE_ECHO_ERRORS?: boolean;
	PIPE_ECHO_WARNINGS?: boolean;
	PIPE_SEPERATE_WARNINGS?: boolean;
	PIPE_LOG_ERRORS_TO_DEFAULT?: boolean;
	PIPE_SILENCE_UNDEFINED_PIPE?: boolean;
	OVERWRITE_CONSOLE_METHODS?: boolean;
	INFINITYMINT_DONT_INCLUDE_DEPLOY?: boolean;
	INFINITYMINT_DONT_INCLUDE_SCRIPTS?: boolean;
	GANACHE_PORT?: number;
	THROW_ALL_ERRORS?: boolean;
	INFINITYMINT_CONSOLE?: boolean;
	DEFAULT_SOLIDITY_FOLDER?: PathLike;
	GANACHE_EXTERNAL?: boolean;
	SOLIDITY_CLEAN_NAMESPACE?: boolean;
	SOLIDITY_USE_NODE_MODULE?: boolean;
}

export type InfinityMintEnvironmentKeys = Array<keyof InfinityMintEnvironment>;

/**
 * The project settings are where you can configure your infinity mint deployments to the logic you require. The name of each key is the same as the keys you defined in the `modules` key. (see {@link InfinityMintProjectModules}). The key is the deployment you would like to configure. You must not configure gem contracts here, but inside of the `gems` key of the project instead.
 *
 * @see {@link InfinityMintProject}
 * @see {@link InfinityMintProjectSettingsAssets}
 * @see {@link InfinityMintProjectSettingsERC721}
 * @see {@link InfinityMintProjectSettingsMinter}
 * @see {@link InfinityMintProjectSettingsValues}
 * @see {@link InfinityMintProjectSettingsRoyalty}
 */
export interface InfinityMintProjectSettings {
	/**
	 * Set settings for the erc721 (InfinityMint) deployment.
	 *
	 * @see {@link InfinityMintProjectSettingsERC721}
	 */
	erc721?: InfinityMintProjectSettingsERC721;
	/**
	 * Set settings for the minter deployment.
	 *
	 * @see {@link InfinityMintProjectSettingsMinter}
	 */
	minter?: InfinityMintProjectSettingsMinter;
	/**
	 * Set settings for the values deployment.
	 *
	 * @see {@link InfinityMintProjectSettingsValues}
	 */
	values?: InfinityMintProjectSettingsValues;
	/**
	 * Set settings royalty deployment.
	 *
	 * @see {@link InfinityMintProjectSettingsRoyalty}
	 */
	royalty?: InfinityMintProjectSettingsRoyalty;
	/**
	 * Set settings for the assets deployment.
	 *
	 * @see {@link InfinityMintProjectSettingsAssets}
	 */
	assets?: InfinityMintProjectSettingsAssets;
	/**
	 * List of contracts which are disabled, will check if member equals contract name or key
	 */
	disabledContracts?: string;
}

export type InfinityMintProjectSettingsKeys = Array<
	keyof InfinityMintProjectSettings
>;

/**
 * The InfinityMint project modules are the solidity files InfinityMint will use for its token creation and royalty distribution. Here is where you can change what is used in each step of the InfinityMint chain. The assets key controls what type of content will be minted based on what type of content it is (svg, image, sound). The minter controls how to talk to the asset controller, and if the user needs to specify which path they would like or if it should be random or if it should be only one specific path id until you say anything different. The royalty controller will control who is paid what for what ever happens inside of the minter. From mints, to things that gems do the royalty controller decides how any incoming money will be split accordingly. The random controller decides how InfinityMint obtains its random numbers which it uses in the mint process. You can use VCF randomness with chainlink here or use keccack256 randomisation but beware of the security risks of doing so.
 *
 * @see {@link InfinityMintProjectSettings}
 * @see {@link InfinityMintDeploymentLive}
 */
export interface InfinityMintProjectModules extends Dictionary<any> {
	/**
	 * Should be the *fully quallified solidity artifact name* for an Asset Controller. Solidity artifacts are compiled based on the current solidity root which is usually the `./alpha` folder. Gems will have an Gem_ before their artifact name.
	 *
	 * @example RaritySVG, SimpleSVG, RarityImage, SimpleImage
	 */
	assets: string;
	/**
	 * Should be the *fully quallified solidity artifact name* for a Mint Controller. Solidity artifacts are compiled based on the current solidity root which is usually the `./alpha` folder. Gems will have an Gem_ before their artifact name.
	 *
	 * @example DefaultMinter, SelectiveMinter, LockedMinter
	 */
	minter: string;
	/**
	 * Should be the *fully quallified solidity artifact name* for a Royalty Controller. Solidity artifacts are compiled based on the current solidity root which is usually the `./alpha` folder. Gems will have an Gem_ before their artifact name.
	 *
	 * @example DefaultRoyalty, SplitRoyalty
	 */
	royalty: string;
	/**
	 * Should be the *fully quallified solidity artifact name* for a Random Controller. Solidity artifacts are compiled based on the current solidity root which is usually the `./alpha` folder. Gems will have an Gem_ before their artifact name.
	 *
	 * @example SeededRandom, UnsafeRandom
	 */
	random: string;
	/**
	 * Should be the *fully quallified solidity artifact name* for a Random Controller. Solidity artifacts are compiled based on the current solidity root which is usually the `./alpha` folder. Gems will have an Gem_ before their artifact name.
	 *
	 * @private
	 */
	utils?: string;
	/**
	 * Should be the *fully quallified solidity artifact name*. Solidity artifacts are compiled based on the current solidity root which is usually the `./alpha` folder. Gems will have an Gem_ before their artifact name.
	 *
	 * @private
	 */
	values?: string;
	/**
	 * Should be the *fully quallified solidity artifact name*. Solidity artifacts are compiled based on the current solidity root which is usually the `./alpha` folder. Gems will have an Gem_ before their artifact name.
	 *
	 * @private
	 */
	storage?: string;
	/**
	 * Should be the *fully quallified solidity artifact name*. Solidity artifacts are compiled based on the current solidity root which is usually the `./alpha` folder. Gems will have an Gem_ before their artifact name.
	 *
	 * @example InfinityMint, InfinityMint2
	 */
	erc721?: string;
}

export type InfinityMintProjectModulesKeys = Array<
	keyof InfinityMintProjectModules
>;

export interface InfinityMintProjectPathExport {
	data: string;
	size: number;
	extension: string;
	ipfs: boolean;
	localStorage: boolean;
	projectStorage: boolean;
	ipfsUrl: string;
	ipfsCid: string;
	/**
	 * list of back ups where this content might be found, accepts IPFS cids and http/https web2 links
	 */
	backups: string[];
}

/**
 * InfinityMint paths are what the minter will use when rendering your token. For each path you define is a different apperance the token can take. Inside the project file you can set options (see {@link InfinityMintProjectSettingsAssets}) for how the paths will be picked. For each path you have to specify its name and the fileName to use. You can also specify if it is encrypted.
 */
export interface InfinityMintProjectPath {
	name: string;
	fileName: PathLike;
	/**
	 * is the mint data, this is copied to each token internally. Can be a path to a file
	 */
	data?: Dictionary<any> | PathLike;
	key?: string;
	/**
	 * can either contain an object of settings for the path or a link to the settings file or simply `true` to look for a settings file that matches the fileName import. See {@link app/content.InfinityMintSVGSettings}
	 */
	settings?: Dictionary<any> | PathLike | boolean | InfinityMintSVGSettings;
	description?: string;
	/**
	 * Unlike assets, content are not used in the rendering process but can be any type of media which is included with the mint of this path. For instance music, more images or 3D files could be put here.
	 *
	 * @examples
	 * ```js
	 * content: {
	 * 		myContent: {
	 * 			name: '3d',
	 * 			fileName: '@import/3d/file.obj'
	 * 		}
	 *	}
	 * ```
	 */
	content?: Dictionary<InfinityMintProjectContent>;
	/**
	 * When the path has been compiled this is filled.
	 */
	export?: InfinityMintProjectPathExport;
	/**
	 * Uses AE2 encryption. Note when using encryption you must find a way to send the decryption key to the token holder.
	 *
	 * @defaultValue false
	 */
	encrypted?: boolean;
	/**
	 * true if the project the path contains has been compiled.
	 */
	compiled?: boolean;
}

/**
 * is the same as {@link InfinityMintProjectPath} but is for JavaScript project files (classic InfinityMint).
 */
export interface InfinityMintProjectJavascriptPath
	extends InfinityMintProjectPath {
	/**
	 * For Javascript infinitymint paths this is where exported data is put. This is only used when the project is a javascript file as it does call it 'exports'. See {@link InfinityMintProjectPath}
	 */
	paths?: InfinityMintProjectPathExport;
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
	 * Will launch into the infinitymint console if the value of this member is true or equals an object,
	 *
	 * @example
	 * ```js
	 * //set console options
	 * console: {
	 * 	blessed: {
	 * 		//blessed screen options (see blessed api)
	 * 	},
	 * 	initialWindow: 'Logs'
	 * }
	 *
	 * //or you can just set it to true
	 * console: true
	 * ```
	 */
	console?: InfinityMintConsoleOptions | boolean;
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
	imports?: Array<PathLike>;
	/**
	 * InfinityMint-specific config settings. Configures settings such as how networks behave, what wallets to use by default, & if to log a specific chain within `defaultPipe`, & specify whether a chain is *production* or a *testnet*. Also determines what will be used to fetch `Gas Estimates` and *token prices*.
	 *
	 * @see {@link InfinityMintConfigSettings}
	 */
	settings?: InfinityMintConfigSettings;
}

/**
 * Network specific settings for InfinityMint.
 * @see {@link InfinityMintConfigSettings}
 * @see {@link InfinityMintConfigSettingsNetworks}
 */
export interface InfinityMintConfigSettingsNetwork {
	defaultAccount?: number;
	useDefaultPipe?: boolean;
	/**
	 * Allows you to specify an RPC to use for this network in a client setting. Does not equal the RPC which is used for hardhat to communicate in chain and is just used to create JsonStaticProvider on reacts end.
	 */
	rpc?: string;
	/**
	 * if true, will expose the hardhat rpc to be included in the project files network object. See {@link InfinityMintProject} specfically the member 'network'.
	 */
	exposeRpc?: boolean;
	/**
	 * disabled contracts for this network, takes fully qualified contract name or the key name, see {@link InfinityMintDeployment}.
	 */
	disabledContracts?: string[];
	/**
	 * if true, will write the current mnemonic to the .mnemonic file
	 */
	writeMnemonic?: boolean;
	/**
	 * define handlers for situations such as getting the gas price on this network and the token price
	 */
	handlers?: {
		/**
		 * will register a gas price handler for this network
		 */
		gasPrice?: GasPriceFunction;
		/**
		 * will register a token price handler for this network
		 */
		tokenPrice?: TokenPriceFunction;
	};

	/**
	 * if true, InfinityMint will treat this chain as a test chain.
	 *
	 * @default
	 * false //true if chainId 1337 and chainId 31337
	 */
	testnet?: boolean;
}

/**
 * the interface for the .session file
 */
export interface InfinityMintSession {
	environment?: any;
	created: number;
}

/**
 * @see {@link InfinityMintConfigSettings}
 */
export interface InfinityMintConfigSettingsDeploy extends Dictionary<any> {
	/**
	 * locations are relative to the cwd
	 */
	scriptFolders?: PathLike[];
}

/**
 * @see {@link InfinityMintConfigSettings}
 */
export interface InfinityMintConfigSettingsBuild extends Dictionary<any> {}

/**
 * A mutable object containing infinity mint specific settings for each network. Based off of the networks which are defined in the hardhat member of the InfinityMintConfig Settings.
 * @see {@link InfinityMintConfigSettings}
 * @see {@link InfinityMintConfigSettingsNetwork}
 */
export interface InfinityMintConfigSettingsNetworks
	extends Dictionary<InfinityMintConfigSettingsNetwork> {
	ganache?: InfinityMintConfigSettingsNetwork;
	hardhat?: InfinityMintConfigSettingsNetwork;
	ethereum?: InfinityMintConfigSettingsNetwork;
	polygon?: InfinityMintConfigSettingsNetwork;
	mumbai?: InfinityMintConfigSettingsNetwork;
	goreli?: InfinityMintConfigSettingsNetwork;
}
/**
 * @see {@link InfinityMintConfigSettings}
 */
export interface InfinityMintConfigSettingsCompile extends Dictionary<any> {}

/**
 * here you can specify the infinity mint settings for the `networks`, `deploy` and `build` and `export` steps. You can configure infinity mint here.
 *
 * @see {@link InfinityMintConfigSettingsNetwork}
 * @see {@link InfinityMintConfigSettingsDeploy}
 * @see {@link InfinityMintConfigSettingsBuild}
 * @see {@link InfinityMintConfigSettingsCompile}
 */
export interface InfinityMintConfigSettings extends Dictionary<any> {
	/**
	 * each key is the network name followed by an object with the type of {@link InfinityMintConfigSettingsNetwork}
	 *
	 * @example
	 * ```js
	 * networks: {
	 *		//settings for the hardhat network
	 *		hardhat: {
	 *			defaultAccount: 0,
	 *		},
	 *		//settings for the ganache network
	 *		ganache: {
	 *			defaultAccount: 0,
	 *		},
	 *	},
	 * ```
	 */
	networks: InfinityMintConfigSettingsNetworks;
	/**
	 * Configure InfinityMints deploy stage here.
	 *
	 * @see {@link InfinityMintConfigSettingsDeploy}
	 * @see {@link InfinityMintDeploymentLive}
	 */
	deploy?: InfinityMintConfigSettingsDeploy;
	/**
	 * Configure InfinityMints deploy stage here.
	 *
	 * @see {@link InfinityMintConfigSettingsBuild}
	 */
	build?: InfinityMintConfigSettingsBuild;
	/**
	 * Configure InfinityMints compile stage here.
	 *
	 * @see {@link InfinityMintConfigSettingsCompile}
	 */
	compile?: InfinityMintConfigSettingsCompile;
}

/**
 * This interface refers to the specific arguments which can be passed to the script. Either as parameters in a bash script or from the InfinityMintConsole. See {@link InfinityMintScript}
 */
export interface InfinityMintScriptArguments {
	name: string;
	optional?: boolean;
	validator?: Function;
	value?: any;
}

/**
 *
 */
export interface InfinityMintConsoleOptions {
	blessed?: Dictionary<any>;
	/**
	 * custom think method
	 */
	think: Function;
	/**
	 * number of ms to wait before running think again
	 */
	tickRate: number;
	/**
	 * if to throw errors outside of the console
	 */
	throwErrors: boolean;
	/**
	 * the initial window the console should open into
	 */
	initialWindow?: string | Window;
}

/**
 * An InfinityMint script is like a Hardhat test, it essentially allows InfinityMint to perform a task. The scripts by default are located in the `./scripts` folder.
 */

export interface InfinityMintScript {
	name?: string;
	description?: string;
	/**
	 * called when the script is executed, is passed {@link InfinityMintScriptParameters}. Return false to signify that this script failed.
	 */
	execute: FuncSingle<InfinityMintScriptParameters, Promise<boolean | void>>;
	loaded?: FuncSingle<InfinityMintScriptEventParameters, Promise<void>>;
	reloaded?: FuncSingle<InfinityMintScriptEventParameters, Promise<void>>;
	arguments?: InfinityMintScriptArguments[];
}

/**
 * This is passed into the execute method of the script inside the scripts/ folder by default. See {@link InfinityMintScript}
 */
export interface InfinityMintScriptParameters
	extends InfinityMintDeploymentParameters,
		Dictionary<any> {
	gems?: Dictionary<InfinityMintGemScript>;
	args?: Dictionary<InfinityMintScriptArguments>;
}

export interface InfinityMintScriptEventParameters {
	console?: InfinityConsole;
	log: typeof log;
	debugLog: typeof debugLog;
	script?: InfinityMintDeploymentScript;
}

export interface InfinityMintDeploymentParametersDeployments
	extends Dictionary<InfinityMintDeploymentLive> {
	assets: InfinityMintDeploymentLive;
	royalty: InfinityMintDeploymentLive;
	erc721: InfinityMintDeploymentLive;
	random: InfinityMintDeploymentLive;
	minter: InfinityMintDeploymentLive;
	values: InfinityMintDeploymentLive;
	utils: InfinityMintDeploymentLive;
	InfinityMintLinker: InfinityMintDeploymentLive;
	InfinityMintProject: InfinityMintDeploymentLive;
}

export interface InfinityMintDeploymentLocal extends Dictionary<any> {
	abi?: any[];
	name?: string;
	address?: string;
	args?: any[];
	transactionHash?: string;
	receipt?: Dictionary<any>;
	input?: Dictionary<any>;
	output?: Dictionary<any>;
	sourceName?: string;
	contractName?: string;
	deployer?: string;
}

/**
 * Parameters which are passed into every deploy script. See {@link InfinityMintDeploymentScript}
 */
export interface InfinityMintDeploymentParameters extends Dictionary<any> {
	/**
	 * Returns true if this deployment has been set up or not.
	 *
	 * @defautValue false
	 */
	setup?: boolean;
	/**
	 * the current infinity console this is running from
	 */
	console?: InfinityConsole;
	/**
	 * the event emitter for you to emit events from
	 */
	eventEmitter?: EventEmitter;
	/**
	 * Might have check if undefined depending on context
	 */
	project?: InfinityMintProject;
	/**
	 * Contains a list of InfinityMint deployment classes which have been deployed or about to be deployed up to this point
	 */
	deployments?: Dictionary<InfinityMintDeployment>;
	/**
	 * Contains a list of only the deployed contracts up to this point, unlike deployments member which has all the deployments including none deployed
	 */
	contracts?: Dictionary<InfinityMintDeploymentLive>;
	/**
	 * the current script this method is being executed on
	 */
	script?: InfinityMintDeploymentScript;
	/**
	 * the current deployment
	 */
	deployment?: InfinityMintDeployment;
	log: typeof log;
	debugLog: typeof debugLog;
	/**
	 * is true if this is the first time running the setup
	 */
	isFirstTime?: boolean;
}

/**
 * An InfinityMint Depllyment is a smart contract which is currently active on which ever network is currently set. It holds the
 * abi for the contract along with its address and who deployed it. It also contains which project (see {@link InfinityMintProject}) it was deployed under.
 *
 * @see {@link InfinityMintDeploymentScript}
 */
export interface InfinityMintDeploymentLive extends Dictionary<any> {
	/**
	 *  The abi of the current dpeloyment.
	 */
	abi?: Array<any>;
	/**
	 * the key of this live deployment, by default will be the contract name
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
	 *
	 * @see {@link InfinityMintProject}
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
	/**
	 * true if the contract has had its setup method called successfully in the deploy script, see {@link InfinityMintDeploymentScript}
	 */
	setup?: boolean;

	/**
	 * the location of the deployment script which deployed this deployment
	 */
	deploymentScript?: string;
	/**
	 * is true if the project file this deployment is from is a javascript file and not typescript
	 */
	javascript?: boolean;
}

/**
 * This is the interface which should be returned from all deployment scripts inside of the `./deploy` folder.
 *
 * @see {@link InfinityMintDeploymentLive}
 */
export interface InfinityMintDeploymentScript {
	/**
	 * @async
	 * Deploys the smart contract or smart contracts.
	 */
	deploy?: FuncSingle<
		InfinityMintDeploymentParameters,
		Promise<Contract | Contract[]>
	>;
	/**
	 * @async
	 * Only called when the project has been deployed. Called when a live InfinityMint switches from key to the other particuarlly in the modules. See {@link InfinityMintProjectModules}. For instance if the minter was to change from SimpleSVG to SimpleImage then this method would be called. An example use would be to relink the newly asset controller to the minter.
	 */
	switch?: FuncSingle<InfinityMintDeploymentParameters, Promise<void>>;
	/**
	 * @async
	 * Sets up the smart contract post deployment.
	 */
	setup?: FuncSingle<InfinityMintDeploymentParameters, Promise<void>>;
	/**
	 * @async
	 * Called when a project has been deployed or has failed to deploy and is retrying. Defines how to clean up an active smart contract with the goal of running setup again to update changes.
	 */
	cleanup?: FuncSingle<InfinityMintDeploymentParameters, Promise<void>>;
	/**
	 * @async
	 * Only called when the project has been deployed. Define custom update logic depending on the situation. By default if an update method is not defined in the deployment script InfinityMint will execute clean up and then set up in the deployment script.
	 */
	update?: FuncSingle<InfinityMintDeploymentParameters, Promise<void>>;
	/**
	 * The list of addresses or refrences which will be given admin access to this contract. Can be addresses or keys.
	 *
	 *
	 * @example
	 * ```js
	 * //erc721 will replace with address of InfinityMint (erc721) deployment
	 * ['approved', 'all', 'erc721']
	 * ```
	 */
	permissions?: Array<string>;
	/**
	 * Only takes currently deployed contract names or module keys, will request that this contract is given permissions to any contract defined in the array
	 *
	 *
	 * @example
	 * ```js
	 * //all will give requestPermissions to every contract InfinityMint can
	 * ['all', 'erc721']
	 * ```
	 */
	requestPermissions?: Array<string>;
	/**
	 * If important is true will prevent allow other deploy scripts from overwrite this key. If false will allow scripts to overwrite this key even if unique is true
	 *
	 * @defaultValue false
	 */
	important?: boolean;
	/**
	 * if set to true, infinityMint will throw an error if similar key to another deployment is found
	 */
	unique?: boolean;

	/**
	 * Will prevent redeployment of this contract. If no cleanup method is defined, then InfinityMint will automatically try to redeploy the contract and run setup again unless this member is true. If this member is true then InfinityMint will run the setup method again.
	 */
	static?: boolean;
	/**
	 * Will run setup immediately after the deployment is succcessful
	 *
	 * @defaultValue false
	 */
	instantlySetup?: boolean;
	/**
	 * The current solidity root this contract is designed for. Solidity namespace refers to the current folder the solc is compiling from and is usually `./alpha`. You can change it in the *.env* and it is used to prototype new versions if InfinityMint or to launch completely custom code bases.
	 *
	 * @defaultValue alpha
	 */
	solidityFolder?: PathLike;
	/**
	 * Refers to the name of the artifact/contract that this deployment script works with. Will be the same as the key if left undefined.
	 */
	contract?: string;
	/**
	 * used in auto deployment configuration (when no deploy field is set and contractName is of valid artifact), will pass these arguments to the constructor of the smart contract.
	 *
	 * @example
	 * ```js
	 * //will replace erc721, assets, royalty with the address of the live deployment that uses that tag. (if it has been deployed by this stage)
	 * deployArgs: ['erc721','assets', 'royalty','0x523...']
	 * ```
	 */
	deployArgs?: any[];
	/**
	 * If this deployment is a library. Will not set permissions.
	 *
	 * @defaultValue false
	 */
	library?: boolean;
	/**
	 * Defines which InfinityMint module this deployment satisfies (see {@link InfinityMintProjectModules}).
	 */
	module?: InfinityMintProjectModulesKeys[] | string;
	/**
	 * Will be the filename of the deploy script by default.
	 */
	key?: string;
	/**
	 * used to specify deployment order, lower indexes will be deployed over higher indexes. Minus values can be used.
	 *
	 * @defaultValue 10
	 */
	index?: number;
}
