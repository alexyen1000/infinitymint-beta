import { Web3Provider, JsonRpcProvider, TransactionReceipt, Provider } from "@ethersproject/providers";
import { ContractFactory, ContractTransaction } from "@ethersproject/contracts";
import { EthereumProvider } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { InfinityMintDeploymentLive } from "./interfaces";
export declare const getDefaultSigner: () => Promise<SignerWithAddress>;
/**
 *
 * @param artifactName
 * @param args
 * @returns
 */
export declare const deploy: (artifactName: string, signer?: SignerWithAddress, args?: [], save?: boolean, logDeployment?: boolean, usePreviousDeployment?: boolean) => Promise<import("@ethersproject/contracts").Contract>;
/**
 * Deploys a contract, takes an ethers factory. Does not save the deployment.
 * @param factory
 * @param args
 * @returns
 */
export declare const deployContract: (factory: ContractFactory, args?: []) => Promise<import("@ethersproject/contracts").Contract>;
/**
 * Deploys a contract via its bytecode. Does not save the deployment
 * @param abi
 * @param bytecode
 * @param args
 * @param signer
 * @returns
 */
export declare const deployBytecode: (abi: string[], bytecode: string, args?: [], signer?: SignerWithAddress) => Promise<import("@ethersproject/contracts").Contract>;
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
/**
 * Returns an ethers contract instance but takes an InfinityMintDeployment directly
 * @param deployment
 * @param provider
 * @returns
 */
export declare const getContract: (deployment: InfinityMintDeploymentLive, provider?: Provider | JsonRpcProvider) => import("@ethersproject/contracts").Contract;
/**
 * Returns an instance of a contract which is signed
 * @param artifactOrDeployment
 * @param signer
 * @returns
 */
export declare const getSignedContract: (artifactOrDeployment: InfinityMintDeploymentLive | string, signer?: SignerWithAddress) => Promise<import("@ethersproject/contracts").Contract | ContractFactory>;
export declare const logTransaction: (execution: Promise<ContractTransaction> | ContractTransaction, logMessage?: string, printGasUsage?: boolean) => Promise<TransactionReceipt>;
/**
 * Returns an ethers contract which you can use to execute methods on a smart contraact.
 * @param contractName
 * @param network
 * @param provider
 * @returns
 */
export declare const get: (contractName: string, network?: string, provider?: any) => import("@ethersproject/contracts").Contract;
/**
 * Returns an InfinityMintLiveDeployment with that contract name
 * @param contractName
 * @param network
 * @returns
 */
export declare const getDeployment: (contractName: string, network?: string) => import("./deployments").InfinityMintDeployment;
export declare const getNetworkSettings: (network: string) => import("./interfaces").InfinityMintConfigSettingsNetwork;
export declare const getDefaultAccountIndex: () => number;
export declare const registerNetworkPipes: () => void;
export declare const getPrivateKeys: (mnemonic: any, walletLength?: number) => any[];
export declare const startNetworkPipe: (provider?: Web3Provider | JsonRpcProvider | EthereumProvider, network?: any) => void;
//# sourceMappingURL=web3.d.ts.map