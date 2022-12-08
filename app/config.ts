import { HardhatUserConfig } from "hardhat/types";

/**
 * Interface for the InfinityMint configuration file
 */
export interface InfinityMintConfig {
	hardhat: HardhatUserConfig;
	ipfs?: object;
	settings?: object;
}
