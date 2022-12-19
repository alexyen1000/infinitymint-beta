import hre, { ethers } from "hardhat";
import { debugLog, getConfigFile, isEnvTrue, log } from "./helpers";
import Pipes from "./pipes";
import { Web3Provider, JsonRpcProvider } from "@ethersproject/providers";
import { HardhatEthersHelpers } from "@nomiclabs/hardhat-ethers/types";
import GanacheServer from "./ganacheServer";
import { EthereumProvider } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { getNetworkDeployment, create } from "./deployments";
import { InfinityMintDeploymentLive } from "./interfaces";

//stores listeners for the providers
const ProviderListeners = {} as any;

export const getDefaultSigner = async () => {
	if (
		hre.network.name === "ganache" &&
		isEnvTrue("GANACHE_EXTERNAL") === false
	) {
		let obj = GanacheServer.getProvider().getSigner(
			getDefaultAccountIndex()
		) as any;
		obj.address = await obj.getAddress();
		return obj as SignerWithAddress;
	}

	let defaultAccount = getDefaultAccountIndex();
	let signers = await ethers.getSigners();

	if (signers[defaultAccount] === undefined)
		throw new Error(
			"bad default account for network " +
				hre.network.name +
				" index " +
				defaultAccount +
				"does not exist"
		);

	return signers[defaultAccount];
};

export const changeNetwork = (network: string) => {
	hre.changeNetwork(network);

	if (network !== "ganache") startNetworkPipe(hre.network.provider, network);
};

/**
 * Returns the current provider to use for web3 interaction.
 * Used to ensure that output from the ganache chain is piped correctly into the logger.
 * Since ganache is ran inside of this instance we use the EIP-1199 provider
 * and return that, if we aren't then we will assume hardhat has managed our provider for us and return what ever ethers uses, use this
 * over ethers.provider or hre.network.provider
 *
 * @returns
 */
export const getProvider = () => {
	if (
		hre.network.name === "ganache" &&
		isEnvTrue("GANACHE_EXTERNAL") === false
	)
		return GanacheServer.getProvider();

	return ethers.provider;
};

/**
 * Returns an ethers contract instance but takes an InfinityMintDeployment directly
 * @param deployment
 * @param provider
 * @returns
 */
export const getContract = (
	deployment: InfinityMintDeploymentLive,
	provider?: any
) => {
	provider = provider || getProvider();
	return new ethers.Contract(deployment.address, deployment.abi, provider);
};

/**
 * Returns an ethers contract which you can use to execute methods on a smart contraact.
 * @param contractName
 * @param network
 * @param provider
 * @returns
 */
export const get = (contractName: string, network?: string, provider?: any) => {
	provider = provider || getProvider();
	return getContract(getNetworkDeployment(contractName, network), provider);
};

/**
 * Returns an InfinityMintLiveDeployment with that contract name
 * @param contractName
 * @param network
 * @returns
 */
export const getDeployment = (contractName: string, network?: string) => {
	return create(
		getNetworkDeployment(contractName, network || hre.network.name)
	);
};

export const getNetworkSettings = (network: string) => {
	let config = getConfigFile();
	return config?.settings?.networks[network] || {};
};

export const getDefaultAccountIndex = () => {
	let config = getConfigFile();
	return config?.settings?.networks[hre.network.name]?.defaultAccount || 0;
};

export const registerNetworkPipes = () => {
	let networks = Object.keys(hre.config.networks);
	let config = getConfigFile();

	networks.forEach((network) => {
		let settings = config?.settings?.networks[network] || {};
		if (settings.useDefaultPipe) return;
		debugLog("registered pipe for " + network);
		Pipes.registerSimplePipe(network);
	});
};

export const getPrivateKeys = (mnemonic: any, walletLength?: number) => {
	let keys = [];
	walletLength = walletLength || 20;
	for (let i = 0; i < walletLength; i++) {
		keys.push(
			ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/` + i)
				.privateKey
		);
	}
	return keys;
};

export const startNetworkPipe = (
	provider?: Web3Provider | JsonRpcProvider | EthereumProvider,
	network?: any
) => {
	let settings = getNetworkSettings(hre.network.name);
	if (network === undefined) network = hre.network.name;
	if (provider === undefined) provider = ethers.provider;

	ProviderListeners[network] = ProviderListeners[network] || {};

	//register events
	try {
		if (ProviderListeners[network].block)
			provider.off("block", ProviderListeners[network].block);
	} catch (error: any | Error) {
		Pipes.getPipe(settings.useDefaultPipe ? "default" : network).error(
			error
		);
	}

	ProviderListeners[network].block = provider.on(
		"block",
		(blockNumber: any) => {
			log(
				"{green-fg}new block:{/green-fg} #" + blockNumber,
				settings.useDefaultPipe ? "default" : network
			);
		}
	);

	try {
		if (ProviderListeners[network].pending)
			provider.off("pending", ProviderListeners[network].pending);
	} catch (error: any | Error) {
		Pipes.getPipe(settings.useDefaultPipe ? "default" : network).error(
			error
		);
	}

	ProviderListeners[network].pending = provider.on("pending", (tx: any) => {
		log(
			"{yellow-fg}new transaction pending:{/yellow-fg} " + tx.toString(),
			settings.useDefaultPipe ? "default" : network
		);
	});

	try {
		if (ProviderListeners[network].error)
			provider.off("error", ProviderListeners[network].error);
	} catch (error: any | Error) {
		Pipes.getPipe(settings.useDefaultPipe ? "default" : network).error(
			error
		);
	}

	ProviderListeners[network].error = provider.on("error", (tx: any) => {
		Pipes.getPipe(settings.useDefaultPipe ? "default" : network).error(
			"{red-fg}tx error:{/reg-fg} \n" + tx.toString()
		);
	});

	debugLog("registered provider event hooks for " + network);
};
