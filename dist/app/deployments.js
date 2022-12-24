"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeploymentClasses = exports.create = exports.getLiveDeployments = exports.getDeploymentClass = exports.hasDeploymentManifest = exports.readNetworkDeployment = exports.getNetworkDeployment = exports.InfinityMintDeployment = void 0;
const events_1 = __importDefault(require("events"));
const helpers_1 = require("./helpers");
const glob_1 = require("glob");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const web3_1 = require("./web3");
/**
 * Deployment class for InfinityMint deployments
 */
class InfinityMintDeployment {
    constructor(deploymentScriptLocation, key, network, project) {
        this.emitter = new events_1.default.EventEmitter();
        if (fs_1.default.existsSync(process.cwd() + "/deploy/" + deploymentScriptLocation))
            this.deploymentScript = require(process.cwd() +
                "/deploy/" +
                deploymentScriptLocation)
                .default;
        else
            (0, helpers_1.debugLog)(`deploy script for [${this.key}]<${this.project}> not found`);
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
    getsolidityFolder() {
        return this.deploymentScript.solidityFolder || "alpha";
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
    isImportant() {
        var _a;
        return ((_a = this.deploymentScript) === null || _a === void 0 ? void 0 : _a.important) === true;
    }
    isUnique() {
        var _a;
        return ((_a = this.deploymentScript) === null || _a === void 0 ? void 0 : _a.unique) === true;
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
    /**
     * Returns an ethers contract instance of this deployment for you to call methods on the smart contract
     * @param index
     * @returns
     */
    getContract(index) {
        return (0, web3_1.getContract)(this.liveDeployments[index || 0]);
    }
    /**
     * used after deploy to set the the live deployments for this deployment. See {@link app/interfaces.InfinityMintDeploymentLive}, Will check if each member has the same network and project name as the one this deployment class is attached too
     * @param liveDeployments
     */
    updateLiveDeployments(liveDeployments) {
        if (liveDeployments instanceof Array)
            liveDeployments = [liveDeployments];
        let mismatchNetworkAndProject = liveDeployments.filter((deployment) => deployment.network.name !== this.network ||
            deployment.project !== this.project.name);
        //throw error if we found any
        if (mismatchNetworkAndProject.length !== 0)
            throw new Error("one or more deployments are from a different network or project, check: " +
                mismatchNetworkAndProject.map((deployment) => `<${deployment.key}>(${deployment.name}), `));
        this.liveDeployments = liveDeployments;
        this.save();
    }
    /**
     * returns true if we have a local deployment for this current network
     * @param index
     * @returns
     */
    hasLocalDeployment(index) {
        let deployment = this.liveDeployments[index || 0];
        let path = process.cwd() +
            "/deployments/" +
            this.network +
            "/" +
            deployment.name +
            ".json";
        return fs_1.default.existsSync(path);
    }
    /**
     * gets a deployment inside of the current /deployments/ folder
     * @param index
     * @returns
     */
    getLocalDeployment(index) {
        let deployment = this.liveDeployments[index || 0];
        let path = process.cwd() +
            "/deployments/" +
            this.network +
            "/" +
            deployment.name +
            ".json";
        if (!fs_1.default.existsSync(path))
            throw new Error("local deployment not found: " + path);
        return JSON.parse(fs_1.default.readFileSync(path, {
            encoding: "utf-8",
        }));
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
 * gets a deployment in the /deployments/network/ folder and turns it into an InfinityMintDeploymentLive
 */
const getNetworkDeployment = (contractName, network) => {
    return (0, exports.readNetworkDeployment)(contractName, network);
};
exports.getNetworkDeployment = getNetworkDeployment;
/**
 * Returns the raw .json file in the /deployments/network/ folder
 * @param contractName
 * @returns
 */
const readNetworkDeployment = (contractName, network) => {
    let path = process.cwd() +
        "/deployments/" +
        network +
        "/" +
        contractName +
        ".json";
    if (!fs_1.default.existsSync(path))
        throw new Error(`${path} not found`);
    return JSON.parse(fs_1.default.readFileSync(path, { encoding: "utf-8" }));
};
exports.readNetworkDeployment = readNetworkDeployment;
/**
 * Returns true if a deployment manifest for this key/contractName is found
 * @param contractName - can be a key (erc721, assets) or a fully qualified contract name
 * @param project
 * @param network
 * @returns
 */
const hasDeploymentManifest = (contractName, project, network) => {
    var _a, _b;
    network = network || ((_a = project === null || project === void 0 ? void 0 : project.network) === null || _a === void 0 ? void 0 : _a.name);
    if (network === undefined)
        throw new Error("unable to automatically determain network");
    let path = process.cwd() +
        `/temp/deployments/${project.name}@${((_b = project.version) === null || _b === void 0 ? void 0 : _b.version) || "1.0.0"}/${contractName}_${network}.json`;
    return fs_1.default.existsSync(path);
};
exports.hasDeploymentManifest = hasDeploymentManifest;
const getDeploymentClass = (contractName, project, network) => {
    var _a;
    network = network || ((_a = project === null || project === void 0 ? void 0 : project.network) === null || _a === void 0 ? void 0 : _a.name);
    if (network === undefined)
        throw new Error("unable to automatically determin network");
    let liveDeployments = (0, exports.getLiveDeployments)(contractName, project, network);
    return (0, exports.create)(liveDeployments[0]);
};
exports.getDeploymentClass = getDeploymentClass;
const getLiveDeployments = (contractName, project, network) => {
    var _a;
    let path = process.cwd() +
        `/temp/deployments/${project.name}@${((_a = project.version) === null || _a === void 0 ? void 0 : _a.version) || "1.0.0"}/${contractName}_${network}.json`;
    if (!(0, exports.hasDeploymentManifest)(contractName, project, network))
        throw new Error("missing deployment manifest: " + path);
    let result = JSON.parse(fs_1.default.readFileSync(path, {
        encoding: "utf-8",
    }));
    return (result.liveDeployments || []);
};
exports.getLiveDeployments = getLiveDeployments;
/**
 * Returns a new deployment class from a live deployment file
 * @param liveDeployment
 * @returns
 */
const create = (liveDeployment, deploymentScript) => {
    let project = (0, helpers_1.getProject)(liveDeployment.project, liveDeployment.javascript);
    return new InfinityMintDeployment(deploymentScript || liveDeployment.deploymentScript, liveDeployment.key, liveDeployment.network.name, project);
};
exports.create = create;
/**
 * Returns a list of InfinityMintDeployment classes for the network and project based on the deployment typescripts which are found.
 * @returns
 */
const getDeploymentClasses = (project, network, root) => {
    return new Promise((resolve, reject) => {
        var _a;
        network = network || ((_a = project.network) === null || _a === void 0 ? void 0 : _a.name);
        if (network === undefined)
            throw new Error("unable to automatically determain network");
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
exports.getDeploymentClasses = getDeploymentClasses;
//# sourceMappingURL=deployments.js.map