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
     * the live infinity mint deployment interface containing the abi, address, deployer approved and more, See {@link InfinityMintDeploymentLive}
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
    hasDeployed(): boolean;
    hasSetup(): boolean;
    save(): void;
    updateLiveDeployments(liveDeployments: InfinityMintDeploymentLive | InfinityMintDeploymentLive[]): void;
    deploy(...args: any): Promise<void>;
    setup(...args: any): Promise<void>;
    execute(method: string, args: any): Promise<void>;
}
/**
 * Returns a list of InfinityMintDeployment classes for the network and project.
 * @returns
 */
export declare const getDeployments: (project: InfinityMintProject, network: string, root?: string) => Promise<InfinityMintDeployment[]>;
//# sourceMappingURL=deployments.d.ts.map