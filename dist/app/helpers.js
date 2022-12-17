"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEnvSet = exports.isEnvTrue = exports.error = exports.saveSession = exports.saveSessionVariable = exports.getSolidityNamespace = exports.readSession = exports.debugLog = exports.log = void 0;
const pipes_1 = __importDefault(require("./pipes"));
const fs_1 = __importDefault(require("fs"));
const log = (msg, pipe) => {
    pipes_1.default.log(msg, pipe);
};
exports.log = log;
const debugLog = (msg) => {
    (0, exports.log)(msg, "debug");
};
exports.debugLog = debugLog;
const readSession = () => {
    if (!fs_1.default.existsSync("./.session"))
        return { created: Date.now(), environment: {} };
    try {
        return JSON.parse(fs_1.default.readFileSync("./.session", {
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
const getSolidityNamespace = () => {
    let session = (0, exports.readSession)();
    return (session.environment?.solidityNamespace ||
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
    return (process.env[key] !== undefined && process.env[key]?.trim().length !== 0);
};
exports.isEnvSet = isEnvSet;
//# sourceMappingURL=helpers.js.map