import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { InfinityMintAsset, InfinityMintAssetInterface } from "../InfinityMintAsset";
export declare class InfinityMintAsset__factory {
    static readonly abi: ({
        anonymous: boolean;
        inputs: {
            indexed: boolean;
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        type: string;
        outputs?: undefined;
        stateMutability?: undefined;
    } | {
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
        anonymous?: undefined;
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
        anonymous?: undefined;
    })[];
    static createInterface(): InfinityMintAssetInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): InfinityMintAsset;
}
//# sourceMappingURL=InfinityMintAsset__factory.d.ts.map