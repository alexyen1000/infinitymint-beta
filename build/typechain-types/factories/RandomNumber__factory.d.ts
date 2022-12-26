import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { RandomNumber, RandomNumberInterface } from "../RandomNumber";
export declare class RandomNumber__factory {
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
    static createInterface(): RandomNumberInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): RandomNumber;
}
//# sourceMappingURL=RandomNumber__factory.d.ts.map