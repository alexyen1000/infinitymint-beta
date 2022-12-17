/// <reference types="node" />
import events, { EventEmitter } from "events";
import { InfinityMintDeploymentScript } from "./interfaces";
export declare class DeploymentScript {
    protected emitter: EventEmitter;
    protected source: InfinityMintDeploymentScript;
    protected sourceFile: string;
    protected key: string;
    constructor(sourceFile: string, key: string);
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
    getPermissions(): any[] | undefined;
    execute(method: string, args: any): Promise<void>;
}
/**
 * Returns a list of all the deployment scripts
 * @returns
 */
export declare const getDeploymentScripts: () => Promise<DeploymentScript[]>;
//# sourceMappingURL=deployments.d.ts.map