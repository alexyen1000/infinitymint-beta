import { InfinityMintConfig, InfinityMintSession } from "./interfaces";
import { Dictionary } from "form-data";
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
    pushLine: Function;
    disableMouse: Function;
    content: any;
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
    setLine: FuncDouble<number, string, Function>;
    insertLine: FuncDouble<number, string, Function>;
    key: FuncDouble<string[], Function, Function>;
    onceKey: FuncDouble<string[], Function, Function>;
    onScreenEvent: FuncDouble<string, Function, Function>;
    unkey: FuncDouble<string[], Function, Function>;
}
/**
 * Can somebody educate me on a better way?
 *  - Lyds
 */
export interface FuncSingle<T, TResult> {
    (param0: T): TResult;
}
export interface FuncDouble<T, T2, TResult> {
    (param0: T, param1: T2): TResult;
}
export interface FuncTripple<T, T2, T3, TResult> {
    (param0: T, param1: T2, param3: T3): TResult;
}
export interface FuncQuad<T, T2, T3, T4, TResult> {
    (param0: T, param1: T2, param3: T3, param4: T4): TResult;
}
export interface Rectangle {
    startX: number;
    endX: number;
    startY: number;
    endY: number;
    width: number;
    height: number;
    z: number;
}
export declare const log: (msg: string, pipe?: string) => void;
export declare const debugLog: (msg: string) => void;
export declare const readSession: () => InfinityMintSession;
export declare const overwriteConsoleMethods: () => void;
/**
 * Returns safely the infinity mint config file
 * @returns
 */
export declare const getConfigFile: () => InfinityMintConfig;
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
export declare const getSolidityNamespace: () => any;
export declare const saveSessionVariable: (session: InfinityMintSession, key: string, value: any) => InfinityMintSession;
export declare const saveSession: (session: InfinityMintSession) => void;
export declare const error: (error: string | Error) => void;
export declare const isEnvTrue: (key: string) => boolean;
export declare const isEnvSet: (key: string) => boolean;
//# sourceMappingURL=helpers.d.ts.map