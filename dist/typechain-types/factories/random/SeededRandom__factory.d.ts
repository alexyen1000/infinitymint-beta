import { Signer, ContractFactory, BigNumberish, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { SeededRandom, SeededRandomInterface } from "../../random/SeededRandom";
type SeededRandomConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class SeededRandom__factory extends ContractFactory {
    constructor(...args: SeededRandomConstructorParams);
    deploy(seedNumber: PromiseOrValue<BigNumberish>, valuesContract: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<SeededRandom>;
    getDeployTransaction(seedNumber: PromiseOrValue<BigNumberish>, valuesContract: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): SeededRandom;
    connect(signer: Signer): SeededRandom__factory;
    static readonly bytecode = "0x60806040526001805460ff1916815560025562be135560045534801561002457600080fd5b5060405161045b38038061045b833981016040819052610043916100f4565b600380546001600160a01b0319166001600160a01b0383169081179091556040516304b01c2560e51b815260206004820152600f60248201526e3930b73237b6b2b9b9a330b1ba37b960891b604482015282919063960384a090606401602060405180830381865afa1580156100bd573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906100e19190610143565b600055505063ffffffff1660045561015c565b6000806040838503121561010757600080fd5b825163ffffffff8116811461011b57600080fd5b60208401519092506001600160a01b038116811461013857600080fd5b809150509250929050565b60006020828403121561015557600080fd5b5051919050565b6102f08061016b6000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c806307aaf42d146100675780634b0c7aad14610089578063a0d0ca0f146100aa578063bfa0b133146100bd578063ceb42337146100c6578063f2c9ecd8146100cf575b600080fd5b6001546100749060ff1681565b60405190151581526020015b60405180910390f35b61009c610097366004610250565b6100d7565b604051908152602001610080565b61009c6100b8366004610272565b61015d565b61009c60025481565b61009c60005481565b61009c610176565b60008083116100e557600192505b6004546000805460408051602081019490945283018590526060830186905233608084015260a08301529060c0016040516020818303038152906040528051906020012060001c905060008061013b838761021f565b91509150811561014f579250610157915050565b600093505050505b92915050565b60028054600101908190556000906101579083906100d7565b6002805460010190556003546040516304b01c2560e51b815260206004820152600f60248201526e36b0bc2930b73237b6a73ab6b132b960891b604482015260009161021a916001600160a01b039091169063960384a090606401602060405180830381865afa1580156101ee573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610212919061028b565b6002546100d7565b905090565b6000808261023257506000905080610249565b6001838581610243576102436102a4565b06915091505b9250929050565b6000806040838503121561026357600080fd5b50508035926020909101359150565b60006020828403121561028457600080fd5b5035919050565b60006020828403121561029d57600080fd5b5051919050565b634e487b7160e01b600052601260045260246000fdfea2646970667358221220364e68d6811a63c72830d38a9177a3590371c1fcbe9c33f7884c216ec842573964736f6c634300080c0033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "uint32";
            readonly name: "seedNumber";
            readonly type: "uint32";
        }, {
            readonly internalType: "address";
            readonly name: "valuesContract";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "maxNumber";
            readonly type: "uint256";
        }];
        readonly name: "getMaxNumber";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getNumber";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "hasDeployed";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "randomnessFactor";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "maxNumber";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "_salt";
            readonly type: "uint256";
        }];
        readonly name: "returnNumber";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "salt";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): SeededRandomInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): SeededRandom;
}
export {};
//# sourceMappingURL=SeededRandom__factory.d.ts.map