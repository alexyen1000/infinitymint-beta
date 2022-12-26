import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { StickerInterface, StickerInterfaceInterface } from "../../legacy/StickerInterface";
export declare class StickerInterface__factory {
    static readonly abi: {
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        outputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
    }[];
    static createInterface(): StickerInterfaceInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): StickerInterface;
}
//# sourceMappingURL=StickerInterface__factory.d.ts.map