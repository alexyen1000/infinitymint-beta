import { Dictionary } from "form-data";
import { Rectangle, Vector, FuncTripple } from "./helpers";
import { BlessedElement, Blessed } from "./helpers";
import InfinityConsole from "./console";
/**
 * @experimental
 */
export declare class InfinityMintWindow {
    initialize: FuncTripple<InfinityMintWindow, BlessedElement, Blessed, Promise<void>>;
    think: FuncTripple<InfinityMintWindow, BlessedElement, Blessed, void>;
    name: string;
    elements: Dictionary<BlessedElement>;
    options: any;
    protected width: number | string;
    protected height: number | string;
    protected x: number;
    protected y: number;
    protected z: number;
    private screen;
    private style;
    private border;
    private id;
    private destroyed;
    private backgroundThink;
    private destroyId;
    private scrollbar;
    private initialized;
    private creation;
    private initialCreation;
    private autoInstantiate;
    private container?;
    constructor(name?: string, style?: any, border?: any, scrollbar?: any, options?: any);
    private generateId;
    setScreen(screen: any): void;
    setBackgroundThink(backgroundThink: boolean): void;
    setShouldInstantiate(instantiateInstantly: boolean): void;
    hasContainer(): boolean;
    shouldInstantiate(): boolean;
    shouldBackgroundThink(): boolean;
    setDestroyId(shouldDestroyId: boolean): void;
    setContainer(container: InfinityConsole): void;
    openWindow(name: string): Promise<void>;
    getCreation(): any;
    getInitialCreation(): any;
    loadOptions(defaultOptions: Dictionary<any>): void;
    saveOptions(): void;
    getContainer(): InfinityConsole;
    setBorder(border: any): void;
    getBorder(): object;
    setWidth(num: number | string): void;
    getId(): any;
    isEqual(thatWindow: InfinityMintWindow): boolean;
    toString(): any;
    setHeight(num: number | string): void;
    getRectangle(): Rectangle;
    getStyle(): object;
    setStyle(style: any): void;
    getWidth(): string | number;
    getX(): number;
    get(): Vector;
    getY(): number;
    getHeight(): string | number;
    hide(): void;
    show(): void;
    setSize(width: number | string, height: number | string): void;
    log(string?: string | string[], window?: any, returnString?: boolean): string;
    /**
     * Registers a new blessed element with the window.
     * @param key
     * @param element
     * @returns
     */
    registerElement(key: string, element: BlessedElement): BlessedElement;
    getElement(key: string): BlessedElement;
    getScrollbar(): any;
    update(): void;
    getScreen(): any;
    destroy(): void;
    registerKey(): void;
    isAlive(): boolean;
    hasInitialized(): boolean;
    on(event: string, listener: Function): Function;
    off(event: string, listener?: Function): void;
    isVisible(): boolean;
    updateFrameTitle(): Promise<void>;
    create(): Promise<void>;
}
//# sourceMappingURL=window.d.ts.map