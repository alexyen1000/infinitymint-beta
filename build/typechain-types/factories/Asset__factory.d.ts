import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { Asset, AssetInterface } from "../Asset";
export declare class Asset__factory {
    static readonly abi: ({
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
    } | {
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        outputs: {
            components: {
                internalType: string;
                name: string;
                type: string;
            }[];
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
    })[];
    static createInterface(): AssetInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): Asset;
}
//# sourceMappingURL=Asset__factory.d.ts.map