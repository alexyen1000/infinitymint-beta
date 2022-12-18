"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeploymentScripts = exports.DeploymentScript = void 0;
const events_1 = __importDefault(require("events"));
const helpers_1 = require("./helpers");
const glob_1 = require("glob");
const path_1 = __importDefault(require("path"));
class DeploymentScript {
    constructor(sourceFile, key) {
        this.emitter = new events_1.default.EventEmitter();
        this.source = require("./../" + sourceFile)
            .default;
        this.sourceFile = sourceFile;
        this.key = key;
    }
    /**
     * reloads the source file script
     */
    reload() {
        this.source = require("./../" + this.sourceFile)
            .default;
    }
    /**
     * Adds the listener function to the end of the listeners array for the event named eventName. No checks are made to see if the listener has already been added. Multiple  calls passing the same combination of eventNameand listener will result in the listener being added, and called, multiple times.
     *
     * Returns a reference to the EventEmitter, so that calls can be chained.
     * @param event
     * @param callback
     * @returns
     */
    on(event, callback) {
        return this.emitter.on(event, callback);
    }
    /**
     *
     * @param event
     * @param callback
     * @returns
     */
    off(event, callback) {
        return this.emitter.off(event, callback);
    }
    getIndex() {
        return this.source.index || 10;
    }
    getSolidityNamespace() {
        return this.source.solidityNamespace || "alpha";
    }
    getKey() {
        return this.key;
    }
    getPermissions() {
        return this.source.permissions;
    }
    async execute(method, args) {
        let params = Object.assign(Object.assign({}, args), { debugLog: helpers_1.debugLog, log: helpers_1.log, eventEmitter: this.emitter, deploy: this });
        (0, helpers_1.debugLog)("executing method " + method + " on " + this.key);
        switch (method) {
            case "deploy":
                await this.source.deploy(params);
                break;
            case "setup":
                await this.source.setup(params);
                break;
            default:
                throw new Error("unknown method:" + this.execute);
        }
    }
}
exports.DeploymentScript = DeploymentScript;
/**
 * Returns a list of all the deployment scripts
 * @returns
 */
const getDeploymentScripts = (root) => {
    (0, helpers_1.debugLog)("finding deployment scripts in: " + root);
    return new Promise((resolve, reject) => {
        let filePath = (root || "./") + "deploy/**/*.ts";
        (0, glob_1.glob)(filePath, (err, matches) => {
            if (err)
                throw err;
            (0, helpers_1.debugLog)("found " +
                matches.length +
                " deployment scripts in: " +
                filePath);
            resolve(matches.map((match, index) => {
                let key = path_1.default.parse(match).name;
                (0, helpers_1.debugLog)(`[${index}] => ${key}:(${match})`);
                return new DeploymentScript(match, key);
            }));
        });
    });
};
exports.getDeploymentScripts = getDeploymentScripts;
//# sourceMappingURL=deployments.js.map