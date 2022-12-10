import hre, { ethers } from "hardhat";
import config from "../infinitymint.config";
import { debugLog, log } from "./helpers";
import Pipes from "./pipes";

export const getDefaultSigner = async () => {
	let defaultAccount =
		config?.settings?.networks[hre.network.name]?.defaultAccount || 0;
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

export const startNetworkPipe = () => {
	let settings = getNetworkSettings(hre.network.name);
	//register events
	ethers.provider.off("block");
	ethers.provider.on("block", (blockNumber) => {
		log(
			"new block: #" + blockNumber,
			settings.useDefaultPipe ? "default" : hre.network.name
		);
	});
	ethers.provider.off("pending");
	ethers.provider.on("pending", (tx) => {
		log("new transaction pending: " + tx.toString());
	});
	ethers.provider.off("error");
	ethers.provider.on("error", (tx) => {
		log("tx error: " + tx.toString());
	});
	debugLog("registered provider event hooks for " + hre.network.name);
};
