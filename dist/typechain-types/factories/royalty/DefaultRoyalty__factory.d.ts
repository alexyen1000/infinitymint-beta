import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { DefaultRoyalty, DefaultRoyaltyInterface } from "../../royalty/DefaultRoyalty";
type DefaultRoyaltyConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class DefaultRoyalty__factory extends ContractFactory {
    constructor(...args: DefaultRoyaltyConstructorParams);
    deploy(valuesContract: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<DefaultRoyalty>;
    getDeployTransaction(valuesContract: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): DefaultRoyalty;
    connect(signer: Signer): DefaultRoyalty__factory;
    static readonly bytecode = "0x60806040523480156200001157600080fd5b506040516200104638038062001046833981016040819052620000349162000576565b600080546001600160a01b0319908116339081178355825260026020526040808320805460ff1916600190811790915592909255600380546001600160a01b038516921682179055905163e7b6dac960e01b815282919063e7b6dac990620000c1906004016020808252600e908201526d62617365546f6b656e56616c756560901b604082015260600190565b602060405180830381865afa158015620000df573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620001059190620005a8565b60035460405163e7b6dac960e01b815260206004820152600d60248201526c7374617274696e67507269636560981b60448201526001600160a01b039091169063e7b6dac990606401602060405180830381865afa1580156200016c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620001929190620005a8565b6200019e9190620005c2565b60075560035460405163e7b6dac960e01b815260206004820152600e60248201526d62617365546f6b656e56616c756560901b60448201526001600160a01b039091169063e7b6dac990606401602060405180830381865afa15801562000209573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200022f9190620005a8565b60035460405163e7b6dac960e01b815260206004820152600d60248201526c7374617274696e67507269636560981b60448201526001600160a01b039091169063e7b6dac990606401602060405180830381865afa15801562000296573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620002bc9190620005a8565b620002c89190620005c2565b60095560035460405163e7b6dac960e01b815260206004820152600e60248201526d62617365546f6b656e56616c756560901b60448201526001600160a01b039091169063e7b6dac990606401602060405180830381865afa15801562000333573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620003599190620005a8565b60035460405163e7b6dac960e01b815260206004820152600d60248201526c7374617274696e67507269636560981b60448201526001600160a01b039091169063e7b6dac990606401602060405180830381865afa158015620003c0573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620003e69190620005a8565b620003f29190620005c2565b60085560035460405163e7b6dac960e01b815260206004820152600c60248201526b1cdd1a58dad95c94dc1b1a5d60a21b60448201526064916001600160a01b03169063e7b6dac9908301602060405180830381865afa1580156200045b573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620004819190620005a8565b1115620004de5760405162461bcd60e51b815260206004820152602160248201527f737469636b65722073706c697420697320612076616c7565206f7665722031306044820152600360fc1b606482015260840160405180910390fd5b60035460405163e7b6dac960e01b815260206004820152600c60248201526b1cdd1a58dad95c94dc1b1a5d60a21b60448201526001600160a01b039091169063e7b6dac990606401602060405180830381865afa15801562000544573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200056a9190620005a8565b600a5550620005f09050565b6000602082840312156200058957600080fd5b81516001600160a01b0381168114620005a157600080fd5b9392505050565b600060208284031215620005bb57600080fd5b5051919050565b6000816000190483118215151615620005eb57634e487b7160e01b600052601160045260246000fd5b500290565b610a4680620006006000396000f3fe608060405234801561001057600080fd5b50600436106100fc5760003560e01c806304caf36a146101015780630d494e971461011657806310a8c7a9146101325780633a9c021e1461014557806354fe9fd71461015f5780635b6bf6411461017f5780637ff9b59614610187578063948509ea14610190578063a2b40d19146101bb578063a9313769146101ce578063b1f525c6146101d7578063b64d7df1146101f7578063c26623f014610200578063d15d415014610220578063d5f3948814610243578063d8b964e614610256578063e8953af214610279578063f2fde38b1461028c578063f80335a21461029f578063fe684c0e146102b2575b600080fd5b61011461010f3660046107d5565b6102c5565b005b61011f60085481565b6040519081526020015b60405180910390f35b610114610140366004610829565b6103b9565b61014d600081565b60405160ff9091168152602001610129565b61011f61016d3660046108ee565b60056020526000908152604090205481565b61014d600181565b61011f60075481565b6004546101a3906001600160a01b031681565b6040516001600160a01b039091168152602001610129565b6101146101c9366004610910565b610450565b61011f600a5481565b61011f6101e5366004610910565b600c6020526000908152604090205481565b61011f60095481565b61011f61020e366004610910565b60066020526000908152604090205481565b61023361022e3660046108ee565b610484565b6040519015158152602001610129565b6000546101a3906001600160a01b031681565b6102336102643660046108ee565b60026020526000908152604090205460ff1681565b61011f6102873660046108ee565b6104bf565b61011461029a3660046108ee565b6105ed565b6101146102ad366004610910565b61068d565b6101146102c0366004610929565b6106f3565b6000546001600160a01b03163314806102ed57503360009081526002602052604090205460ff165b6103125760405162461bcd60e51b815260040161030990610965565b60405180910390fd5b600180600082825461032491906109a1565b90915550506001548261033f5761033a8261068d565b6103a6565b6000828152600c60205260409020546103599060016109a1565b6000838152600c602090815260408083209390935581546001600160a01b0316825260059052205461038c9084906109a1565b600080546001600160a01b03168152600560205260409020555b60015481146103b457600080fd5b505050565b6000546001600160a01b031633146103e35760405162461bcd60e51b8152600401610309906109b9565b80516103ee57600080fd5b60005b815181101561044c57600160026000848481518110610412576104126109df565b6020908102919091018101516001600160a01b03168252810191909152604001600020805460ff19169115159190911790556001016103f1565b5050565b6000546001600160a01b0316331461047a5760405162461bcd60e51b8152600401610309906109b9565b6007805460095555565b600080546001600160a01b03838116911614806104b957506001600160a01b03821660009081526002602052604090205460ff165b92915050565b600080546001600160a01b03163314806104e857503360009081526002602052604090205460ff165b6105045760405162461bcd60e51b815260040161030990610965565b600180600082825461051691906109a1565b90915550506001546001600160a01b03831660009081526005602052604090205461057e5760405162461bcd60e51b8152602060048201526018602482015277496e76616c6964206f7220456d707479206164647265737360401b6044820152606401610309565b6001600160a01b03831660008181526005602090815260408083208054908490558151818152928301939093529194507f2cbba200147d9b2ecc06e0ff06af07d3630a1d26383fb0b6385fa32a327b7822910160405180910390a260015481146105e757600080fd5b50919050565b6000546001600160a01b031633146106175760405162461bcd60e51b8152600401610309906109b9565b600080546001600160a01b03908116825260026020526040808320805460ff1990811690915583546001600160a01b03191692851692831784558284528184208054909116600117905551909133917f93091b3f3cd424efabc74e181f3799f3476ed758412561ed3b29515c51f567529190a350565b6000546001600160a01b03163314806106b557503360009081526002602052604090205460ff165b6106d15760405162461bcd60e51b815260040161030990610965565b60008181526006602052604081208054916106eb836109f5565b919050555050565b6000546001600160a01b0316331461071d5760405162461bcd60e51b8152600401610309906109b9565b6000546001600160a01b03838116911614156107745760405162461bcd60e51b815260206004820152601660248201527531b0b73737ba1036b7b234b33c903232b83637bcb2b960511b6044820152606401610309565b6001600160a01b038216600081815260026020908152604091829020805460ff1916851515908117909155915191825233917ff38de818d000d07d091732dd783c6855722d7bc1934d92b7635133289d341695910160405180910390a35050565b600080604083850312156107e857600080fd5b50508035926020909101359150565b634e487b7160e01b600052604160045260246000fd5b80356001600160a01b038116811461082457600080fd5b919050565b6000602080838503121561083c57600080fd5b823567ffffffffffffffff8082111561085457600080fd5b818501915085601f83011261086857600080fd5b81358181111561087a5761087a6107f7565b8060051b604051601f19603f8301168101818110858211171561089f5761089f6107f7565b6040529182528482019250838101850191888311156108bd57600080fd5b938501935b828510156108e2576108d38561080d565b845293850193928501926108c2565b98975050505050505050565b60006020828403121561090057600080fd5b6109098261080d565b9392505050565b60006020828403121561092257600080fd5b5035919050565b6000806040838503121561093c57600080fd5b6109458361080d565b91506020830135801515811461095a57600080fd5b809150509250929050565b6020808252600c908201526b1b9bdd08185c1c1c9bdd995960a21b604082015260600190565b634e487b7160e01b600052601160045260246000fd5b600082198211156109b4576109b461098b565b500190565b6020808252600c908201526b3737ba103232b83637bcb2b960a11b604082015260600190565b634e487b7160e01b600052603260045260246000fd5b6000600019821415610a0957610a0961098b565b506001019056fea2646970667358221220b182336e83e56ba18c0e458e470d057d62fee65821cf3c59534f4aef99151d3564736f6c634300080c0033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "valuesContract";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "sender";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "newTotal";
            readonly type: "uint256";
        }];
        readonly name: "DispensedRoyalty";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "sender";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "changee";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "bool";
            readonly name: "value";
            readonly type: "bool";
        }];
        readonly name: "PermissionChange";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }];
        readonly name: "TransferedOwnership";
        readonly type: "event";
    }, {
        readonly inputs: readonly [];
        readonly name: "SPLIT_TYPE_MINT";
        readonly outputs: readonly [{
            readonly internalType: "uint8";
            readonly name: "";
            readonly type: "uint8";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "SPLIT_TYPE_STICKER";
        readonly outputs: readonly [{
            readonly internalType: "uint8";
            readonly name: "";
            readonly type: "uint8";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "approved";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_tokenPrice";
            readonly type: "uint256";
        }];
        readonly name: "changePrice";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly name: "counter";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "deployer";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "addr";
            readonly type: "address";
        }];
        readonly name: "dispenseRoyalty";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "total";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "erc721Destination";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly name: "freebies";
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
            readonly name: "value";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "splitType";
            readonly type: "uint256";
        }];
        readonly name: "incrementBalance";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "addr";
            readonly type: "address";
        }];
        readonly name: "isAuthenticated";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "lastTokenPrice";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address[]";
            readonly name: "addrs";
            readonly type: "address[]";
        }];
        readonly name: "multiApprove";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "originalTokenPrice";
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
            readonly name: "splitType";
            readonly type: "uint256";
        }];
        readonly name: "registerFree";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "addr";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "value";
            readonly type: "bool";
        }];
        readonly name: "setPrivilages";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "stickerSplit";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "tokenPrice";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "addr";
            readonly type: "address";
        }];
        readonly name: "transferOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "values";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): DefaultRoyaltyInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): DefaultRoyalty;
}
export {};
//# sourceMappingURL=DefaultRoyalty__factory.d.ts.map