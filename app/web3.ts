import hre, { ethers } from "hardhat";
import config from "../infinitymint.config";
import { debugLog, isEnvTrue, log } from "./helpers";
import Pipes from "./pipes";
import { Web3Provider, JsonRpcProvider } from "@ethersproject/providers";
import GanacheServer from "./ganacheServer";
import { EthereumProvider } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

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

export const getProvider = () => {
	if (
		hre.network.name === "ganache" &&
		isEnvTrue("GANACHE_EXTERNAL") === false
	)
		return GanacheServer.getProvider();

	return hre.network.provider;
};

export const getNetworkSettings = (network: string) => {
	return config?.settings?.networks[network] || {};
};

export const getDefaultAccountIndex = () => {
	return config?.settings?.networks[hre.network.name]?.defaultAccount || 0;
};

export const registerNetworkPipes = () => {
	let networks = Object.keys(hre.config.networks);

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
	if (ProviderListeners[network].block)
		provider.off("block", ProviderListeners[network].block);
	ProviderListeners[network].block = provider.on(
		"block",
		(blockNumber: any) => {
			log(
				"{green-fg}new block:{/green-fg} #" + blockNumber,
				settings.useDefaultPipe ? "default" : network
			);
		}
	);

	if (ProviderListeners[network].pending)
		provider.off("block", ProviderListeners[network].pending);

	ProviderListeners[network].pending = provider.on("pending", (tx: any) => {
		log(
			"{yellow-fg}new transaction pending:{/yellow-fg} " + tx.toString(),
			settings.useDefaultPipe ? "default" : network
		);
	});

	if (ProviderListeners[network].error)
		provider.off("error", ProviderListeners[network].error);

	ProviderListeners[network].error = provider.on("error", (tx: any) => {
		log(
			"{red-fg}tx error:{/reg-fg} \n" + tx.toString(),
			settings.useDefaultPipe ? "default" : network
		);
	});

	debugLog("registered provider event hooks for " + network);
};
