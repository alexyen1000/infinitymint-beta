import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { IntegrityInterface, IntegrityInterfaceInterface } from "../IntegrityInterface";
export declare class IntegrityInterface__factory {
    static readonly abi: {
        inputs: any[];
        name: string;
        outputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
    }[];
    static createInterface(): IntegrityInterfaceInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IntegrityInterface;
}
//# sourceMappingURL=IntegrityInterface__factory.d.ts.map