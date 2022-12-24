/// <reference types="node" />
import events, { EventEmitter } from "events";
import { InfinityMintDeploymentScript, InfinityMintDeploymentLive, InfinityMintProject } from "./interfaces";
/**
 * Deployment class for InfinityMint deployments
 */
export declare class InfinityMintDeployment {
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
    constructor(deploymentScriptLocation: string, key: string, network: string, project: InfinityMintProject);
    /**
     * reloads the source file script
     */
    reload(): void;
    /**
     * Adds the listener function to the end of the listeners array for the event named eventName. No checks are made to see if the listener has already been added. Multiple  calls passing the same combination of eventNameand listener will result in the listener being added, and called, multiple times.
     *
     * Returns a reference to the EventEmitter, so that calls can be chained.
     * @param event
     * @param callback
     * @returns
     */
    on(event: string, callback: (...args: any[]) => void): events;
    /**
     *
     * @param event
     * @param callback
     * @returns
     */
    off(event: string, callback: (...args: any[]) => void): events;
    getIndex(): number;
    getSolidityNamespace(): string;
    getKey(): string;
    getPermissions(): any[];
    getFilePath(): string;
    private read;
    getDeploymentByArtifactName(name: string): InfinityMintDeploymentLive[];
    getDeployer(index?: number): string;
    getApproved(index?: number): string[];
    getAddress(index?: number): string;
    isLibrary(): boolean;
    getAbi(index?: number): any[];
    getDeployments(): InfinityMintDeploymentLive[];
    isImportant(): boolean;
    isUnique(): boolean;
    hasDeployed(): boolean;
    hasSetup(): boolean;
    save(): void;
    /**
     * Returns an ethers contract instance of this deployment for you to call methods on the smart contract
     * @param index
     * @returns
     */
    getContract(index?: number): import("ethers").Contract;
    /**
     * used after deploy to set the the live deployments for this deployment. See {@link app/interfaces.InfinityMintDeploymentLive}, Will check if each member has the same network and project name as the one this deployment class is attached too
     * @param liveDeployments
     */
    updateLiveDeployments(liveDeployments: InfinityMintDeploymentLive | InfinityMintDeploymentLive[]): void;
    /**
     * returns true if we have a local deployment for this current network
     * @param index
     * @returns
     */
    hasLocalDeployment(index?: number): boolean;
    /**
     * gets a deployment inside of the current /deployments/ folder
     * @param index
     * @returns
     */
    getLocalDeployment(index?: number): InfinityMintDeploymentLive;
    deploy(...args: any): Promise<void>;
    setup(...args: any): Promise<void>;
    execute(method: string, args: any): Promise<void>;
}
/**
 * gets a deployment in the /deployments/network/ folder and turns it into an InfinityMintDeploymentLive
 */
export declare const getNetworkDeployment: (contractName: string, network: string) => InfinityMintDeploymentLive;
/**
 * Returns the raw .json file in the /deployments/network/ folder
 * @param contractName
 * @returns
 */
export declare const readNetworkDeployment: (contractName: string, network: string) => any;
/**
 * Returns true if a deployment manifest for this key/contractName is found
 * @param contractName - can be a key (erc721, assets) or a fully qualified contract name
 * @param project
 * @param network
 * @returns
 */
export declare const hasDeploymentManifest: (contractName: string, project: InfinityMintProject, network?: string) => boolean;
export declare const getDeploymentClass: (contractName: string, project: InfinityMintProject, network?: string) => InfinityMintDeployment;
export declare const getLiveDeployments: (contractName: string, project: InfinityMintProject, network: string) => InfinityMintDeploymentLive[];
/**
 * Returns a new deployment class from a live deployment file
 * @param liveDeployment
 * @returns
 */
export declare const create: (liveDeployment: InfinityMintDeploymentLive, deploymentScript?: string) => InfinityMintDeployment;
/**
 * Returns a list of InfinityMintDeployment classes for the network and project based on the deployment typescripts which are found.
 * @returns
 */
export declare const getDeploymentClasses: (project: InfinityMintProject, network?: string, root?: string) => Promise<InfinityMintDeployment[]>;
//# sourceMappingURL=deployments.d.ts.map