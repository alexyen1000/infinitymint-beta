"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEnvSet = exports.isEnvTrue = exports.error = exports.saveSession = exports.saveSessionVariable = exports.getSolidityNamespace = exports.createInfinityMintConfig = exports.initializeGanacheMnemonic = exports.preInitialize = exports.loadInfinityMint = exports.initializeInfinitymintConfig = exports.overwriteConsoleMethods = exports.readSession = exports.debugLog = exports.log = void 0;
const pipes_1 = __importDefault(require("./pipes"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const bip39_1 = require("bip39");
const log = (msg, pipe) => {
    pipes_1.default.log(msg, pipe);
};
exports.log = log;
const debugLog = (msg) => {
    (0, exports.log)(msg, "debug");
};
exports.debugLog = debugLog;
const readSession = () => {
    if (!fs_extra_1.default.existsSync("./.session"))
        return { created: Date.now(), environment: {} };
    try {
        return JSON.parse(fs_extra_1.default.readFileSync("./.session", {
            encoding: "utf-8",
        }));
    }
    catch (error) {
        pipes_1.default.error(error);
    }
    return {
        created: Date.now(),
        environment: {},
    };
};
exports.readSession = readSession;
const overwriteConsoleMethods = () => {
    //overwrite console log
    let consoleLog = console.log;
    console.log = (msg, setPipe = true) => {
        var _a;
        if (setPipe && pipes_1.default.logs[pipes_1.default.currentPipe] !== undefined)
            pipes_1.default.getPipe(pipes_1.default.currentPipe).log(msg);
        if (((_a = pipes_1.default.logs[pipes_1.default.currentPipe]) === null || _a === void 0 ? void 0 : _a.listen) ||
            (pipes_1.default.logs[pipes_1.default.currentPipe] === undefined &&
                !(0, exports.isEnvTrue)("PIPE_SILENCE_UNDEFINED_PIPE")))
            consoleLog(msg);
    };
    let consoleError = console.error;
    console.error = (error, setPipe = true) => {
        var _a;
        if (setPipe && pipes_1.default.logs[pipes_1.default.currentPipe])
            pipes_1.default.getPipe(pipes_1.default.currentPipe).error(error);
        if ((0, exports.isEnvTrue)("PIPE_NOTIFY_ERRORS"))
            console.log("[error] " + (error === null || error === void 0 ? void 0 : error.message));
        if (((_a = pipes_1.default.logs[pipes_1.default.currentPipe]) === null || _a === void 0 ? void 0 : _a.listen) ||
            (0, exports.isEnvTrue)("PIPE_ECHO_ERRORS"))
            consoleError(error);
    };
};
exports.overwriteConsoleMethods = overwriteConsoleMethods;
const initializeInfinitymintConfig = () => {
    var _a, _b;
    //else, import the InfinityMint config
    const infinityMintConfig = require("./../infinitymint.config").default;
    let session = (0, exports.readSession)();
    //fuck about with hardhat config
    infinityMintConfig.hardhat.defaultNetwork =
        ((_a = infinityMintConfig.hardhat) === null || _a === void 0 ? void 0 : _a.defaultNetwork) ||
            ((_b = session.environment) === null || _b === void 0 ? void 0 : _b.defaultNetwork);
    if (infinityMintConfig.hardhat.networks === undefined)
        infinityMintConfig.hardhat.networks = {};
    if (infinityMintConfig.hardhat.networks.localhost === undefined &&
        infinityMintConfig.hardhat.networks.ganache !== undefined)
        infinityMintConfig.hardhat.networks.localhost =
            infinityMintConfig.hardhat.networks.ganache;
    if (infinityMintConfig.hardhat.paths === undefined)
        infinityMintConfig.hardhat.paths = {};
    //do
    if ((0, exports.isEnvTrue)("SOLIDITY_USE_NODE_MODULE")) {
        if (fs_extra_1.default.existsSync("./../package.json") &&
            JSON.parse(fs_extra_1.default.readFileSync("./../package.json", {
                encoding: "utf8",
            })).name === "infinitymint")
            throw new Error("cannot use node modules in InfinityMint package");
        if (!fs_extra_1.default.existsSync("./../node_modules/infinitymint/"))
            throw new Error("please npm i infinitymint");
        if (fs_extra_1.default.existsSync("./../" + session.environment.solidityNamespace) &&
            (0, exports.isEnvTrue)("SOLIDITY_CLEAN_NAMESPACE"))
            fs_extra_1.default.rmdirSync("./../" + session.environment.solidityNamespace, {
                recursive: true,
                force: true,
            });
        if (!fs_extra_1.default.existsSync("./../" +
            (process.env.INFINITYMINT_SOLIDITY_NAMESPACE ||
                (0, exports.getSolidityNamespace)()))) {
            (0, exports.debugLog)("copying ./../node_modules/infinitymint/" +
                (process.env.INFINITYMINT_SOLIDITY_NAMESPACE ||
                    (0, exports.getSolidityNamespace)()) +
                " to ./../" +
                (process.env.INFINITYMINT_SOLIDITY_NAMESPACE ||
                    (0, exports.getSolidityNamespace)()));
            fs_extra_1.default.copySync("./../node_modules/infinitymint/" +
                (process.env.INFINITYMINT_SOLIDITY_NAMESPACE ||
                    (0, exports.getSolidityNamespace)()), "./../" +
                (process.env.INFINITYMINT_SOLIDITY_NAMESPACE ||
                    (0, exports.getSolidityNamespace)()));
            fs_extra_1.default.chmodSync("./../" +
                (process.env.INFINITYMINT_SOLIDITY_NAMESPACE ||
                    (0, exports.getSolidityNamespace)()), 0o777);
        }
    }
    infinityMintConfig.hardhat.paths.sources =
        (process.env.SOLIDITY_ROOT || process.cwd()) +
            "/" +
            (process.env.INFINITYMINT_SOLIDITY_NAMESPACE || (0, exports.getSolidityNamespace)());
    //delete artifacts folder if namespace changes
    if (process.env.INFINITYMINT_SOLIDITY_NAMESPACE !== undefined &&
        session.environment.solidityNamespace !== undefined &&
        session.environment.solidityNamespace !==
            process.env.INFINITYMINT_SOLIDITY_NAMESPACE) {
        try {
            (0, exports.debugLog)("removing ./artifacts");
            fs_extra_1.default.rmdirSync("./artifacts", {
                recursive: true,
                force: true,
            });
            (0, exports.debugLog)("removing ./cache");
            fs_extra_1.default.rmdirSync("./cache", {
                recursive: true,
                force: true,
            });
            (0, exports.debugLog)("removing ./typechain-types");
            fs_extra_1.default.rmdirSync("./typechain-types", {
                recursive: true,
                force: true,
            });
        }
        catch (error) {
            (0, exports.debugLog)("unable to delete folder: " + (error === null || error === void 0 ? void 0 : error.message) || error);
        }
        session.environment.solidityNamespace =
            process.env.INFINITYMINT_SOLIDITY_NAMESPACE;
    }
    //set the solidity namespace
    if (session.environment.solidityNamespace === undefined)
        session.environment.solidityNamespace =
            process.env.INFINITYMINT_SOLIDITY_NAMESPACE;
    (0, exports.saveSession)(session);
    return infinityMintConfig;
};
exports.initializeInfinitymintConfig = initializeInfinitymintConfig;
const loadInfinityMint = (useJavascript) => {
    (0, exports.createInfinityMintConfig)(useJavascript);
    (0, exports.preInitialize)();
    (0, exports.initializeGanacheMnemonic)();
    (0, exports.overwriteConsoleMethods)();
};
exports.loadInfinityMint = loadInfinityMint;
const preInitialize = () => {
    //if there is no temp folder, make it.
    if (!fs_extra_1.default.existsSync("./temp"))
        fs_extra_1.default.mkdirSync("./temp");
    //if there is no temp folder, make it.
    if (!fs_extra_1.default.existsSync("./projects"))
        fs_extra_1.default.mkdirSync("./projects");
    //if there is no temp folder, make it.
    if (!fs_extra_1.default.existsSync("./gems"))
        fs_extra_1.default.mkdirSync("./gems");
    //copy the .env file from example if there is none
    if (!fs_extra_1.default.existsSync("./.env") && fs_extra_1.default.existsSync("./.env.example"))
        fs_extra_1.default.copyFileSync("./.env.example", "./.env");
    //will log console.log output to the default pipe
    if ((0, exports.isEnvTrue)("PIPE_ECHO_DEFAULT"))
        pipes_1.default.getPipe("default").listen = true;
    //create the debug pipe
    pipes_1.default.registerSimplePipe("debug", {
        listen: (0, exports.isEnvTrue)("PIPE_ECHO_DEBUG"),
        save: true,
    });
};
exports.preInitialize = preInitialize;
const initializeGanacheMnemonic = () => {
    var _a, _b;
    let session = (0, exports.readSession)();
    //if the ganache is not external and no mnemonic for ganache in the environment file then set one
    if ((0, exports.isEnvTrue)("GANACHE_EXTERNAL") === false &&
        ((_a = session.environment) === null || _a === void 0 ? void 0 : _a.ganacheMnemomic) === undefined)
        session.environment.ganacheMnemomic = (0, bip39_1.generateMnemonic)();
    (0, exports.debugLog)("saving " + session.environment.ganacheMnemomic + " to .session file");
    (0, exports.saveSession)(session);
    return (_b = session.environment) === null || _b === void 0 ? void 0 : _b.ganacheMnemomic;
};
exports.initializeGanacheMnemonic = initializeGanacheMnemonic;
const createInfinityMintConfig = (useJavascript) => {
    let config = {
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
    let filename = useJavascript
        ? "./infinitymint.config.js"
        : "./infinitymint.config.ts";
    let stub = useJavascript
        ? `\n
		const { InfinityMintConfig } = require("./app/config");

		//please visit docs.infinitymint.app for a more complete starter configuration file
		const config = {
			hardhat: ${JSON.stringify(config, null, 2)}
		}
		module.exports = config;`
        : `\n
		import { InfinityMintConfig } from "./app/config";

		//please visit docs.infinitymint.app for a more complete starter configuration file
		const config: InfinityMintConfig = {
			hardhat: ${JSON.stringify(config, null, 2)}
		}
		export default config;`;
    //check if the infinity mint config file has not been created, if it hasn't then create a new config file with the values of the object above
    if (!fs_extra_1.default.existsSync(filename)) {
        fs_extra_1.default.writeFileSync(filename, stub);
    }
};
exports.createInfinityMintConfig = createInfinityMintConfig;
const getSolidityNamespace = () => {
    var _a;
    let session = (0, exports.readSession)();
    return (((_a = session.environment) === null || _a === void 0 ? void 0 : _a.solidityNamespace) ||
        process.env.INFINITYMINT_SOLIDITY_NAMESPACE ||
        "alpha");
};
exports.getSolidityNamespace = getSolidityNamespace;
const saveSessionVariable = (session, key, value) => {
    if (session.environment === undefined)
        session.environment = {};
    session.environment[key] = value;
    return session;
};
exports.saveSessionVariable = saveSessionVariable;
const saveSession = (session) => {
    fs_extra_1.default.writeFileSync("./.session", JSON.stringify(session));
};
exports.saveSession = saveSession;
const error = (error) => {
    pipes_1.default.log(error.toString());
};
exports.error = error;
const isEnvTrue = (key) => {
    return process.env[key] !== undefined && process.env[key] === "true";
};
exports.isEnvTrue = isEnvTrue;
const isEnvSet = (key) => {
    var _a;
    return (process.env[key] !== undefined && ((_a = process.env[key]) === null || _a === void 0 ? void 0 : _a.trim().length) !== 0);
};
exports.isEnvSet = isEnvSet;
//# sourceMappingURL=helpers.js.map