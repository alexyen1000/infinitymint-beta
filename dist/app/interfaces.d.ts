/// <reference types="node" />
import { BigNumber } from "ethers";
import { Dictionary } from "form-data";
import { HardhatUserConfig } from "hardhat/types";
import { FuncSingle } from "./helpers";
import { ServerOptions } from "ganache";
import { EventEmitter } from "events";
import { DeploymentScript } from "./deployments";
import InfinityConsole from "./console";
export interface InfinityMintGem extends InfinityMintDeploymentScript {
    name: string;
    init?: FuncSingle<InfinityMintGemParameters, Promise<void>>;
}
export interface InfinityMintGemParameters extends InfinityMintDeploymentParameters {
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
 * @interface
 * InfinityMint Project settings
 * {@param name} - Name of the rpoejct
 * {@param infinityLinks} - Specify custom InfinityLinks
 * {@param system} - Specify whether the project is part of a grouped system with other projects.
 * {@param modules} - Specify which InfintyMint modules will be used within
   the creation of tokens, such as *RarityMinter*, *RoyaltyController*.
   This is an immutable setting that cannot be changed or added with more.
     They are specific to the InfinityMint source code.
 */
export interface InfinityMintProject {
    name: string;
    infinityLinks?: Array<InfinityMintProjectSettingsLink>;
    system?: Array<string>;
    modules: InfinityMintProjectModules;
    price: number | BigNumber | string;
    information: InfinityMintProjectInformation;
    basePath?: InfinityMintProjectPath;
    gems?: Array<InfinityMintProjectGem>;
    baseAsset?: InfinityMintProjectAsset;
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
export interface InfinityMintProjectSettingsRoyaltySplit extends Dictionary<any> {
    address: string;
    mints: number;
    stickers: number;
}
export interface InfinityMintProjectSettingsRoyaltyCuts extends Dictionary<any> {
    stickers: number;
}
export interface InfinityMintProjectSettingsRoyalty extends Dictionary<any> {
    cuts: InfinityMintProjectSettingsRoyaltyCuts;
    splits?: InfinityMintProjectSettingsRoyaltySplit | InfinityMintProjectSettingsRoyaltySplit[];
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
 *
 * @interface
 * The InfinityMint project configuration. Is read in the first phase of running `npm run start`.
 * {@param project} The name of the project.
 * {@param networks} - The web3 network(s) InfinityMint will connect to.
 * {@param hardhat} - The configuration that Hardhat will use to determine the versioning
   & settings Solidity runtime.
 * {@param ipfs} - The url to connect to IPFS, or set to false to not use IPFS.
     {@param ganache} The settings inputted to ganache within the `server.run()` function of its startup.
     Uses all valid configuration options found within their docs. <https://www.npmjs.com/package/ganache>
     For example;
     ```js
     ganache: {
    chain: {
      chainId: 1337,
    },
    wallet: {
            // `wallet.totalAccounts`
      totalAccounts: 20,
      defaultBalance: 69420,
    },
  },
    ```
    @param imports {Array<String>} - Other filesystem locations where IM will look for assets
    such as PNGs, Vectors etc.to create tokens with.
    @param settings {InfinityMintConfigSettings} - InfinityMint-specific config settings.
    Configures settings such as how networks behave, what wallets to use by default,
    & if to log a specific chain within `defaultPipe`, & specify whether a chain is *production* or a *testnet*.
    Also determines what will act as the *Gas Machine.*
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
export interface InfinityMintConfigSettingsNetwork {
    defaultAccount?: number;
    useDefaultPipe?: boolean;
}
export interface InfinityMintSession {
    environment?: any;
    created: number;
}
export interface InfinityMintConfigSettingsDeploy extends Dictionary<any> {
}
export interface InfinityMintConfigSettingsBuild extends Dictionary<any> {
}
export interface InfinityMintConfigSettingsExport extends Dictionary<any> {
}
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
 * Interface for the InfinityMint deployments (gems included)
 */
export interface InfinityMintDeployment extends Dictionary<any> {
    abi?: Array<any>;
    key?: string;
    name?: string;
    address?: string;
    project?: string;
    deployer?: string;
    receipt?: Dictionary<any>;
}
export interface InfinityMintDeploymentScript {
    deploy: FuncSingle<InfinityMintDeploymentParameters, Promise<void>>;
    setup: FuncSingle<InfinityMintDeploymentParameters, Promise<void>>;
    permissions?: Array<any>;
    important?: boolean;
    instantlySetup?: boolean;
    solidityNamespace?: string;
    library?: boolean;
    key?: string;
    index?: number;
}
//# sourceMappingURL=interfaces.d.ts.map