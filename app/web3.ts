import hre, { ethers } from "hardhat";
import config from "../infinitymint.config";

export const getDefaultSigner = async () => {
	let defaultAccount =
		config.settings?.networks[hre.network.name]?.defaultAccount || 0;
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

export const getDefaultAccountIndex = () => {
	return config.settings?.networks[hre.network.name]?.defaultAccount || 0;
};
