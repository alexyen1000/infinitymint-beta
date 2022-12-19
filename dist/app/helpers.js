"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEnvSet = exports.isEnvTrue = exports.error = exports.saveSession = exports.saveSessionVariable = exports.getSolidityNamespace = exports.createInfinityMintConfig = exports.initializeGanacheMnemonic = exports.preInitialize = exports.readJson = exports.createDirs = exports.loadInfinityMint = exports.initializeInfinitymintConfig = exports.getProject = exports.getCompiledProject = exports.getConfigFile = exports.overwriteConsoleMethods = exports.readSession = exports.debugLog = exports.log = void 0;
const pipes_1 = __importDefault(require("./pipes"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const fs_1 = __importDefault(require("fs"));
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
    if (!fs_1.default.existsSync(process.cwd() + "/.session"))
        return { created: Date.now(), environment: {} };
    try {
        return JSON.parse(fs_1.default.readFileSync(process.cwd() + "/.session", {
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
/**
 * Returns safely the infinity mint config file
 * @returns
 */
const getConfigFile = () => {
    let res = require(process.cwd() + "/infinitymint.config");
    res = res.default || res;
    return res;
};
exports.getConfigFile = getConfigFile;
const getCompiledProject = (projectName) => { };
exports.getCompiledProject = getCompiledProject;
const getProject = (projectName) => {
    let res = require(process.cwd() + "/projects/" + projectName + ".ts");
    res = res.default || res;
    return res;
};
exports.getProject = getProject;
/**
 * Loads the infinitymint.config.js and prepares the hardhat response. Only to be used inside of hardhat.config.ts.
 * @returns
 */
const initializeInfinitymintConfig = () => {
    var _a, _b;
    //else, import the InfinityMint config
    const infinityMintConfig = (0, exports.getConfigFile)();
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
    let solidityModuleFolder = process.cwd() +
        "/node_modules/infinitymint/" +
        (process.env.SOLIDITY_NAMESPACE || "alpha");
    let solidityFolder = process.cwd() + "/" + (process.env.SOLIDITY_NAMESPACE || "alpha");
    if ((0, exports.isEnvTrue)("SOLIDITY_USE_NODE_MODULE")) {
        if (fs_1.default.existsSync(process.cwd() + "/package.json") &&
            (0, exports.readJson)(process.cwd() + "/package.json").name === "infinitymint")
            throw new Error("cannot use node modules in InfinityMint package");
        if (!fs_1.default.existsSync(solidityModuleFolder))
            throw new Error("please npm i infinitymint and make sure " + module + "exists");
        if (fs_1.default.existsSync(solidityFolder) &&
            (0, exports.isEnvTrue)("SOLIDITY_CLEAN_NAMESPACE"))
            fs_1.default.rmdirSync(solidityFolder, {
                recursive: true,
                force: true,
            });
        if (!fs_1.default.existsSync(solidityFolder)) {
            (0, exports.debugLog)("copying " + solidityModuleFolder + " to " + solidityFolder);
            fs_extra_1.default.copySync(solidityModuleFolder, solidityFolder);
            fs_1.default.chmodSync(solidityFolder, 0o777);
        }
    }
    //set the sources
    infinityMintConfig.hardhat.paths.sources = solidityFolder;
    //delete artifacts folder if namespace changes
    if (process.env.SOLIDITY_NAMESPACE !== undefined &&
        session.environment.solidityNamespace !== undefined &&
        session.environment.solidityNamespace !== process.env.SOLIDITY_NAMESPACE) {
        try {
            (0, exports.debugLog)("removing ./artifacts");
            fs_1.default.rmdirSync(process.cwd() + "/artifacts", {
                recursive: true,
                force: true,
            });
            (0, exports.debugLog)("removing ./cache");
            fs_1.default.rmdirSync(process.cwd() + "/cache", {
                recursive: true,
                force: true,
            });
            (0, exports.debugLog)("removing ./typechain-types");
            fs_1.default.rmdirSync(process.cwd() + ".typechain-types", {
                recursive: true,
                force: true,
            });
        }
        catch (error) {
            (0, exports.debugLog)("unable to delete folder: " + (error === null || error === void 0 ? void 0 : error.message) || error);
        }
        session.environment.solidityNamespace = process.env.SOLIDITY_NAMESPACE;
    }
    //set the solidity namespace
    if (session.environment.solidityNamespace === undefined)
        session.environment.solidityNamespace =
            process.env.SOLIDITY_NAMESPACE || "alpha";
    (0, exports.saveSession)(session);
    return infinityMintConfig;
};
exports.initializeInfinitymintConfig = initializeInfinitymintConfig;
/**
 * Loaded when hardhat is being initialized, essentially creates an infinitymint.config if one is not available, generates a new ganache mnemonic and overwrites console.log and console.error to be piped to what ever pipe is currently default.
 *
 * @see {@link app/interfaces.InfinityMintConfig}
 * @see {@link app/pipes.Pipe}
 * @param useJavascript Will return infinitymint.config.js instead of infinitymint.config.ts
 * @param useInternalRequire  Will use require('./app/interfaces') instead of require('infinitymint/dist/app/interfaces')
 */
const loadInfinityMint = (useJavascript, useInternalRequire) => {
    (0, exports.createInfinityMintConfig)(useJavascript, useInternalRequire);
    (0, exports.preInitialize)();
    (0, exports.initializeGanacheMnemonic)();
    (0, exports.overwriteConsoleMethods)();
};
exports.loadInfinityMint = loadInfinityMint;
const createDirs = (dirs) => {
    dirs.filter((dir) => !fs_1.default.existsSync(dir)).forEach((dir) => fs_1.default.mkdirSync(process.cwd() + (dir[0] !== "/" ? "/" + dir : dir)));
};
exports.createDirs = createDirs;
const readJson = (fileName) => {
    return JSON.parse(fs_1.default.readFileSync(fileName, {
        encoding: "utf8",
    }));
};
exports.readJson = readJson;
const preInitialize = () => {
    //creates dirs
    (0, exports.createDirs)([
        "gems",
        "temp",
        "temp/settings",
        "temp/receipts",
        "temp/deployments",
        "temp/projects",
        "projects",
    ]);
    //copy the .env file from example if there is none
    if (!fs_1.default.existsSync(process.cwd() + "/.env") &&
        fs_1.default.existsSync(process.cwd() + "/.env.example"))
        fs_1.default.copyFileSync(process.cwd() + "/.env", process.cwd() + "/.env.example");
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
const createInfinityMintConfig = (useJavascript, useInternalRequire) => {
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
    let requireStatement = useInternalRequire
        ? "./app/interfaces"
        : "infinitymint/dist/app/interfaces";
    let filename = useJavascript
        ? "infinitymint.config.js"
        : "infinitymint.config.ts";
    let stub = useJavascript
        ? `\n
		const { InfinityMintConfig } = require("${requireStatement}");

		//please visit docs.infinitymint.app for a more complete starter configuration file
		const config = {
			hardhat: ${JSON.stringify(config, null, 2)}
		}
		module.exports = config;`
        : `\n
		import { InfinityMintConfig } from "${requireStatement}";

		//please visit docs.infinitymint.app for a more complete starter configuration file
		const config: InfinityMintConfig = {
			hardhat: ${JSON.stringify(config, null, 2)}
		}
		export default config;`;
    //check if the infinity mint config file has not been created, if it hasn't then create a new config file with the values of the object above
    if (!fs_1.default.existsSync(process.cwd() + "/" + filename)) {
        fs_1.default.writeFileSync(process.cwd() + "/" + filename, stub);
    }
};
exports.createInfinityMintConfig = createInfinityMintConfig;
const getSolidityNamespace = () => {
    var _a;
    let session = (0, exports.readSession)();
    return (((_a = session.environment) === null || _a === void 0 ? void 0 : _a.solidityNamespace) ||
        process.env.SOLIDITY_NAMESPACE ||
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
    fs_1.default.writeFileSync("./.session", JSON.stringify(session));
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