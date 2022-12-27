import events, { EventEmitter } from "events";
import {
	InfinityMintDeploymentScript,
	InfinityMintDeploymentParameters,
	InfinityMintDeploymentLive,
	InfinityMintProject,
	InfinityMintDeploymentLocal,
} from "./interfaces";
import {
	debugLog,
	getCompiledProject,
	getFileImportExtension,
	getProject,
	initializeGanacheMnemonic,
	isEnvTrue,
	isInfinityMint,
	log,
	readSession,
	warning,
} from "./helpers";
import { glob } from "glob";
import fs from "fs";
import path from "path";
import {
	getContract,
	getDefaultSigner,
	getNetworkSettings,
	logTransaction,
} from "./web3";
import { Contract } from "@ethersproject/contracts";
import hre from "hardhat";

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
	 * the live infinity mint deployment interface containing the abi, address, deployer approved and more, See {@link app/interfaces.InfinityMintDeploymentLive}
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

		if (
			fs.existsSync(process.cwd() + "/deploy/" + deploymentScriptLocation)
		)
			this.reloadScript();
		else
			debugLog(
				`deploy script for [${this.key}]<${this.project}> not found`
			);

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
	async reloadScript() {
		let location = process.cwd() + this.deploymentScriptLocation;
		if (require.cache[location] !== undefined) {
			debugLog("deleting old cache of " + location);
			delete require.cache[location];
			debugLog(`reloading <${location}>`);
		} else debugLog(`loading <${location}>`);

		let requirement = require(location);
		this.deploymentScript = requirement.default || requirement;
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

	getsolidityFolder() {
		return this.deploymentScript.solidityFolder || "alpha";
	}

	getKey() {
		return this.key;
	}

	getModule() {
		return this.deploymentScript.module;
	}

	getContractName(index?: 0) {
		return this.liveDeployments.length !== 0
			? this.liveDeployments[index].name
			: this.deploymentScript.contract;
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

	isImportant() {
		return this.deploymentScript?.important === true;
	}

	isUnique() {
		return this.deploymentScript?.unique === true;
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

	/**
	 * Returns an ethers contract instance of this deployment for you to connect signers too.
	 * @param index
	 * @returns
	 */
	getContract(index?: number) {
		return getContract(this.liveDeployments[index || 0]);
	}

	/**
	 * Returns a signed contract with the current account.
	 * @param index
	 * @returns
	 */
	async getSignedContract(index?: number) {
		let contract = this.getContract(index);
		let signer = await getDefaultSigner();
		return contract.connect(signer);
	}

	/**
	 * used after deploy to set the the live deployments for this deployment. See {@link app/interfaces.InfinityMintDeploymentLive}, Will check if each member has the same network and project name as the one this deployment class is attached too
	 * @param liveDeployments
	 */
	public updateLiveDeployments(
		liveDeployments:
			| InfinityMintDeploymentLive
			| InfinityMintDeploymentLive[]
	) {
		if (liveDeployments instanceof Array)
			liveDeployments = [liveDeployments];

		let mismatchNetworkAndProject = liveDeployments.filter(
			(deployment: InfinityMintDeploymentLive) =>
				deployment.network.name !== this.network ||
				deployment.project !== this.project.name
		) as InfinityMintDeploymentLive[];

		//throw error if we found any
		if (mismatchNetworkAndProject.length !== 0)
			throw new Error(
				"one or more deployments are from a different network or project, check: " +
					mismatchNetworkAndProject.map(
						(deployment) =>
							`<${deployment.key}>(${deployment.name}), `
					)
			);

		this.liveDeployments = liveDeployments as InfinityMintDeploymentLive[];
		this.save();
	}

	/**
	 * returns true if we have a local deployment for this current network
	 * @param index
	 * @returns
	 */
	hasLocalDeployment(index?: number) {
		let deployment = this.liveDeployments[index || 0];
		let path =
			process.cwd() +
			"/deployments/" +
			this.network +
			"/" +
			deployment.name +
			".json";

		return fs.existsSync(path);
	}

	/**
	 * gets a deployment inside of the current /deployments/ folder
	 * @param index
	 * @returns
	 */
	getLocalDeployment(index?: number) {
		let deployment = this.liveDeployments[index || 0];
		let path =
			process.cwd() +
			"/deployments/" +
			this.network +
			"/" +
			deployment.name +
			".json";

		if (!fs.existsSync(path))
			throw new Error("local deployment not found: " + path);

		return JSON.parse(
			fs.readFileSync(path, {
				encoding: "utf-8",
			})
		) as InfinityMintDeploymentLocal;
	}

	async deploy(...args: any) {
		this.reloadScript();
		let result = await this.execute("deploy", args);

		let contracts: Contract[];
		if (result instanceof Array !== true)
			contracts = [result] as Contract[];
		else contracts = result as Contract[];

		let session = readSession();

		contracts.forEach((contract) => {
			if (
				session.environment?.deployments[contract.address] === undefined
			)
				throw new Error(
					"contract " +
						contract.address +
						" is not in the .session file"
				);

			let deployment = session.environment?.deployments[
				contract.address
			] as InfinityMintDeploymentLocal;
			this.liveDeployments.push(this.populateLiveDeployment(deployment));
		});

		this.save();
		return this.liveDeployments;
	}

	private populateLiveDeployment(deployment: InfinityMintDeploymentLocal) {
		deployment = deployment as InfinityMintDeploymentLive;
		deployment.key = this.deploymentScript.key;
		deployment.javascript = this.project.javascript;
		deployment.project = this.project.name;
		deployment.network = {
			name: hre.network.name,
			chainId: hre.network.config.chainId,
		};
		deployment.deploymentScript = this.deploymentScriptLocation;
		return deployment;
	}

	async setPermissions(addresses: string[], log: boolean) {
		let contract = await this.getSignedContract();
		let authenticator = contract;

		if (authenticator?.multiApprove === undefined) {
			if (isEnvTrue("THROW_ALL_ERRORS"))
				throw new Error(`${this.key} does not have an approve method`);
			else warning(`${this.key} does not have an approve method`);

			return;
		}
		let tx = await authenticator.multiApprove(addresses);

		if (logTransaction)
			await logTransaction(
				tx,
				`setting ${addresses} permissions inside of ${this.key}`
			);
	}

	async setup(...args: any) {
		this.reloadScript();
		await this.execute("setup", args);
		this.hasSetupDeployments = true;
	}

	/**
	 * Executes a method on the deploy script and immediately returns the value. Setup will return ethers contracts.
	 * @param method
	 * @param args
	 * @returns
	 */
	async execute(method: "setup" | "deploy" | "update" | "switch", args: any) {
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
				return deployResult;
			case "setup":
				await this.deploymentScript.setup(params);
				return;
			case "update":
				await this.deploymentScript.update(params);
				return;
			case "switch":
				await this.deploymentScript.switch(params);
				return;
			default:
				throw new Error("unknown method:" + this.execute);
		}
	}
}

/**
 *
 * @param project
 * @returns
 */
export const loadDeploymentClasses = async (project: InfinityMintProject) => {
	let deployments = [...(await getDeploymentClasses(project))];

	if (!isInfinityMint() && !isEnvTrue("INFINITYMINT_DONT_INCLUDE_DEPLOY"))
		deployments = [
			...deployments,
			...(await getDeploymentClasses(
				project,
				process.cwd() + "/node_modules/infinitymint/deploy/**/*.ts"
			)),
		];

	return deployments;
};

/**
 * Returns a list of deployment classes relating to a project in order to deploy it ready to be steped through
 * @param project
 * @param loadedDeploymentClasses
 * @returns
 */
export const getProjectDeploymentClasses = async (
	project: string,
	loadedDeploymentClasses?: InfinityMintDeployment[]
) => {
	let compiledProject: InfinityMintProject;
	if (typeof project === "string")
		compiledProject = getCompiledProject(project);
	else compiledProject = project;

	loadedDeploymentClasses =
		loadedDeploymentClasses ||
		(await loadDeploymentClasses(compiledProject));

	let setings = getNetworkSettings(hre.network.name);

	if (!compiledProject.compiled)
		throw new Error(
			"please compile " + compiledProject.name + " before launching it"
		);

	let moduleDeployments = loadedDeploymentClasses.filter(
		(deployment) =>
			Object.keys(compiledProject.modules).filter(
				(key) =>
					key === deployment.getModule() &&
					compiledProject.modules[key] ===
						deployment.getContractName()
			).length !== 0
	);

	let otherDeployments = loadedDeploymentClasses.filter(
		(deployment) =>
			moduleDeployments.filter(
				(thatDeployment) =>
					deployment.getContractName() ===
					thatDeployment.getContractName()
			).length !== 0 &&
			[
				...(setings?.disabledContracts || []),
				...(compiledProject?.settings?.disabledContracts || []),
			].filter(
				(value) =>
					value === deployment.getContractName() ||
					value === deployment.getKey()
			).length === 0
	);

	let deployments = [...moduleDeployments, ...otherDeployments];

	//now we need to sort the deployments ranked on their index, then put libraries first, then put important first
	deployments = deployments
		.sort((a, b) => a.getIndex() - b.getIndex())
		.sort((a, b) => (a.isLibrary() ? deployments.length : 0))
		.sort((a, b) => (a.isImportant() ? deployments.length : 0));

	return deployments;
};

/**
 * gets a deployment in the /deployments/network/ folder and turns it into an InfinityMintDeploymentLive
 */
export const getLocalDeployment = (contractName: string, network: string) => {
	return readLocalDeployment(contractName, network);
};

/**
 * Returns the raw .json file in the /deployments/network/ folder
 * @param contractName
 * @returns
 */
export const readLocalDeployment = (contractName: string, network: string) => {
	let path =
		process.cwd() +
		"/deployments/" +
		network +
		"/" +
		contractName +
		".json";

	if (!fs.existsSync(path)) throw new Error(`${path} not found`);
	return JSON.parse(
		fs.readFileSync(path, { encoding: "utf-8" })
	) as InfinityMintDeploymentLocal;
};

/**
 * Returns true if a deployment manifest for this key/contractName is found
 * @param contractName - can be a key (erc721, assets) or a fully qualified contract name
 * @param project
 * @param network
 * @returns
 */
export const hasDeploymentManifest = (
	contractName: string,
	project: InfinityMintProject,
	network?: string
) => {
	network = network || project?.network?.name;

	if (network === undefined)
		throw new Error("unable to automatically determain network");

	let path =
		process.cwd() +
		`/temp/deployments/${project.name}@${
			project.version?.version || "1.0.0"
		}/${contractName}_${network}.json`;
	return fs.existsSync(path);
};

export const getDeploymentClass = (
	contractName: string,
	project: InfinityMintProject,
	network?: string
) => {
	network = network || project?.network?.name;

	if (network === undefined)
		throw new Error("unable to automatically determin network");

	let liveDeployments = getLiveDeployments(contractName, project, network);
	return create(liveDeployments[0]);
};

export const getLiveDeployments = (
	contractName: string,
	project: InfinityMintProject,
	network: string
) => {
	let path =
		process.cwd() +
		`/temp/deployments/${project.name}@${
			project.version?.version || "1.0.0"
		}/${contractName}_${network}.json`;

	if (!hasDeploymentManifest(contractName, project, network))
		throw new Error("missing deployment manifest: " + path);

	let result = JSON.parse(
		fs.readFileSync(path, {
			encoding: "utf-8",
		})
	);
	return (result.liveDeployments || []) as InfinityMintDeploymentLive[];
};

/**
 * Returns a new deployment class from a live deployment file
 * @param liveDeployment
 * @returns
 */
export const create = (
	liveDeployment: InfinityMintDeploymentLive,
	deploymentScript?: string
) => {
	let project = getProject(liveDeployment.project, liveDeployment.javascript);
	return new InfinityMintDeployment(
		deploymentScript || liveDeployment.deploymentScript,
		liveDeployment.key,
		liveDeployment.network.name,
		project
	);
};

/**
 * Returns a list of InfinityMintDeployment classes for the network and project based on the deployment typescripts which are found.
 * @returns
 */
export const getDeploymentClasses = (
	project: InfinityMintProject,
	network?: string,
	root?: string
): Promise<InfinityMintDeployment[]> => {
	return new Promise((resolve, reject) => {
		network = network || project.network?.name;

		if (network === undefined)
			throw new Error("unable to automatically determain network");

		let filePath =
			(root || process.cwd() + "/") +
			"deploy/**/*." +
			getFileImportExtension();
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
