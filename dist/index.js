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
exports.Web3Helpers = exports.Interfaces = exports.ethers = exports.hre = exports.InfinityConsole = exports.Helpers = exports.GanacheServer = exports.InfinityMintConfig = void 0;
const Helpers = __importStar(require("./app/helpers"));
exports.Helpers = Helpers;
const console_1 = __importDefault(require("./app/console"));
exports.InfinityConsole = console_1.default;
const hardhat_1 = __importStar(require("hardhat"));
exports.hre = hardhat_1.default;
Object.defineProperty(exports, "ethers", { enumerable: true, get: function () { return hardhat_1.ethers; } });
const web3_1 = require("./app/web3");
const ganacheServer_1 = __importDefault(require("./app/ganacheServer"));
exports.GanacheServer = ganacheServer_1.default;
const infinitymint_config_1 = __importDefault(require("./infinitymint.config"));
exports.InfinityMintConfig = infinitymint_config_1.default;
const fs_1 = __importDefault(require("fs"));
//export the interfaces app as default
exports.Interfaces = __importStar(require("./app/interfaces"));
exports.Web3Helpers = __importStar(require("./app/web3"));
//if module_mode is false we are running infinitymint normally, if not we are going to not and just return our exports
if (Helpers.isEnvTrue("RUN_INFINITYMINT"))
    (async () => {
        var _a, _b;
        Helpers.log("starting infinitymint");
        let session = Helpers.readSession();
        Helpers.debugLog("printing hardhat tasks");
        Object.values(hardhat_1.default.tasks).forEach((task, index) => {
            Helpers.debugLog(`[${index}] => ${task.name}`);
        });
        if (!fs_1.default.existsSync("./artifacts"))
            await hardhat_1.default.run("compile");
        //register current network pipes
        (0, web3_1.registerNetworkPipes)();
        //start ganache
        if (((_a = hardhat_1.default.config.networks) === null || _a === void 0 ? void 0 : _a.ganache) !== undefined &&
            Helpers.isEnvTrue("GANACHE_EXTERNAL")) {
            //check for ganache and mnemonic here
        }
        else if (((_b = hardhat_1.default.config.networks) === null || _b === void 0 ? void 0 : _b.ganache) !== undefined) {
            //ask if they want to start ganache
            //start ganache here
            let obj = Object.assign({}, infinitymint_config_1.default.ganache);
            if (obj.wallet === undefined)
                obj.wallet = {};
            if (session.environment.ganacheMnemomic === undefined)
                throw new Error("no ganache mnemonic");
            obj.wallet.mnemonic = session.environment.ganacheMnemomic;
            Helpers.saveSession(session);
            Helpers.debugLog("starting ganache with menomic of: " + obj.wallet.mnemonic);
            //get private keys and save them to file
            let keys = (0, web3_1.getPrivateKeys)(session.environment.ganacheMnemomic);
            Helpers.debugLog("found " +
                keys.length +
                " private keys for mnemonic: " +
                session.environment.ganacheMnemomic);
            keys.forEach((key, index) => {
                Helpers.debugLog(`[${index}] => ${key}`);
            });
            session.environment.ganachePrivateKeys = keys;
            Helpers.saveSession(session);
            let provider = await ganacheServer_1.default.start(obj);
            (0, web3_1.startNetworkPipe)(provider, "ganache");
        }
        else {
            Helpers.debugLog("! WARNING ! no ganache network found");
        }
        let artifacts = hardhat_1.default.artifacts;
        let contracts = await artifacts.getAllFullyQualifiedNames();
        Helpers.debugLog("found " + contracts.length + " compiled contracts");
        contracts.forEach((contract, index) => {
            let split = contract.split(":");
            Helpers.debugLog(`[${index}] => (${split[1]}) => ${split[0]}`);
        });
        //start a network pipe if we aren't ganache as we do something different if we are
        if (hardhat_1.default.network.name !== "ganache")
            (0, web3_1.startNetworkPipe)();
        //initialize console
        Helpers.debugLog("starting InfinityConsole with solidity namespace of " +
            Helpers.getSolidityNamespace());
        let infinityConsole = new console_1.default();
        await infinityConsole.initialize();
    })().catch((error) => {
        console.error(error);
        process.exit(1);
    });
//# sourceMappingURL=index.js.map