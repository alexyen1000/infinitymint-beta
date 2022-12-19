"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeployments = exports.InfinityMintDeployment = void 0;
const events_1 = __importDefault(require("events"));
const helpers_1 = require("./helpers");
const glob_1 = require("glob");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Deployment class for InfinityMint deployments
 */
class InfinityMintDeployment {
    constructor(deploymentScriptLocation, key, network, project) {
        this.emitter = new events_1.default.EventEmitter();
        this.deploymentScript = require(process.cwd() +
            "/deploy/" +
            deploymentScriptLocation).default;
        this.deploymentScriptLocation = deploymentScriptLocation;
        this.key = key;
        if (this.deploymentScript.key !== this.key)
            throw new Error("key mismatch: " +
                this.deploymentScript.key +
                " in " +
                deploymentScriptLocation +
                "should equal " +
                this.key);
        this.network = network;
        this.project = project;
        this.liveDeployments = [];
        if (fs_1.default.existsSync(this.getFilePath())) {
            this.liveDeployments = this.getDeployments();
            this.hasDeployedAll = this.liveDeployments.length !== 0;
            this.hasSetupDeployments =
                this.liveDeployments.filter((deployment) => deployment.setup)
                    .length === 0;
            (0, helpers_1.debugLog)(`previous deployment for [${this.key}]<${this.project}> exists`);
        }
    }
    /**
     * reloads the source file script
     */
    reload() {
        this.deploymentScript = require("./../" + this.deploymentScriptLocation)
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
        return this.deploymentScript.index || 10;
    }
    getSolidityNamespace() {
        return this.deploymentScript.solidityNamespace || "alpha";
    }
    getKey() {
        return this.key;
    }
    getPermissions() {
        return this.deploymentScript.permissions;
    }
    getFilePath() {
        var _a;
        return (process.cwd() +
            `/temp/deployments/${this.project.name}@${((_a = this.project.version) === null || _a === void 0 ? void 0 : _a.version) || "1.0.0"}/${this.key}_${this.network}.json`);
    }
    read() {
        if (!fs_1.default.existsSync(this.getFilePath()))
            return {
                liveDeployments: {},
            };
        let result = JSON.parse(fs_1.default.readFileSync(this.getFilePath(), {
            encoding: "utf-8",
        }));
        if ((result.project !== undefined && result.project !== this.project) ||
            (result.network !== undefined && result.network !== this.network))
            throw new Error("bad file: " +
                this.getFilePath() +
                " is from another network/project");
        return result;
    }
    getDeploymentByArtifactName(name) {
        return this.liveDeployments.filter((deployment) => (deployment.name = name));
    }
    getDeployer(index) {
        return this.liveDeployments[index || 0].deployer;
    }
    getApproved(index) {
        return this.liveDeployments[index || 0].approved;
    }
    getAddress(index) {
        return this.liveDeployments[index || 0].address;
    }
    isLibrary() {
        return this.deploymentScript.library;
    }
    getAbi(index) {
        return this.liveDeployments[index || 0].abi;
    }
    getDeployments() {
        let deployments = this.read();
        return deployments.liveDeployments;
    }
    hasDeployed() {
        return this.hasDeployedAll === true;
    }
    hasSetup() {
        return this.hasSetupDeployments === true;
    }
    save() {
        var _a, _b;
        let deployments = this.read();
        deployments.liveDeployments = this.liveDeployments;
        deployments.updated = Date.now();
        deployments.network = this.network;
        deployments.project = this.project.name;
        deployments.setup = this.hasSetupDeployments;
        //make the directory
        if (!fs_1.default.existsSync(process.cwd() +
            `/temp/deployments/${this.project.name}@${((_a = this.project.version) === null || _a === void 0 ? void 0 : _a.version) || "1.0.0"}/`))
            fs_1.default.mkdirSync(process.cwd() +
                `/temp/deployments/${this.project.name}@${((_b = this.project.version) === null || _b === void 0 ? void 0 : _b.version) || "1.0.0"}/`);
        fs_1.default.writeFileSync(this.getFilePath(), JSON.stringify(deployments));
    }
    updateLiveDeployments(liveDeployments) {
        if (liveDeployments instanceof Array)
            liveDeployments = [liveDeployments];
        this.liveDeployments = liveDeployments;
        this.save();
    }
    async deploy(...args) {
        return await this.execute("deploy", args);
    }
    async setup(...args) {
        return await this.execute("setup", args);
    }
    async execute(method, args) {
        let params = Object.assign(Object.assign({}, args), { debugLog: helpers_1.debugLog, log: helpers_1.log, eventEmitter: this.emitter, deploy: this });
        (0, helpers_1.debugLog)("executing method " + method + " on " + this.key);
        switch (method) {
            case "deploy":
                let deployResult = await this.deploymentScript.deploy(params);
                this.hasDeployedAll = true;
                return deployResult;
            case "setup":
                let setupResult = await this.deploymentScript.setup(params);
                this.hasSetupDeployments = true;
                return setupResult;
            default:
                throw new Error("unknown method:" + this.execute);
        }
    }
}
exports.InfinityMintDeployment = InfinityMintDeployment;
/**
 * Returns a list of InfinityMintDeployment classes for the network and project.
 * @returns
 */
const getDeployments = (project, network, root) => {
    return new Promise((resolve, reject) => {
        let filePath = (root || process.cwd() + "/") + "deploy/**/*.ts";
        (0, helpers_1.debugLog)("finding deployment scripts in: " + filePath);
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
                return new InfinityMintDeployment(match, key, network, project);
            }));
        });
    });
};
exports.getDeployments = getDeployments;
//# sourceMappingURL=deployments.js.map