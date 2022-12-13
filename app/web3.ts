import hre, { ethers } from "hardhat";
import config from "../infinitymint.config";
import { debugLog, log } from "./helpers";
import Pipes from "./pipes";
import { Web3Provider, JsonRpcProvider } from "@ethersproject/providers";

export const getDefaultSigner = async () => {
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

export const startNetworkPipe = (
	provider?: Web3Provider | JsonRpcProvider,
	network?: any
) => {
	let settings = getNetworkSettings(hre.network.name);
	if (network === undefined) network = hre.network.name;
	if (provider === undefined) provider = ethers.provider;
	//register events
	provider.on("block", (blockNumber: any) => {
		log(
			"new block: #" + blockNumber,
			settings.useDefaultPipe ? "default" : network
		);
	});

	provider.on("pending", (tx: any) => {
		log("new transaction pending: " + tx.toString());
	});

	provider.on("error", (tx: any) => {
		log("tx error: " + tx.toString());
	});
	debugLog("registered provider event hooks for " + network);
};
