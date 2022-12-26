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
exports.config = exports.Helpers = void 0;
const console_1 = __importDefault(require("./app/console"));
const hardhat_1 = __importDefault(require("hardhat"));
const web3_1 = require("./app/web3");
const ganacheServer_1 = __importDefault(require("./app/ganacheServer"));
const fs_1 = __importDefault(require("fs"));
//import things we need
const helpers_1 = require("./app/helpers");
//export helpers
exports.Helpers = __importStar(require("./app/helpers"));
(0, helpers_1.log)("reading infinitymint.config.ts");
//get the infinitymint config file and export it
exports.config = (0, helpers_1.getConfigFile)();
//function to launch the console
const launchConsole = async () => {
    var _a, _b;
    (0, helpers_1.log)("starting infinitymint");
    let session = (0, helpers_1.readSession)();
    (0, helpers_1.debugLog)("printing hardhat tasks");
    Object.values(hardhat_1.default.tasks).forEach((task, index) => {
        (0, helpers_1.debugLog)(`[${index}] => ${task.name}`);
    });
    if (!fs_1.default.existsSync("./artifacts"))
        await hardhat_1.default.run("compile");
    //register current network pipes
    (0, web3_1.registerNetworkPipes)();
    //start ganache
    if (((_a = hardhat_1.default.config.networks) === null || _a === void 0 ? void 0 : _a.ganache) !== undefined &&
        (0, helpers_1.isEnvTrue)("GANACHE_EXTERNAL")) {
        //check for ganache and mnemonic here
    }
    else if (((_b = hardhat_1.default.config.networks) === null || _b === void 0 ? void 0 : _b.ganache) !== undefined) {
        //ask if they want to start ganache
        //start ganache here
        let obj = Object.assign({}, exports.config.ganache);
        if (obj.wallet === undefined)
            obj.wallet = {};
        if (session.environment.ganacheMnemomic === undefined)
            throw new Error("no ganache mnemonic");
        obj.wallet.mnemonic = session.environment.ganacheMnemomic;
        (0, helpers_1.saveSession)(session);
        (0, helpers_1.debugLog)("starting ganache with menomic of: " + obj.wallet.mnemonic);
        //get private keys and save them to file
        let keys = (0, web3_1.getPrivateKeys)(session.environment.ganacheMnemomic);
        (0, helpers_1.debugLog)("found " +
            keys.length +
            " private keys for mnemonic: " +
            session.environment.ganacheMnemomic);
        keys.forEach((key, index) => {
            (0, helpers_1.debugLog)(`[${index}] => ${key}`);
        });
        session.environment.ganachePrivateKeys = keys;
        (0, helpers_1.saveSession)(session);
        let provider = await ganacheServer_1.default.start(obj);
        (0, web3_1.startNetworkPipe)(provider, "ganache");
    }
    else {
        (0, helpers_1.debugLog)("! WARNING ! no ganache network found");
    }
    let artifacts = hardhat_1.default.artifacts;
    let contracts = await artifacts.getAllFullyQualifiedNames();
    (0, helpers_1.debugLog)("found " +
        contracts.length +
        " compiled contracts in solidity root (" +
        (0, helpers_1.getSolidityFolder)() +
        ")");
    contracts.forEach((contract, index) => {
        let split = contract.split(":");
        (0, helpers_1.debugLog)(`[${index}] => (${split[1]}) => ${split[0]}`);
    });
    //start a network pipe if we aren't ganache as we do something different if we are
    if (hardhat_1.default.network.name !== "ganache")
        (0, web3_1.startNetworkPipe)();
    //initialize console
    (0, helpers_1.debugLog)("starting InfinityConsole with solidity root of " + (0, helpers_1.getSolidityFolder)());
    let infinityConsole = new console_1.default();
    await infinityConsole.initialize();
};
exports.default = launchConsole;
//if module_mode is false we are running infinitymint normally, if not we are going to not and just return our exports
if (exports.config.console)
    launchConsole().catch((error) => {
        console.error(error);
        process.exit(1);
    });
//# sourceMappingURL=index.js.map