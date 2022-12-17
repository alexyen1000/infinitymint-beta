import { Web3Provider, JsonRpcProvider } from "@ethersproject/providers";
import { EthereumProvider } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
export declare const getDefaultSigner: () => Promise<SignerWithAddress>;
export declare const changeNetwork: (network: string) => void;
/**
 * Returns the current provider to use for web3 interaction.
 * Used to ensure that output from the ganache chain is piped correctly into the logger.
 * Since ganache is ran inside of this instance we use the EIP-1199 provider
 * and return that, if we aren't then we will assume hardhat has managed our provider for us and return what ever ethers uses, use this
 * over ethers.provider or hre.network.provider
 *
 * @returns
 */
export declare const getProvider: () => JsonRpcProvider;
export declare const getNetworkSettings: (network: string) => import("./interfaces").InfinityMintConfigSettingsNetwork;
export declare const getDefaultAccountIndex: () => number;
export declare const registerNetworkPipes: () => void;
export declare const getPrivateKeys: (mnemonic: any, walletLength?: number) => string[];
export declare const startNetworkPipe: (provider?: Web3Provider | JsonRpcProvider | EthereumProvider, network?: any) => void;
//# sourceMappingURL=web3.d.ts.map