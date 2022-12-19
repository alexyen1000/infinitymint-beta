"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startNetworkPipe = exports.getPrivateKeys = exports.registerNetworkPipes = exports.getDefaultAccountIndex = exports.getNetworkSettings = exports.getProvider = exports.changeNetwork = exports.getDefaultSigner = void 0;
const hardhat_1 = __importStar(require("hardhat"));
const helpers_1 = require("./helpers");
const pipes_1 = __importDefault(require("./pipes"));
const ganacheServer_1 = __importDefault(require("./ganacheServer"));
//stores listeners for the providers
const ProviderListeners = {};
const getDefaultSigner = async () => {
    if (hardhat_1.default.network.name === "ganache" &&
        (0, helpers_1.isEnvTrue)("GANACHE_EXTERNAL") === false) {
        let obj = ganacheServer_1.default.getProvider().getSigner((0, exports.getDefaultAccountIndex)());
        obj.address = await obj.getAddress();
        return obj;
    }
    let defaultAccount = (0, exports.getDefaultAccountIndex)();
    let signers = await hardhat_1.ethers.getSigners();
    if (signers[defaultAccount] === undefined)
        throw new Error("bad default account for network " +
            hardhat_1.default.network.name +
            " index " +
            defaultAccount +
            "does not exist");
    return signers[defaultAccount];
};
exports.getDefaultSigner = getDefaultSigner;
const changeNetwork = (network) => {
    hardhat_1.default.changeNetwork(network);
    if (network !== "ganache")
        (0, exports.startNetworkPipe)(hardhat_1.default.network.provider, network);
};
exports.changeNetwork = changeNetwork;
/**
 * Returns the current provider to use for web3 interaction.
 * Used to ensure that output from the ganache chain is piped correctly into the logger.
 * Since ganache is ran inside of this instance we use the EIP-1199 provider
 * and return that, if we aren't then we will assume hardhat has managed our provider for us and return what ever ethers uses, use this
 * over ethers.provider or hre.network.provider
 *
 * @returns
 */
const getProvider = () => {
    if (hardhat_1.default.network.name === "ganache" &&
        (0, helpers_1.isEnvTrue)("GANACHE_EXTERNAL") === false)
        return ganacheServer_1.default.getProvider();
    return hardhat_1.ethers.provider;
};
exports.getProvider = getProvider;
const getNetworkSettings = (network) => {
    var _a;
    let config = (0, helpers_1.getConfigFile)();
    return ((_a = config === null || config === void 0 ? void 0 : config.settings) === null || _a === void 0 ? void 0 : _a.networks[network]) || {};
};
exports.getNetworkSettings = getNetworkSettings;
const getDefaultAccountIndex = () => {
    var _a, _b;
    let config = (0, helpers_1.getConfigFile)();
    return ((_b = (_a = config === null || config === void 0 ? void 0 : config.settings) === null || _a === void 0 ? void 0 : _a.networks[hardhat_1.default.network.name]) === null || _b === void 0 ? void 0 : _b.defaultAccount) || 0;
};
exports.getDefaultAccountIndex = getDefaultAccountIndex;
const registerNetworkPipes = () => {
    let networks = Object.keys(hardhat_1.default.config.networks);
    let config = (0, helpers_1.getConfigFile)();
    networks.forEach((network) => {
        var _a;
        let settings = ((_a = config === null || config === void 0 ? void 0 : config.settings) === null || _a === void 0 ? void 0 : _a.networks[network]) || {};
        if (settings.useDefaultPipe)
            return;
        (0, helpers_1.debugLog)("registered pipe for " + network);
        pipes_1.default.registerSimplePipe(network);
    });
};
exports.registerNetworkPipes = registerNetworkPipes;
const getPrivateKeys = (mnemonic, walletLength) => {
    let keys = [];
    walletLength = walletLength || 20;
    for (let i = 0; i < walletLength; i++) {
        keys.push(hardhat_1.ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/` + i)
            .privateKey);
    }
    return keys;
};
exports.getPrivateKeys = getPrivateKeys;
const startNetworkPipe = (provider, network) => {
    let settings = (0, exports.getNetworkSettings)(hardhat_1.default.network.name);
    if (network === undefined)
        network = hardhat_1.default.network.name;
    if (provider === undefined)
        provider = hardhat_1.ethers.provider;
    ProviderListeners[network] = ProviderListeners[network] || {};
    //register events
    try {
        if (ProviderListeners[network].block)
            provider.off("block", ProviderListeners[network].block);
    }
    catch (error) {
        pipes_1.default.getPipe(settings.useDefaultPipe ? "default" : network).error(error);
    }
    ProviderListeners[network].block = provider.on("block", (blockNumber) => {
        (0, helpers_1.log)("{green-fg}new block:{/green-fg} #" + blockNumber, settings.useDefaultPipe ? "default" : network);
    });
    try {
        if (ProviderListeners[network].pending)
            provider.off("pending", ProviderListeners[network].pending);
    }
    catch (error) {
        pipes_1.default.getPipe(settings.useDefaultPipe ? "default" : network).error(error);
    }
    ProviderListeners[network].pending = provider.on("pending", (tx) => {
        (0, helpers_1.log)("{yellow-fg}new transaction pending:{/yellow-fg} " + tx.toString(), settings.useDefaultPipe ? "default" : network);
    });
    try {
        if (ProviderListeners[network].error)
            provider.off("error", ProviderListeners[network].error);
    }
    catch (error) {
        pipes_1.default.getPipe(settings.useDefaultPipe ? "default" : network).error(error);
    }
    ProviderListeners[network].error = provider.on("error", (tx) => {
        pipes_1.default.getPipe(settings.useDefaultPipe ? "default" : network).error("{red-fg}tx error:{/reg-fg} \n" + tx.toString());
    });
    (0, helpers_1.debugLog)("registered provider event hooks for " + network);
};
exports.startNetworkPipe = startNetworkPipe;
//# sourceMappingURL=web3.js.map