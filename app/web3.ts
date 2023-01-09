import hre, {ethers, artifacts} from 'hardhat';
import {
	debugLog,
	getConfigFile,
	isEnvTrue,
	log,
	readSession,
	logDirect,
	allowPiping,
	saveSession,
	getSolidityFolder,
	warning,
} from './helpers';
import {BaseContract} from 'ethers';
import fs from 'fs';
import {defaultFactory, PipeFactory} from './pipes';
import {
	Web3Provider,
	JsonRpcProvider,
	TransactionReceipt,
	Provider,
} from '@ethersproject/providers';
import GanacheServer from './ganache';
import {ContractFactory, ContractTransaction} from '@ethersproject/contracts';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {getLocalDeployment, create} from './deployments';
import {
	InfinityMintConfigSettingsNetwork,
	InfinityMintDeploymentLive,
	InfinityMintConsoleOptions,
	InfinityMintConfig,
	InfinityMintEventEmitter,
} from './interfaces';
import {EthereumProvider} from 'ganache';
import InfinityConsole from './console';
import {TelnetServer} from './telnet';

//stores listeners for the providers
const ProviderListeners = {} as any;

export const initializeInfinityMint = async (
	config?: InfinityMintConfig,
	startGanache?: boolean,
) => {
	config = config || getConfigFile();
	let session = readSession();
	//register current network pipes
	registerNetworkLogs();

	if (!fs.existsSync('./artifacts')) await hre.run('compile');

	//start ganache
	if (startGanache) {
		try {
			//ask if they want to start ganache
			//start ganache here
			let obj = {...config.ganache} as any;
			if (!obj.wallet) obj.wallet = {};
			if (!session.environment.ganacheMnemonic)
				throw new Error('no ganache mnemonic');

			obj.wallet.mnemonic = session.environment.ganacheMnemonic;
			saveSession(session);
			debugLog('starting ganache with menomic of: ' + obj.wallet.mnemonic);

			//get private keys and save them to file
			let keys = getPrivateKeys(session.environment.ganacheMnemonic);
			debugLog(
				'found ' +
					keys.length +
					' private keys for mnemonic: ' +
					session.environment.ganacheMnemonic,
			);
			keys.forEach((key, index) => {
				debugLog(`[${index}] => ${key}`);
			});
			session.environment.ganachePrivateKeys = keys;
			saveSession(session);

			let provider = await GanacheServer.start(config.ganache || {});
			startNetworkPipe(provider, 'ganache');
		} catch (error) {
			warning('could not start ganache: ' + error.stack);
		}
	} else {
		warning('no ganache network found');
	}

	//allow piping
	allowPiping();
	//
	logDirect('🪐 Starting InfinityConsole');

	try {
		//create IPFS node
	} catch (error) {
		warning(`could not start IPFS: ` + error?.message);
	}

	//start a network pipe if we aren't ganache as we do something different if we are
	if (!startGanache) startNetworkPipe();
	//initialize console
	return config;
};

//function to launch the console
export const startInfinityConsole = async (
	options?: InfinityMintConsoleOptions,
	pipeFactory?: PipeFactory,
	telnetServer?: TelnetServer,
	eventEmitter?: InfinityMintEventEmitter,
) => {
	debugLog(
		'starting InfinityConsole with solidity root of ' + getSolidityFolder(),
	);

	let infinityConsole = new InfinityConsole(
		options,
		pipeFactory,
		telnetServer,
		eventEmitter,
	);
	logDirect(
		'💭 Initializing InfinityConsole{cyan-fg}<' +
			infinityConsole.getSessionId() +
			'>{/cyan-fg}',
	);
	await infinityConsole.initialize();
	log(
		'{green-fg}{bold}InfinityMint Online{/green-fg}{/bold} => InfinityConsole<' +
			infinityConsole.getSessionId() +
			'>',
	);
	return infinityConsole;
};

export const getDefaultSigner = async () => {
	let defaultAccount = getDefaultAccountIndex();
	let signers = await ethers.getSigners();

	if (!signers[defaultAccount])
		throw new Error(
			'bad default account for network ' +
				hre.network.name +
				' index ' +
				defaultAccount +
				'does not exist',
		);

	return signers[defaultAccount];
};

/**
 *
 * @param artifactName
 * @param args
 * @returns
 */
export const deploy = async (
	artifactName: string,
	signer?: SignerWithAddress,
	args?: [],
	save?: boolean,
	logDeployment?: boolean,
	usePreviousDeployment?: boolean,
) => {
	signer = signer || (await getDefaultSigner());
	let artifact = await artifacts.readArtifact(artifactName);
	let fileName =
		process.cwd() +
		`/deployments/${hre.network.name}/${artifact.contractName}.json`;
	let buildInfo = await artifacts.getBuildInfo(artifactName);

	if (usePreviousDeployment && fs.existsSync(fileName)) {
		let deployment = JSON.parse(
			fs.readFileSync(fileName, {
				encoding: 'utf-8',
			}),
		);

		if (logDeployment)
			log(
				`🔖 using previous deployment at (${deployment.address}) for ${artifact.contractName}`,
			);

		let contract = await ethers.getContractAt(
			artifact.contractName,
			deployment.address,
			signer,
		);

		let session = readSession();

		if (!session.environment?.deployments[contract.address]) {
			if (!session.environment.deployments)
				session.environment.deployments = {};

			session.environment.deployments[contract.address] = {
				...artifact,
				...buildInfo,
				args: args,
				name: artifact.contractName,
				address: contract.address,
				transactionHash: contract.deployTransaction.hash,
				deployer: contract.deployTransaction.from,
				receipt: contract.deployTransaction,
			};
			debugLog(`saving deployment of ${artifact.contractName} to session`);
			saveSession(session);
		}

		return contract;
	}

	let factory = await ethers.getContractFactory(artifact.contractName, signer);
	let contract = await deployContract(factory, args);
	logTransaction(contract.deployTransaction);

	if (!save) return contract;

	let savedDeployment = {
		...artifact,
		...buildInfo,
		args: args,
		name: artifact.contractName,
		address: contract.address,
		transactionHash: contract.deployTransaction.hash,
		deployer: contract.deployTransaction.from,
		receipt: contract.deployTransaction,
	};

	let session = readSession();

	if (!session.environment?.deployments) session.environment.deployments = {};

	debugLog(`saving deployment to session`);
	session.environment.deployments[contract.address] = savedDeployment;
	saveSession(session);

	debugLog(`saving ${fileName}`);
	log(`⭐ deployed ${artifact.contractName} => [${contract.address}]`);

	if (!fs.existsSync(process.cwd() + '/deployments/' + hre.network.name + '/'))
		fs.mkdirSync(process.cwd() + '/deployments/' + hre.network.name + '/');

	fs.writeFileSync(fileName, JSON.stringify(savedDeployment, null, 2));
	return contract;
};

/**
 * Deploys a contract, takes an ethers factory. Does not save the deployment.
 * @param factory
 * @param args
 * @returns
 */
export const deployContract = async (factory: ContractFactory, args?: []) => {
	let contract = await factory.deploy(args);
	let tx = await contract.deployed();
	return contract;
};

/**
 * Deploys a contract via its bytecode. Does not save the deployment
 * @param abi
 * @param bytecode
 * @param args
 * @param signer
 * @returns
 */
export const deployBytecode = async (
	abi: string[],
	bytecode: string,
	args?: [],
	signer?: SignerWithAddress,
) => {
	signer = signer || (await getDefaultSigner());
	let factory = await ethers.getContractFactory(abi, bytecode, signer);
	return await deployContract(factory, args);
};

export const changeNetwork = (network: string) => {
	stopNetworkPipe(ethers.provider, hre.network.name);
	hre.changeNetwork(network);
	if (network !== 'ganache') startNetworkPipe(ethers.provider, network);
};

/**
 * Returns an ethers contract instance but takes an InfinityMintDeployment directly
 * @param deployment
 * @param provider
 * @returns
 */
export const getContract = (
	deployment: InfinityMintDeploymentLive,
	provider?: Provider | JsonRpcProvider,
) => {
	provider = provider || ethers.provider;
	return new ethers.Contract(deployment.address, deployment.abi, provider);
};

/**
 * Returns an instance of a contract which is signed
 * @param artifactOrDeployment
 * @param signer
 * @returns
 */
export const getSignedContract = async (
	deployment: InfinityMintDeploymentLive,
	signer?: SignerWithAddress,
): Promise<BaseContract> => {
	signer = signer || (await getDefaultSigner());
	let factory = await ethers.getContractFactory(deployment.name);
	return factory.connect(signer).attach(deployment.address);
};

export const logTransaction = async (
	execution: Promise<ContractTransaction> | ContractTransaction,
	logMessage?: string,
	printGasUsage?: boolean,
) => {
	if (logMessage?.length !== 0) {
		log(`🏳️‍🌈 ${logMessage}`);
	}

	if (typeof execution === typeof Promise)
		execution = await (execution as Promise<ContractTransaction>);

	let tx = execution as ContractTransaction;
	log(`🏷️ <${tx.hash}>(chainId: ${tx.chainId})`);
	let receipt: TransactionReceipt;
	if (tx.wait) {
		receipt = await tx.wait();
	} else receipt = await ethers.provider.getTransactionReceipt(tx.blockHash);

	log(`{green-fg}😊 Success{/green-fg}`);

	let session = readSession();

	if (!session.environment.temporaryGasReceipts)
		session.environment.temporaryGasReceipts = [];

	let savedReceipt = {
		...receipt,
		gasUsedEther: ethers.utils.formatEther(receipt.gasUsed.toString()),
		gasUsedNumerical: parseInt(receipt.gasUsed.toString()),
	};
	session.environment.temporaryGasReceipts.push({savedReceipt});

	if (printGasUsage)
		log(
			'{magenta-fg}⛽ gas: {/magenta-fg}' + savedReceipt.gasUsedEther + ' ETH',
		);

	saveSession(session);
	return receipt;
};

/**
 * Returns an ethers contract which you can use to execute methods on a smart contraact.
 * @param contractName
 * @param network
 * @param provider
 * @returns
 */
export const get = (contractName: string, network?: string, provider?: any) => {
	provider = provider || ethers.provider;
	return getContract(getLocalDeployment(contractName, network), provider);
};

/**
 * Returns an InfinityMintLiveDeployment with that contract name
 * @param contractName
 * @param network
 * @returns
 */
export const getDeployment = (contractName: string, network?: string) => {
	return create(getLocalDeployment(contractName, network || hre.network.name));
};

export const getNetworkSettings = (network: string) => {
	let config = getConfigFile();
	return (
		config?.settings?.networks[network] ||
		({} as InfinityMintConfigSettingsNetwork)
	);
};

export const getDefaultAccountIndex = () => {
	let config = getConfigFile();
	return config?.settings?.networks[hre.network.name]?.defaultAccount || 0;
};

export const registerNetworkLogs = () => {
	let networks = Object.keys(hre.config.networks);
	let config = getConfigFile();

	networks.forEach(network => {
		let settings = config?.settings?.networks[network] || {};
		if (settings.useDefaultPipe) return;
		debugLog('registered pipe for ' + network);
		defaultFactory.registerSimplePipe(network);
	});
};

export const getPrivateKeys = (mnemonic: any, walletLength?: number) => {
	let keys = [];
	walletLength = walletLength || 20;
	for (let i = 0; i < walletLength; i++) {
		keys.push(
			ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/` + i).privateKey,
		);
	}
	return keys;
};

export const stopNetworkPipe = (
	provider?: Web3Provider | JsonRpcProvider | EthereumProvider,
	network?: any,
) => {
	if (!network) network = hre.network.name;
	let settings = getNetworkSettings(network);
	//register events
	try {
		Object.keys(ProviderListeners[network]).forEach(key => {
			provider.off(key as any, ProviderListeners[network][key]);
		});
	} catch (error) {
		if (isEnvTrue('THROW_ALL_ERRORS')) throw error;
		warning('failed to stop pipe: ' + network);
	}
	defaultFactory
		.getPipe(settings.useDefaultPipe ? 'default' : network)
		.log('{red-fg}stopped pipe{/red-fg}');
	delete ProviderListeners[network];
};

export const startNetworkPipe = (
	provider?: Web3Provider | JsonRpcProvider | EthereumProvider,
	network?: any,
) => {
	if (!network) network = hre.network.name;
	let settings = getNetworkSettings(network);

	if (!provider) provider = ethers.provider;
	if (ProviderListeners[network]) stopNetworkPipe(provider, network);

	ProviderListeners[network] = ProviderListeners[network] || {};
	ProviderListeners[network].block = (blockNumber: any) => {
		log(
			'{green-fg}new block{/green-fg} => [' + blockNumber + ']',
			settings.useDefaultPipe ? 'default' : network,
		);
	};

	ProviderListeners[network].pending = (tx: any) => {
		log(
			'{yellow-fg}new transaction pending{/yellow-fg} => ' +
				JSON.stringify(tx, null, 2),
			settings.useDefaultPipe ? 'default' : network,
		);
	};

	ProviderListeners[network].error = (tx: any) => {
		defaultFactory
			.getPipe(settings.useDefaultPipe ? 'default' : network)
			.error('{red-fg}tx error{/reg-fg} => ' + JSON.stringify(tx, null, 2));
	};

	defaultFactory
		.getPipe(settings.useDefaultPipe ? 'default' : network)
		.log('{cyan-fg}started pipe{/cyan-fg}');

	Object.keys(ProviderListeners[network]).forEach(key => {
		provider.on(key as any, ProviderListeners[network][key]);
	});

	debugLog('registered provider event hooks for ' + network);
};
