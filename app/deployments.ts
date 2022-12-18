import events, { EventEmitter } from "events";
import {
	InfinityMintDeploymentScript,
	InfinityMintDeploymentParameters,
} from "./interfaces";
import { debugLog, log } from "./helpers";
import { glob } from "glob";
import path from "path";

export class DeploymentScript {
	protected emitter: EventEmitter;
	protected source: InfinityMintDeploymentScript;
	protected sourceFile: string;
	protected key: string;

	constructor(sourceFile: string, key: string) {
		this.emitter = new events.EventEmitter();
		this.source = require("./../" + sourceFile)
			.default as InfinityMintDeploymentScript;
		this.sourceFile = sourceFile;
		this.key = key;
	}

	/**
	 * reloads the source file script
	 */
	reload() {
		this.source = require("./../" + this.sourceFile)
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

/**
 * Returns a list of all the deployment scripts
 * @returns
 */
export const getDeploymentScripts = (
	root?: string
): Promise<DeploymentScript[]> => {
	debugLog("finding deployment scripts in: " + root);
	return new Promise((resolve, reject) => {
		let filePath = (root || "./") + "deploy/**/*.ts";
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

					return new DeploymentScript(match, key);
				})
			);
		});
	});
};
