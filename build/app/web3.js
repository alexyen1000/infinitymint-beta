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
exports.startNetworkPipe = exports.getPrivateKeys = exports.registerNetworkPipes = exports.getDefaultAccountIndex = exports.getNetworkSettings = exports.getDeployment = exports.get = exports.logTransaction = exports.getSignedContract = exports.getContract = exports.getProvider = exports.changeNetwork = exports.deployBytecode = exports.deployContract = exports.deploy = exports.getDefaultSigner = void 0;
const hardhat_1 = __importStar(require("hardhat"));
const helpers_1 = require("./helpers");
const fs_1 = __importDefault(require("fs"));
const pipes_1 = __importDefault(require("./pipes"));
const ganacheServer_1 = __importDefault(require("./ganacheServer"));
const deployments_1 = require("./deployments");
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
/**
 *
 * @param artifactName
 * @param args
 * @returns
 */
const deploy = async (artifactName, signer, args, save, logDeployment, usePreviousDeployment) => {
    var _a, _b;
    signer = signer || (await (0, exports.getDefaultSigner)());
    let artifact = await hardhat_1.artifacts.readArtifact(artifactName);
    let fileName = process.cwd() +
        `/deployments/${hardhat_1.default.network.name}/${artifact.contractName}.json`;
    let buildInfo = await hardhat_1.artifacts.getBuildInfo(artifactName);
    if (usePreviousDeployment && fs_1.default.existsSync(fileName)) {
        let deployment = JSON.parse(fs_1.default.readFileSync(fileName, {
            encoding: "utf-8",
        }));
        if (logDeployment)
            (0, helpers_1.log)(`🔖 using previous deployment at (${deployment.address}) for ${artifact.contractName}`);
        let contract = await hardhat_1.ethers.getContractAt(artifact.contractName, deployment.address, signer);
        let session = (0, helpers_1.readSession)();
        if (((_a = session.environment) === null || _a === void 0 ? void 0 : _a.deployments[contract.address]) === undefined) {
            if (session.environment.deployments === undefined)
                session.environment.deployments = {};
            session.environment.deployments[contract.address] = Object.assign(Object.assign(Object.assign({}, artifact), buildInfo), { args: args, name: artifact.contractName, address: contract.address, transactionHash: contract.deployTransaction.hash, deployer: contract.deployTransaction.from, receipt: contract.deployTransaction });
            (0, helpers_1.debugLog)(`saving deployment of ${artifact.contractName} to session`);
            (0, helpers_1.saveSession)(session);
        }
        return contract;
    }
    let factory = await hardhat_1.ethers.getContractFactory(artifact.contractName, signer);
    let contract = await (0, exports.deployContract)(factory, args);
    (0, exports.logTransaction)(contract.deployTransaction);
    if (!save)
        return contract;
    let savedDeployment = Object.assign(Object.assign(Object.assign({}, artifact), buildInfo), { args: args, name: artifact.contractName, address: contract.address, transactionHash: contract.deployTransaction.hash, deployer: contract.deployTransaction.from, receipt: contract.deployTransaction });
    let session = (0, helpers_1.readSession)();
    if (((_b = session.environment) === null || _b === void 0 ? void 0 : _b.deployments) === undefined)
        session.environment.deployments = {};
    (0, helpers_1.debugLog)(`saving deployment to session`);
    session.environment.deployments[contract.address] = savedDeployment;
    (0, helpers_1.saveSession)(session);
    (0, helpers_1.debugLog)(`saving ${fileName}`);
    (0, helpers_1.log)(`⭐ deployed ${artifact.contractName} => [${contract.address}]`);
    if (!fs_1.default.existsSync(process.cwd() + "/deployments/" + hardhat_1.default.network.name + "/"))
        fs_1.default.mkdirSync(process.cwd() + "/deployments/" + hardhat_1.default.network.name + "/");
    fs_1.default.writeFileSync(fileName, JSON.stringify(savedDeployment, null, 2));
    return contract;
};
exports.deploy = deploy;
/**
 * Deploys a contract, takes an ethers factory. Does not save the deployment.
 * @param factory
 * @param args
 * @returns
 */
const deployContract = async (factory, args) => {
    let contract = await factory.deploy(args);
    let tx = await contract.deployed();
    return contract;
};
exports.deployContract = deployContract;
/**
 * Deploys a contract via its bytecode. Does not save the deployment
 * @param abi
 * @param bytecode
 * @param args
 * @param signer
 * @returns
 */
const deployBytecode = async (abi, bytecode, args, signer) => {
    signer = signer || (await (0, exports.getDefaultSigner)());
    let factory = await hardhat_1.ethers.getContractFactory(abi, bytecode, signer);
    return await (0, exports.deployContract)(factory, args);
};
exports.deployBytecode = deployBytecode;
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
/**
 * Returns an ethers contract instance but takes an InfinityMintDeployment directly
 * @param deployment
 * @param provider
 * @returns
 */
const getContract = (deployment, provider) => {
    provider = provider || (0, exports.getProvider)();
    return new hardhat_1.ethers.Contract(deployment.address, deployment.abi, provider);
};
exports.getContract = getContract;
/**
 * Returns an instance of a contract which is signed
 * @param artifactOrDeployment
 * @param signer
 * @returns
 */
const getSignedContract = async (artifactOrDeployment, signer) => {
    signer = signer || (await (0, exports.getDefaultSigner)());
    if (typeof artifactOrDeployment === "string") {
        let factory = await hardhat_1.ethers.getContractFactory(artifactOrDeployment);
        return factory.connect(signer);
    }
    let contract = (0, exports.getContract)(artifactOrDeployment, signer.provider);
    return contract.connect(signer);
};
exports.getSignedContract = getSignedContract;
const logTransaction = async (execution, logMessage, printGasUsage) => {
    if ((logMessage === null || logMessage === void 0 ? void 0 : logMessage.length) !== 0) {
        (0, helpers_1.log)(`🏳️‍🌈 ${logMessage}`);
    }
    if (typeof execution === typeof Promise)
        execution = await execution;
    let tx = execution;
    (0, helpers_1.log)(`🏷️ <${tx.hash}>(chainId: ${tx.chainId})`);
    let receipt;
    if (tx.wait !== undefined) {
        receipt = await tx.wait();
    }
    else
        receipt = await (0, exports.getProvider)().getTransactionReceipt(tx.blockHash);
    (0, helpers_1.log)(`{green-fg}😊 Success{/green-fg}`);
    let session = (0, helpers_1.readSession)();
    if (session.environment.temporaryGasReceipts === undefined)
        session.environment.temporaryGasReceipts = [];
    let savedReceipt = Object.assign(Object.assign({}, receipt), { gasUsedEther: hardhat_1.ethers.utils.formatEther(receipt.gasUsed.toString()), gasUsedNumerical: parseInt(receipt.gasUsed.toString()) });
    session.environment.temporaryGasReceipts.push({ savedReceipt });
    if (printGasUsage)
        (0, helpers_1.log)("{magenta-fg}⛽ gas: {/magenta-fg}" +
            savedReceipt.gasUsedEther +
            " ETH");
    (0, helpers_1.saveSession)(session);
    return receipt;
};
exports.logTransaction = logTransaction;
/**
 * Returns an ethers contract which you can use to execute methods on a smart contraact.
 * @param contractName
 * @param network
 * @param provider
 * @returns
 */
const get = (contractName, network, provider) => {
    provider = provider || (0, exports.getProvider)();
    return (0, exports.getContract)((0, deployments_1.getLocalDeployment)(contractName, network), provider);
};
exports.get = get;
/**
 * Returns an InfinityMintLiveDeployment with that contract name
 * @param contractName
 * @param network
 * @returns
 */
const getDeployment = (contractName, network) => {
    return (0, deployments_1.create)((0, deployments_1.getLocalDeployment)(contractName, network || hardhat_1.default.network.name));
};
exports.getDeployment = getDeployment;
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
        if ((0, helpers_1.isEnvTrue)("THROW_ALL_ERRORS"))
            throw error;
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
        if ((0, helpers_1.isEnvTrue)("THROW_ALL_ERRORS"))
            throw error;
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
        if ((0, helpers_1.isEnvTrue)("THROW_ALL_ERRORS"))
            throw error;
    }
    ProviderListeners[network].error = provider.on("error", (tx) => {
        pipes_1.default.getPipe(settings.useDefaultPipe ? "default" : network).error("{red-fg}tx error:{/reg-fg} \n" + tx.toString());
    });
    (0, helpers_1.debugLog)("registered provider event hooks for " + network);
};
exports.startNetworkPipe = startNetworkPipe;
//# sourceMappingURL=web3.js.map