import { InfinityMintConfig, InfinityMintProject, InfinityMintProjectJavascript, InfinityMintSession } from "./interfaces";
import { Dictionary } from "form-data";
import { InfinityMintWindow } from "./window";
export interface Vector {
    x: number;
    y: number;
    z: number;
}
export interface Blessed {
    screen: any;
    box: any;
    button: any;
    list: any;
    image: any;
    form: any;
}
/**
 * A very experimentael prototype typescript interfaced for the blessed-js terminal-kit library. Most of the methods
 * on here are probably not going to work.
 *
 * @experimental
 */
export interface BlessedElement extends Element, Dictionary<any> {
    focus: Function;
    render: Function;
    hide: Function;
    setFront: Function;
    on: Function;
    off: Function;
    setBack: Function;
    setScroll: Function;
    removeLabel: Function;
    /**
     * Doesn't appear to function
     */
    pushLine: Function;
    disableMouse: Function;
    content: any;
    /**
     * Returns the current window this element is assigned too. Will be undefined if the element has not been registered with an InfinityMintWindow
     */
    window: InfinityMintWindow;
    disableKeys: Function;
    setItems: Function;
    enterSelected: Function;
    enableKeys: Function;
    width: number;
    hidden: boolean;
    height: number;
    shouldUnhide: boolean;
    style: any;
    setContent: Function;
    setLabel: Function;
    enableMouse: Function;
    enableInput: Function;
    enableDrag: Function;
    disableDrag: Function;
    show: Function;
    toggle: Function;
    destroy: Function;
    free: Function;
    /**
     * Doesn't appear to function
     */
    setLine: FuncDouble<number, string, Function>;
    /**
     * Doesn't appear to function
     */
    insertLine: FuncDouble<number, string, Function>;
    key: FuncDouble<string[], Function, Function>;
    onceKey: FuncDouble<string[], Function, Function>;
    onScreenEvent: FuncDouble<string, Function, Function>;
    unkey: FuncDouble<string[], Function, Function>;
}
/**
 * Interface for defining a typescript typesript type that is an anon function that takes one param and returns one result.
 */
export interface FuncSingle<T, TResult> {
    (param0: T): TResult;
}
/**
 * Interface for defining a typescript typesript type that is an anon function that takes two param and returns one result.
 */
export interface FuncDouble<T, T2, TResult> {
    (param0: T, param1: T2): TResult;
}
/**
 * Interface for defining a typescript typesript type that is an anon function that takes three param and returns one result.
 */
export interface FuncTripple<T, T2, T3, TResult> {
    (param0: T, param1: T2, param3: T3): TResult;
}
/**
 * Interface for defining a typescript typesript type that is an anon function that takes four param and returns one result.
 */
export interface FuncQuad<T, T2, T3, T4, TResult> {
    (param0: T, param1: T2, param3: T3, param4: T4): TResult;
}
/**
 * used in the InfinityMintWindow. Is the bounding box of the current window relative to the current terminal size (see {@link app/window.InfinityMintWindow}).
 */
export interface Rectangle {
    startX: number | string;
    endX: number | string;
    startY: number | string;
    endY: number | string;
    width: number | string;
    height: number | string;
    z: number;
}
/**
 * Logs a console message to the current pipe.
 * @param msg
 * @param pipe
 */
export declare const log: (msg: string, pipe?: string) => void;
/**
 * Logs a debug message to the current pipe.
 * @param msg
 * @param pipe
 */
export declare const debugLog: (msg: string) => void;
/**
 * Reads the current .session file in the cwd which holds settings relating to the current instance of InfinityMint.
 * @returns
 */
export declare const readSession: () => InfinityMintSession;
/**
 * Overwrites default behaviour of console.log and console.error
 */
export declare const overwriteConsoleMethods: () => void;
/**
 * Returns safely the infinity mint config file
 * @returns
 */
export declare const getConfigFile: () => InfinityMintConfig;
/**
 * Returns a compiled InfinityMintProject ready to be deployed, see {@link app/interfaces.InfinityMintProject}.
 * @param projectName
 */
export declare const getCompiledProject: (projectName: string) => InfinityMintProject;
/**
 * Returns a deployed InfinityMintProject, see {@link app/interfaces.InfinityMintProject}.
 * @param projectName
 */
export declare const getDeployedProject: (projectName: string, version?: any) => InfinityMintProject;
/**
 * Returns an InfinityMintProject file relative to the /projects/ folder, see {@link app/interfaces.InfinityMintProject}. Will return type of InfinityMintProjectClassic if second param is true.
 * @param projectName
 * @param isJavaScript
 */
export declare const getProject: (projectName: string, isJavaScript?: boolean) => InfinityMintProject | InfinityMintProjectJavascript;
/**
 * Loads the infinitymint.config.js and prepares the hardhat response. Only to be used inside of hardhat.config.ts.
 * @returns
 */
export declare const initializeInfinitymintConfig: () => InfinityMintConfig;
/**
 * Loaded when hardhat is being initialized, essentially creates an infinitymint.config if one is not available, generates a new ganache mnemonic and overwrites console.log and console.error to be piped to what ever pipe is currently default.
 *
 * @see {@link app/interfaces.InfinityMintConfig}
 * @see {@link app/pipes.Pipe}
 * @param useJavascript Will return infinitymint.config.js instead of infinitymint.config.ts
 * @param useInternalRequire  Will use require('./app/interfaces') instead of require('infinitymint/dist/app/interfaces')
 */
export declare const loadInfinityMint: (useJavascript?: boolean, useInternalRequire?: boolean) => void;
export declare const createDirs: (dirs: string[]) => void;
export declare const readJson: (fileName: string) => any;
export declare const preInitialize: () => void;
export declare const initializeGanacheMnemonic: () => any;
export declare const createInfinityMintConfig: (useJavascript?: boolean, useInternalRequire?: boolean) => void;
export declare const getsolidityFolder: () => any;
export declare const saveSessionVariable: (session: InfinityMintSession, key: string, value: any) => InfinityMintSession;
export declare const saveSession: (session: InfinityMintSession) => void;
export declare const error: (error: string | Error) => void;
export declare const isEnvTrue: (key: string) => boolean;
export declare const isEnvSet: (key: string) => boolean;
//# sourceMappingURL=helpers.d.ts.map