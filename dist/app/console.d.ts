import { InfinityMintConsole } from "./interfaces";
import { InfinityMintWindow } from "./window";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
export default class InfinityConsole {
    private screen;
    private options?;
    protected currentWindow?: InfinityMintWindow;
    protected windows: InfinityMintWindow[];
    protected canExit: boolean;
    private interval?;
    private network?;
    private signers?;
    private windowManager?;
    private optionsBox?;
    constructor(options?: InfinityMintConsole);
    getSigner(): SignerWithAddress;
    getSigners(): SignerWithAddress[];
    registerWindowsListEvents(window?: InfinityMintWindow): void;
    setWindow(thatWindow: string | Window): Promise<void>;
    reload(): Promise<void>;
    getWindows(): InfinityMintWindow[];
    getWindowById(id: string | Window): InfinityMintWindow;
    getWindowByAge(name: string, oldest: boolean): InfinityMintWindow;
    getWindowsByName(name: string): InfinityMintWindow[];
    addWindow(window: InfinityMintWindow): void;
    hasWindow: (window: InfinityMintWindow) => boolean;
    updateWindowsList(): void;
    displayError(error: any, onClick?: any): void;
    errorHandler(error: Error | unknown): void;
    initialize(): Promise<void>;
}
//# sourceMappingURL=console.d.ts.map