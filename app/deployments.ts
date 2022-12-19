import events, { EventEmitter } from "events";
import {
	InfinityMintDeploymentScript,
	InfinityMintDeploymentParameters,
	InfinityMintDeploymentLive,
	InfinityMintProject,
} from "./interfaces";
import { debugLog, log } from "./helpers";
import { glob } from "glob";
import fs from "fs";
import path from "path";

/**
 * Deployment class for InfinityMint deployments
 */
export class InfinityMintDeployment {
	/**
	 * node even emitter
	 */
	protected emitter: EventEmitter;
	/**
	 * the infinity mint deployment script
	 */
	protected deploymentScript: InfinityMintDeploymentScript;
	/**
	 * the live infinity mint deployment interface containing the abi, address, deployer approved and more, See {@link @app/interfaces.InfinityMintDeploymentLive}
	 */
	protected liveDeployments: InfinityMintDeploymentLive[];
	/**
	 * the location of the deployment script which determains its behaviur
	 */
	protected deploymentScriptLocation: string;
	/**
	 * the key of this deployment
	 */
	protected key: string;
	/**
	 * the infinity mint project this deployment is attached too
	 */
	protected project: InfinityMintProject;
	/**
	 * the network the deployment is on
	 */
	protected network: string;
	/**
	 * returns true if the deployment has been deployed to a blockchain
	 */
	protected hasDeployedAll: boolean;
	/**
	 * returns true if the deployment has been set up
	 */
	protected hasSetupDeployments: boolean;

	constructor(
		deploymentScriptLocation: string,
		key: string,
		network: string,
		project: InfinityMintProject
	) {
		this.emitter = new events.EventEmitter();
		this.deploymentScript = require(process.cwd() +
			"/deploy/" +
			deploymentScriptLocation).default as InfinityMintDeploymentScript;
		this.deploymentScriptLocation = deploymentScriptLocation;
		this.key = key;

		if (this.deploymentScript.key !== this.key)
			throw new Error(
				"key mismatch: " +
					this.deploymentScript.key +
					" in " +
					deploymentScriptLocation +
					"should equal " +
					this.key
			);

		this.network = network;
		this.project = project;
		this.liveDeployments = [];

		if (fs.existsSync(this.getFilePath())) {
			this.liveDeployments = this.getDeployments();
			this.hasDeployedAll = this.liveDeployments.length !== 0;
			this.hasSetupDeployments =
				this.liveDeployments.filter((deployment) => deployment.setup)
					.length === 0;

			debugLog(
				`previous deployment for [${this.key}]<${this.project}> exists`
			);
		}
	}

	/**
	 * reloads the source file script
	 */
	reload() {
		this.deploymentScript = require("./../" + this.deploymentScriptLocation)
			.default as InfinityMintDeploymentScript;
	}

	/**
	 * Adds the listener function to the end of the listeners array for the event named eventName. No checks are made to see if the listener has already been added. Multiple  calls passing the same combination of eventNameand listener will result in the listener being added, and called, multiple times.
	 *
	 * Returns a reference to the EventEmitter, so that calls can be chained.
	 * @param event
	 * @param callback
	 * @returns
	 */
	on(event: string, callback: (...args: any[]) => void) {
		return this.emitter.on(event, callback);
	}

	/**
	 *
	 * @param event
	 * @param callback
	 * @returns
	 */
	off(event: string, callback: (...args: any[]) => void) {
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
		return (
			process.cwd() +
			`/temp/deployments/${this.project.name}@${
				this.project.version?.version || "1.0.0"
			}/${this.key}_${this.network}.json`
		);
	}

	private read() {
		if (!fs.existsSync(this.getFilePath()))
			return {
				liveDeployments: {},
			};
		let result = JSON.parse(
			fs.readFileSync(this.getFilePath(), {
				encoding: "utf-8",
			})
		);

		if (
			(result.project !== undefined && result.project !== this.project) ||
			(result.network !== undefined && result.network !== this.network)
		)
			throw new Error(
				"bad file: " +
					this.getFilePath() +
					" is from another network/project"
			);

		return result;
	}

	getDeploymentByArtifactName(name: string) {
		return this.liveDeployments.filter(
			(deployment) => (deployment.name = name)
		);
	}

	getDeployer(index?: number) {
		return this.liveDeployments[index || 0].deployer;
	}

	getApproved(index?: number) {
		return this.liveDeployments[index || 0].approved;
	}

	getAddress(index?: number) {
		return this.liveDeployments[index || 0].address;
	}

	isLibrary() {
		return this.deploymentScript.library;
	}

	getAbi(index?: number) {
		return this.liveDeployments[index || 0].abi;
	}

	getDeployments() {
		let deployments = this.read();
		return deployments.liveDeployments as InfinityMintDeploymentLive[];
	}

	hasDeployed() {
		return this.hasDeployedAll === true;
	}

	hasSetup() {
		return this.hasSetupDeployments === true;
	}

	save() {
		let deployments = this.read();
		deployments.liveDeployments = this.liveDeployments;
		deployments.updated = Date.now();
		deployments.network = this.network;
		deployments.project = this.project.name;
		deployments.setup = this.hasSetupDeployments;

		//make the directory
		if (
			!fs.existsSync(
				process.cwd() +
					`/temp/deployments/${this.project.name}@${
						this.project.version?.version || "1.0.0"
					}/`
			)
		)
			fs.mkdirSync(
				process.cwd() +
					`/temp/deployments/${this.project.name}@${
						this.project.version?.version || "1.0.0"
					}/`
			);

		fs.writeFileSync(this.getFilePath(), JSON.stringify(deployments));
	}

	updateLiveDeployments(
		liveDeployments:
			| InfinityMintDeploymentLive
			| InfinityMintDeploymentLive[]
	) {
		if (liveDeployments instanceof Array)
			liveDeployments = [liveDeployments];

		this.liveDeployments = liveDeployments as InfinityMintDeploymentLive[];
		this.save();
	}

	async deploy(...args: any) {
		return await this.execute("deploy", args);
	}

	async setup(...args: any) {
		return await this.execute("setup", args);
	}

	async execute(method: string, args: any) {
		let params = {
			...args,
			debugLog: debugLog,
			log: log,
			eventEmitter: this.emitter,
			deploy: this,
		} as InfinityMintDeploymentParameters;

		debugLog("executing method " + method + " on " + this.key);

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

/**
 * Returns a list of InfinityMintDeployment classes for the network and project.
 * @returns
 */
export const getDeployments = (
	project: InfinityMintProject,
	network: string,
	root?: string
): Promise<InfinityMintDeployment[]> => {
	return new Promise((resolve, reject) => {
		let filePath = (root || process.cwd() + "/") + "deploy/**/*.ts";
		debugLog("finding deployment scripts in: " + filePath);
		glob(filePath, (err: Error | null, matches: any[]) => {
			if (err) throw err;

			debugLog(
				"found " +
					matches.length +
					" deployment scripts in: " +
					filePath
			);
			resolve(
				matches.map((match, index) => {
					let key = path.parse(match).name;
					debugLog(`[${index}] => ${key}:(${match})`);

					return new InfinityMintDeployment(
						match,
						key,
						network,
						project
					);
				})
			);
		});
	});
};
