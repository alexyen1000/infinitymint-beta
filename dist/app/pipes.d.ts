/// <reference types="node" />
import { ChildProcess } from "child_process";
import { Dictionary } from "form-data";
/**
 * The log pipe class
 */
export declare class Pipe {
    logs: String[];
    listen: boolean;
    save: boolean;
    appendDate?: boolean;
    private pipe;
    private errors;
    private created;
    logHandler: Function;
    errorHandler: Function;
    terminationHandler: Function;
    /**
     *
     * @param pipe
     */
    constructor(pipe: string);
    toString(): string;
    getCreation(): Date;
    log(msg: string): void;
    error(error: string): void;
}
/**
 * Interface for the log pipe options
 */
export interface PipeOptions {
    save?: boolean;
    listen?: boolean;
    setAsCurrentPipe?: boolean;
    appendDate?: boolean;
    autoClose?: boolean;
}
/**
 * Logging factory class
 */
export declare class Pipes {
    logs: Dictionary<Pipe>;
    currentPipe: string;
    constructor();
    setCurrentPipe(key: string): void;
    error(error: any): void;
    log(msg: string, pipe?: string, dontHighlight?: boolean): any;
    getPipe(key: string): Pipe;
    registerSimplePipe(key: string, options?: PipeOptions): Pipe;
    closePipe(pipe: string | Pipe): void;
    registerPipe(key: string, process: ChildProcess, options?: PipeOptions): Pipe;
    createPipe(key: string, options?: PipeOptions): Pipe;
}
declare const _default: Pipes;
export default _default;
//# sourceMappingURL=pipes.d.ts.map