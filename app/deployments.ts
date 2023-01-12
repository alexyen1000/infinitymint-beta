import events, {EventEmitter} from 'events';
import {
	InfinityMintDeploymentScript,
	InfinityMintDeploymentParameters,
	InfinityMintDeploymentLive,
	InfinityMintProject,
	InfinityMintDeploymentLocal,
	InfinityMintEventKeys,
	InfinityMintCompiledProject,
	InfinityMintDeployedProject,
	InfinityMintEventEmitter,
	KeyValue,
} from './interfaces';
import {
	debugLog,
	findFiles,
	isEnvTrue,
	isInfinityMint,
	isTypescript,
	log,
	readSession,
	warning,
} from './helpers';
import {
	requireProject,
	getCompiledProject,
	getProject,
	hasCompiledProject,
	hasTempCompiledProject,
	getTempCompiledProject,
	hasTempDeployedProject,
	getTempDeployedProject,
} from './projects';
import {glob} from 'glob';
import fs from 'fs';
import path from 'path';
import {
	getContract,
	getDefaultSigner,
	getNetworkSettings,
	logTransaction,
} from './web3';
import {Contract} from '@ethersproject/contracts';
import hre from 'hardhat';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import InfinityConsole from './console';

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

	/**
	 * might be available
	 */
	private console?: InfinityConsole;

	constructor(
		deploymentScriptLocation: string,
		key: string,
		network: string,
		project: InfinityMintProject,
		console?: InfinityConsole,
	) {
		this.emitter = console?.getEventEmitter() || new events.EventEmitter();
		this.deploymentScriptLocation = deploymentScriptLocation;
		this.key = key;

		if (fs.existsSync(this.deploymentScriptLocation)) this.reloadScript();
		else
			debugLog(`\tdeploy script for [${this.key}]<${this.project}> not found`);

		if (this.deploymentScript.key !== this.key)
			throw new Error(
				'key mismatch: ' +
					this.deploymentScript.key +
					' in ' +
					deploymentScriptLocation +
					'should equal ' +
					this.key,
			);

		this.network = network;
		this.project = project;
		this.liveDeployments = [];
		this.console = console;

		if (fs.existsSync(this.getFilePath())) {
			this.liveDeployments = this.getDeployments();
			this.hasDeployedAll = this.liveDeployments.length !== 0;
			this.hasSetupDeployments =
				this.liveDeployments.filter(deployment => deployment.setup).length ===
				0;

			debugLog(`previous deployment for [${this.key}]<${this.project}> exists`);
		}
	}

	/**
	 * reloads the source file script
	 */
	reloadScript() {
		let location = this.deploymentScriptLocation;
		if (require.cache[location]) {
			debugLog('\tdeleting old cache of ' + location);
			delete require.cache[location];
			debugLog(`\treloading <${location}>`);
		} else debugLog(`\tloading <${location}>`);

		let requirement = require(location);
		this.deploymentScript = requirement.default || requirement;
		if (this.deploymentScript.key === undefined)
			this.deploymentScript.key = this.key;
	}

	/**
	 * Adds the listener function to the end of the listeners array for the event named eventName. No checks are made to see if the listener has already been added. Multiple  calls passing the same combination of eventNameand listener will result in the listener being added, and called, multiple times.
	 *
	 * Returns a reference to the EventEmitter, so that calls can be chained.
	 * @param event
	 * @param callback
	 * @returns
	 */
	on(event: InfinityMintEventKeys, callback: (...args: any[]) => void) {
		return this.emitter.on(event, callback);
	}

	/**
	 *
	 * @param event
	 * @param callback
	 * @returns
	 */
	off(event: InfinityMintEventKeys, callback: (...args: any[]) => void) {
		return this.emitter.off(event, callback);
	}

	getIndex() {
		return this.deploymentScript.index || 10;
	}

	getsolidityFolder() {
		return this.deploymentScript.solidityFolder || 'alpha';
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
				this.project.version?.version || '1.0.0'
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
				encoding: 'utf-8',
			}),
		);

		if (
			(result.project && result.project !== this.project) ||
			(result.network && result.network !== this.network)
		)
			throw new Error(
				'bad file: ' + this.getFilePath() + ' is from another network/project',
			);

		return result;
	}

	getDeploymentByArtifactName(name: string) {
		return this.liveDeployments.filter(deployment => (deployment.name = name));
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
		return this.deploymentScript?.important;
	}

	isUnique() {
		return this.deploymentScript?.unique;
	}

	hasDeployed() {
		return this.hasDeployedAll;
	}

	hasSetup() {
		return this.hasSetupDeployments;
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
						this.project.version?.version || '1.0.0'
					}/`,
			)
		)
			fs.mkdirSync(
				process.cwd() +
					`/temp/deployments/${this.project.name}@${
						this.project.version?.version || '1.0.0'
					}/`,
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
	async getSignedContract(index?: number, signer?: SignerWithAddress) {
		let contract = this.getContract(index);
		signer = signer || (await getDefaultSigner());
		return contract.connect(signer);
	}

	/**
	 * used after deploy to set the the live deployments for this deployment. See {@link app/interfaces.InfinityMintDeploymentLive}, Will check if each member has the same network and project name as the one this deployment class is attached too
	 * @param liveDeployments
	 */
	public updateLiveDeployments(
		liveDeployments: InfinityMintDeploymentLive | InfinityMintDeploymentLive[],
	) {
		if (liveDeployments instanceof Array)
			(liveDeployments as InfinityMintDeploymentLive[]) = [...liveDeployments];

		let mismatchNetworkAndProject = liveDeployments.filter(
			(deployment: InfinityMintDeploymentLive) =>
				deployment.network.name !== this.network ||
				deployment.project !== this.project.name,
		) as InfinityMintDeploymentLive[];

		//throw error if we found any
		if (mismatchNetworkAndProject.length !== 0)
			throw new Error(
				'one or more deployments are from a different network or project, check: ' +
					mismatchNetworkAndProject.map(
						deployment => `<${deployment.key}>(${deployment.name}), `,
					),
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
			'/deployments/' +
			this.network +
			'/' +
			deployment.name +
			'.json';

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
			'/deployments/' +
			this.network +
			'/' +
			deployment.name +
			'.json';

		if (!fs.existsSync(path))
			throw new Error('local deployment not found: ' + path);

		return JSON.parse(
			fs.readFileSync(path, {
				encoding: 'utf-8',
			}),
		) as InfinityMintDeploymentLocal;
	}

	public getDeploymentScript() {
		return this.deploymentScript;
	}

	public getDeploymentScriptLocation() {
		return this.deploymentScriptLocation;
	}

	/**
	 * Deploys this ssmart contract
	 * @param args
	 * @returns
	 */
	async deploy(...args: any) {
		this.reloadScript();
		let result = await this.execute('deploy', args);

		let contracts: Contract[];
		if (!(result instanceof Array)) contracts = [result] as Contract[];
		else contracts = result as Contract[];

		let session = readSession();

		contracts.forEach(contract => {
			if (!session.environment?.deployments[contract.address])
				throw new Error(
					'contract ' + contract.address + ' is not in the .session file',
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
		deployment.name = deployment.contractName;
		deployment.deploymentScript = this.deploymentScriptLocation;
		return deployment as any;
	}

	async setPermissions(addresses: string[], log: boolean) {
		let contract = await this.getSignedContract();
		let authenticator = contract;

		if (!authenticator?.multiApprove) {
			if (isEnvTrue('THROW_ALL_ERRORS'))
				throw new Error(`${this.key} does not have an approve method`);
			else warning(`${this.key} does not have an approve method`);

			return;
		}
		let tx = await authenticator.multiApprove(addresses);

		if (logTransaction)
			await logTransaction(
				tx,
				`setting ${addresses} permissions inside of ${this.key}`,
			);
	}

	async setup(...args: any) {
		this.reloadScript();
		await this.execute('setup', args);
		this.hasSetupDeployments = true;
	}

	/**
	 * Executes a method on the deploy script and immediately returns the value. Setup will return ethers contracts.
	 * @param method
	 * @param args
	 * @returns
	 */
	async execute(
		method: 'setup' | 'deploy' | 'update' | 'switch' | 'cleanup',
		args: KeyValue,
		eventEmitter?: InfinityMintEventEmitter,
	) {
		let params = {
			...args,
			debugLog: debugLog,
			log: log,
			infinityConsole: null,
			eventEmitter: eventEmitter || this.emitter,
			deploy: this,
		} as InfinityMintDeploymentParameters;

		debugLog('executing method ' + method + ' on ' + this.key);

		switch (method) {
			case 'deploy':
				if (this.deploymentScript.deploy)
					return await this.deploymentScript.deploy(params);
			case 'setup':
				if (this.deploymentScript.setup)
					await this.deploymentScript.setup(params);
				return;
			case 'update':
				if (this.deploymentScript.update)
					await this.deploymentScript.update(params);
				return;
			case 'cleanup':
				if (this.deploymentScript.cleanup)
					return await this.deploymentScript.cleanup(params);
				return;
			case 'switch':
				if (this.deploymentScript.switch)
					await this.deploymentScript.switch(params);
				return;
			default:
				throw new Error('unknown method:' + this.execute);
		}
	}
}

/**
 *
 * @param project
 * @returns
 */
export const loadDeploymentClasses = async (
	project: InfinityMintDeployedProject | InfinityMintCompiledProject,
	console?: InfinityConsole,
) => {
	let deployments = [...(await getDeploymentClasses(project, console))];

	if (!isInfinityMint() && isEnvTrue('INFINITYMINT_INCLUDE_DEPLOY'))
		deployments = [
			...deployments,
			...(await getDeploymentClasses(
				project,
				console,
				process.cwd() + '/node_modules/infinitymint/',
			)),
		];

	return deployments;
};

/**
 * Returns a list of deployment classes relating to a project in order to deploy it ready to be steped through
 * @param projectOrPath
 * @param loadedDeploymentClasses
 * @returns
 */
export const getProjectDeploymentClasses = async (
	projectOrPath: string | InfinityMintCompiledProject,
	console?: InfinityConsole,
	loadedDeploymentClasses?: InfinityMintDeployment[],
) => {
	let compiledProject: InfinityMintCompiledProject;
	if (typeof projectOrPath === 'string') {
		let project = getProject(projectOrPath);

		if (hasTempDeployedProject(project))
			compiledProject = getTempDeployedProject(project);
		else if (hasCompiledProject(project))
			compiledProject = getCompiledProject(project);
		else
			throw new Error(
				'no valid project found to get deployment classes for: ' +
					projectOrPath,
			);
	} else compiledProject = projectOrPath;

	loadedDeploymentClasses =
		loadedDeploymentClasses ||
		(await loadDeploymentClasses(compiledProject, console));

	let setings = getNetworkSettings(compiledProject.network.name);

	if (!compiledProject.compiled)
		throw new Error(
			'please compile ' + compiledProject.name + ' before launching it',
		);

	let moduleDeployments = loadedDeploymentClasses.filter(
		deployment =>
			Object.keys(compiledProject.modules).filter(
				key =>
					key === deployment.getModule() &&
					compiledProject.modules[key] === deployment.getContractName(),
			).length !== 0,
	);

	let otherDeployments = loadedDeploymentClasses.filter(
		deployment =>
			moduleDeployments.filter(
				thatDeployment =>
					deployment.getContractName() === thatDeployment.getContractName(),
			).length !== 0 &&
			[
				...(setings?.disabledContracts || []),
				...(compiledProject.settings?.disabledContracts || ([] as any)),
			].filter(
				value =>
					value === deployment.getContractName() ||
					value === deployment.getKey(),
			).length === 0,
	);

	let deployments = [...moduleDeployments, ...otherDeployments];

	//now we need to sort the deployments ranked on their index, then put libraries first, then put important first
	deployments = deployments.sort((a, b) =>
		a.isLibrary() || a.isImportant()
			? deployments.length
			: a.getIndex() - b.getIndex(),
	);

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
		process.cwd() + '/deployments/' + network + '/' + contractName + '.json';

	if (!fs.existsSync(path)) throw new Error(`${path} not found`);
	return JSON.parse(
		fs.readFileSync(path, {encoding: 'utf-8'}),
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
	project: InfinityMintDeployedProject | InfinityMintCompiledProject,
	network?: string,
) => {
	network = network || project?.network?.name;

	if (!network) throw new Error('unable to automatically determain network');

	let path =
		process.cwd() +
		`/temp/deployments/${project.name}@${
			project.version?.version || '1.0.0'
		}/${contractName}_${network}.json`;
	return fs.existsSync(path);
};

export const getDeploymentClass = (
	contractName: string,
	project: InfinityMintDeployedProject,
	network?: string,
) => {
	network = network || project?.network?.name;

	if (!network) throw new Error('unable to automatically determin network');

	let liveDeployments = getLiveDeployments(contractName, project, network);
	return create(liveDeployments[0]);
};

export const getLiveDeployments = (
	contractName: string,
	project: InfinityMintCompiledProject | InfinityMintDeployedProject,
	network: string,
) => {
	let path =
		process.cwd() +
		`/temp/deployments/${project.name}@${
			project.version?.version || '1.0.0'
		}/${contractName}_${network}.json`;

	if (!hasDeploymentManifest(contractName, project, network))
		throw new Error('missing deployment manifest: ' + path);

	let result = JSON.parse(
		fs.readFileSync(path, {
			encoding: 'utf-8',
		}),
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
	deploymentScript?: string,
) => {
	let project = requireProject(
		liveDeployment.project,
		liveDeployment.javascript,
	);
	return new InfinityMintDeployment(
		deploymentScript || liveDeployment.deploymentScript,
		liveDeployment.key,
		liveDeployment.network.name,
		project,
	);
};

/**
 * Returns a list of InfinityMintDeployment classes for the network and project based on the deployment typescripts which are found.
 * @returns
 */
export const getDeploymentClasses = async (
	project: InfinityMintDeployedProject | InfinityMintCompiledProject,
	console?: InfinityConsole,
	network?: string,
	roots?: string[],
): Promise<InfinityMintDeployment[]> => {
	network = network || project.network?.name;

	let session = readSession();
	if (!network) throw new Error('unable to automatically determain network');

	let searchLocations = [...(roots || [])];
	searchLocations.push(process.cwd() + '/deploy/**/*.js');
	if (isTypescript()) searchLocations.push(process.cwd() + '/deploy/**/*.ts');
	if (!isInfinityMint() && isEnvTrue('INFINITYMINT_INCLUDE_DEPLOY'))
		searchLocations.push(
			process.cwd() + '/node_modules/infinitymint/dist/deploy/**/*.js',
		);

	let deployments = [];
	for (let i = 0; i < searchLocations.length; i++) {
		debugLog('scanning for deployment scripts in => ' + searchLocations[i]);
		let files = await findFiles(searchLocations[i]);
		files.map((file, index) => {
			let key = path.parse(file).name;
			debugLog(`[${index}] => ${key}`);
			let result = new InfinityMintDeployment(
				file,
				key,
				network,
				project,
				console,
			);

			if (
				result.getDeploymentScript()?.solidityFolder !==
				session.environment.solidityFolder
			)
				debugLog(
					'\tskipping (since wrong solidity folder) => ' + searchLocations[i],
				);
			else deployments.push(result);
		});
	}

	return deployments;
};
