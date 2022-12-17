"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const node_fs_1 = __importDefault(require("node:fs"));
const pipes_1 = __importDefault(require("./app/pipes"));
const helpers_1 = require("./app/helpers");
const bip39_1 = require("bip39");
//if there is no temp folder, make it.
if (!node_fs_1.default.existsSync("./temp"))
    node_fs_1.default.mkdirSync("./temp");
//copy the .env file from example if there is none
if (!node_fs_1.default.existsSync("./.env"))
    node_fs_1.default.copyFileSync("./.env.example", "./.env");
//require dotenv
require("dotenv").config({
    override: false, //will not override already established environment variables
});
//imports ethers to be used inside and outside of hardhat scripts
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("hardhat-change-network"); //allows hre.changeNetwork to occur
//default hardhat config file, this is copied into the InfinityMint config file on its initial creation
const config = {
    solidity: {
        version: "0.8.12",
        settings: {
            optimizer: {
                enabled: true,
                runs: 20,
            },
        },
    },
    paths: {
        tests: "./tests",
    },
};
//check if the infinity mint config file has not been created, if it hasn't then create a new config file with the values of the object above
if (!node_fs_1.default.existsSync("./infinitymint.config.ts")) {
    let stub = `\n
		import { InfinityMintConfig } from "./app/config";

		//please visit docs.infinitymint.app for a more complete starter configuration file
		const config: InfinityMintConfig = {
			hardhat: ${JSON.stringify(config, null, 2)}
		}
		export default config;
	`;
    node_fs_1.default.writeFileSync("./infinitymint.config.ts", stub);
}
//overwrite console log
let consoleLog = console.log;
console.log = (msg, setPipe = true) => {
    var _a;
    if (setPipe && pipes_1.default.logs[pipes_1.default.currentPipe] !== undefined)
        pipes_1.default.getPipe(pipes_1.default.currentPipe).logs.push(msg);
    if ((_a = pipes_1.default.logs[pipes_1.default.currentPipe]) === null || _a === void 0 ? void 0 : _a.listen)
        consoleLog(msg);
};
let consoleError = console.error;
console.error = (error, setPipe = true) => {
    var _a;
    if (setPipe && pipes_1.default.logs[pipes_1.default.currentPipe])
        pipes_1.default.getPipe(pipes_1.default.currentPipe).error(error);
    if ((0, helpers_1.isEnvTrue)("PIPE_NOTIFY_ERRORS"))
        console.log("[error] " + (error === null || error === void 0 ? void 0 : error.message));
    if (((_a = pipes_1.default.logs[pipes_1.default.currentPipe]) === null || _a === void 0 ? void 0 : _a.listen) || (0, helpers_1.isEnvTrue)("PIPE_ECHO_ERRORS"))
        consoleError(error);
};
//will log console.log output to the default pipe
if ((0, helpers_1.isEnvTrue)("PIPE_ECHO_DEFAULT"))
    pipes_1.default.getPipe("default").listen = true;
//create the debug pipe
pipes_1.default.registerSimplePipe("debug", {
    listen: (0, helpers_1.isEnvTrue)("PIPE_ECHO_DEBUG"),
    save: true,
});
//read the session
let session = (0, helpers_1.readSession)();
//if the ganache is not external and no mnemonic for ganache in the environment file then set one
if ((0, helpers_1.isEnvTrue)("GANACHE_EXTERNAL") === false &&
    ((_a = session.environment) === null || _a === void 0 ? void 0 : _a.ganacheMnemomic) === undefined)
    session.environment.ganacheMnemomic = (0, bip39_1.generateMnemonic)();
(0, helpers_1.debugLog)("saving .session file");
(0, helpers_1.saveSession)(session);
//else, import the InfinityMint config
const infinityMintConfig = require("./infinitymint.config").default;
session = (0, helpers_1.readSession)();
//fuck about with hardhat config
infinityMintConfig.hardhat.defaultNetwork =
    ((_b = infinityMintConfig.hardhat) === null || _b === void 0 ? void 0 : _b.defaultNetwork) ||
        ((_c = session.environment) === null || _c === void 0 ? void 0 : _c.defaultNetwork);
if (infinityMintConfig.hardhat.networks === undefined)
    infinityMintConfig.hardhat.networks = {};
if (infinityMintConfig.hardhat.networks.localhost === undefined &&
    infinityMintConfig.hardhat.networks.ganache !== undefined)
    infinityMintConfig.hardhat.networks.localhost =
        infinityMintConfig.hardhat.networks.ganache;
if (infinityMintConfig.hardhat.paths === undefined)
    infinityMintConfig.hardhat.paths = {};
infinityMintConfig.hardhat.paths.sources = "./" + (0, helpers_1.getSolidityNamespace)();
//delete artifacts folder if namespace changes
if (process.env.INFINITYMINT_SOLIDITY_NAMESPACE !== undefined &&
    session.environment.solidityNamespace !== undefined &&
    session.environment.solidityNamespace !==
        process.env.INFINITYMINT_SOLIDITY_NAMESPACE) {
    try {
        (0, helpers_1.debugLog)("removing ./artifacts");
        node_fs_1.default.rmdirSync("./artifacts", {
            recursive: true,
            force: true,
        });
        (0, helpers_1.debugLog)("removing ./cache");
        node_fs_1.default.rmdirSync("./cache", {
            recursive: true,
            force: true,
        });
        (0, helpers_1.debugLog)("removing ./typechain-types");
        node_fs_1.default.rmdirSync("./typechain-types", {
            recursive: true,
            force: true,
        });
    }
    catch (error) {
        (0, helpers_1.debugLog)("unable to delete folder: " + (error === null || error === void 0 ? void 0 : error.message) || error);
    }
    session.environment.solidityNamespace =
        process.env.INFINITYMINT_SOLIDITY_NAMESPACE;
}
if (session.environment.solidityNamespace === undefined)
    session.environment.solidityNamespace =
        process.env.INFINITYMINT_SOLIDITY_NAMESPACE;
(0, helpers_1.saveSession)(session);
(0, helpers_1.debugLog)("loaded hardhat.config.ts");
exports.default = infinityMintConfig.hardhat; //export the infinity mint configuration file
//# sourceMappingURL=hardhat.config.js.map