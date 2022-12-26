import { Signer, ContractFactory, BigNumberish, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { InfinityMintWallet, InfinityMintWalletInterface } from "../InfinityMintWallet";
type InfinityMintWalletConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class InfinityMintWallet__factory extends ContractFactory {
    constructor(...args: InfinityMintWalletConstructorParams);
    deploy(tokenId: PromiseOrValue<BigNumberish>, erc721Destination: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<InfinityMintWallet>;
    getDeployTransaction(tokenId: PromiseOrValue<BigNumberish>, erc721Destination: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): InfinityMintWallet;
    connect(signer: Signer): InfinityMintWallet__factory;
    static readonly bytecode = "0x60c0604052600660808190526515d85b1b195d60d21b60a0908152620000299160039190620000cc565b503480156200003757600080fd5b50604051620010c0380380620010c08339810160408190526200005a9162000172565b600080546001600160a01b03199081163390811783558252600260205260408220805460ff19166001908117909155829055600480546001600160a01b039490941663ffffffff909516600160a01b029091166001600160c01b03199093169290921792909217905560055562000201565b828054620000da90620001c4565b90600052602060002090601f016020900481019282620000fe576000855562000149565b82601f106200011957805160ff191683800117855562000149565b8280016001018555821562000149579182015b82811115620001495782518255916020019190600101906200012c565b50620001579291506200015b565b5090565b5b808211156200015757600081556001016200015c565b600080604083850312156200018657600080fd5b825163ffffffff811681146200019b57600080fd5b60208401519092506001600160a01b0381168114620001b957600080fd5b809150509250929050565b600181811c90821680620001d957607f821691505b60208210811415620001fb57634e487b7160e01b600052602260045260246000fd5b50919050565b610eaf80620002116000396000f3fe6080604052600436106100c65760003560e01c80629a9b7b146100db57806310a8c7a91461011957806312065fe014610139578063150b7a02146101575780633ccfd60b1461019c5780635b648b0a146101b157806388782c9c146101d3578063bca6ce64146101e8578063beabacc814610220578063d0e30db014610240578063d15d415014610248578063d49a2a7c14610278578063d5f39488146102db578063d8b964e6146102fb578063f2fde38b1461032b578063fe684c0e1461034b57600080fd5b366100d6576100d43461036b565b005b600080fd5b3480156100e757600080fd5b506004546100ff90600160a01b900463ffffffff1681565b60405163ffffffff90911681526020015b60405180910390f35b34801561012557600080fd5b506100d4610134366004610abb565b6103bd565b34801561014557600080fd5b50600554604051908152602001610110565b34801561016357600080fd5b50610183610172366004610b7f565b630a85bd0160e11b95945050505050565b6040516001600160e01b03199091168152602001610110565b3480156101a857600080fd5b506100d461045d565b3480156101bd57600080fd5b506101c6610551565b6040516101109190610c79565b3480156101df57600080fd5b506100d46105df565b3480156101f457600080fd5b50600454610208906001600160a01b031681565b6040516001600160a01b039091168152602001610110565b34801561022c57600080fd5b506100d461023b366004610c93565b610752565b6100d4610892565b34801561025457600080fd5b50610268610263366004610cd4565b6108c3565b6040519015158152602001610110565b34801561028457600080fd5b506000546004546040805180820190915260068152651dd85b1b195d60d21b602082015230926001600160a01b031691600160a01b900463ffffffff16906335268a9f60e21b604051610110959493929190610cf1565b3480156102e757600080fd5b50600054610208906001600160a01b031681565b34801561030757600080fd5b50610268610316366004610cd4565b60026020526000908152604090205460ff1681565b34801561033757600080fd5b506100d4610346366004610cd4565b6108fe565b34801561035757600080fd5b506100d4610366366004610d3f565b61099e565b806005546103799190610d7d565b600581905560408051838152602081019290925233917f90890809c654f11d6e72a28fa60149770a0d11ec6c92319d6ceb2bb0a4ea1a15910160405180910390a250565b6000546001600160a01b031633146103f05760405162461bcd60e51b81526004016103e790610da3565b60405180910390fd5b80516103fb57600080fd5b60005b81518110156104595760016002600084848151811061041f5761041f610dc9565b6020908102919091018101516001600160a01b03168252810191909152604001600020805460ff19169115159190911790556001016103fe565b5050565b600180600082825461046f9190610d7d565b90915550506001546000546001600160a01b031633148061049f57503360009081526002602052604090205460ff165b6104bb5760405162461bcd60e51b81526004016103e790610ddf565b60058054600091829055815460405191926001600160a01b039091169183156108fc0291849190818181858888f193505050501580156104ff573d6000803e3d6000fd5b5060055460408051478152602081019290925233917ff279e6a1f5e320cca91135676d9cb6e44ca8a08c0b88342bcdb1144f6511b568910160405180910390a250600154811461054e57600080fd5b50565b6003805461055e90610e05565b80601f016020809104026020016040519081016040528092919081815260200182805461058a90610e05565b80156105d75780601f106105ac576101008083540402835291602001916105d7565b820191906000526020600020905b8154815290600101906020018083116105ba57829003601f168201915b505050505081565b60018060008282546105f19190610d7d565b9091555050600154600480546040516331a9108f60e11b8152600160a01b820463ffffffff16928101929092526000916001600160a01b0390911690636352211e90602401602060405180830381865afa158015610653573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106779190610e40565b6000549091506001600160a01b03808316911614156106e35760405162461bcd60e51b815260206004820152602260248201527f6f776e6572206f662074686520746f6b656e20697320746865206465706c6f7960448201526132b960f11b60648201526084016103e7565b336001600160a01b0382161461073a5760405162461bcd60e51b815260206004820152601c60248201527b39b2b73232b91036bab9ba103132903a3432903732bb9037bbb732b960211b60448201526064016103e7565b610743816108fe565b50600154811461054e57600080fd5b6000546001600160a01b031633148061077a57503360009081526002602052604090205460ff165b6107965760405162461bcd60e51b81526004016103e790610ddf565b6040513060248201526001600160a01b038381166044830152606482018390526000918291861690829060840160408051601f198184030181529181526020820180516001600160e01b03166317d5759960e31b179052516107f89190610e5d565b60006040518083038185875af1925050503d8060008114610835576040519150601f19603f3d011682016040523d82523d6000602084013e61083a565b606091505b50915091508161088b5780516108825760405162461bcd60e51b815260206004820152600d60248201526c18d85b1b081c995d995c9d1959609a1b60448201526064016103e7565b80518082602001fd5b5050505050565b60018060008282546108a49190610d7d565b90915550506001546108b53461036b565b600154811461054e57600080fd5b600080546001600160a01b03838116911614806108f857506001600160a01b03821660009081526002602052604090205460ff165b92915050565b6000546001600160a01b031633146109285760405162461bcd60e51b81526004016103e790610da3565b600080546001600160a01b03908116825260026020526040808320805460ff1990811690915583546001600160a01b03191692851692831784558284528184208054909116600117905551909133917f93091b3f3cd424efabc74e181f3799f3476ed758412561ed3b29515c51f567529190a350565b6000546001600160a01b031633146109c85760405162461bcd60e51b81526004016103e790610da3565b6000546001600160a01b0383811691161415610a1f5760405162461bcd60e51b815260206004820152601660248201527531b0b73737ba1036b7b234b33c903232b83637bcb2b960511b60448201526064016103e7565b6001600160a01b038216600081815260026020908152604091829020805460ff1916851515908117909155915191825233917ff38de818d000d07d091732dd783c6855722d7bc1934d92b7635133289d341695910160405180910390a35050565b634e487b7160e01b600052604160045260246000fd5b6001600160a01b038116811461054e57600080fd5b8035610ab681610a96565b919050565b60006020808385031215610ace57600080fd5b82356001600160401b0380821115610ae557600080fd5b818501915085601f830112610af957600080fd5b813581811115610b0b57610b0b610a80565b8060051b604051601f19603f83011681018181108582111715610b3057610b30610a80565b604052918252848201925083810185019188831115610b4e57600080fd5b938501935b82851015610b7357610b6485610aab565b84529385019392850192610b53565b98975050505050505050565b600080600080600060808688031215610b9757600080fd5b8535610ba281610a96565b94506020860135610bb281610a96565b93506040860135925060608601356001600160401b0380821115610bd557600080fd5b818801915088601f830112610be957600080fd5b813581811115610bf857600080fd5b896020828501011115610c0a57600080fd5b9699959850939650602001949392505050565b60005b83811015610c38578181015183820152602001610c20565b83811115610c47576000848401525b50505050565b60008151808452610c65816020860160208601610c1d565b601f01601f19169290920160200192915050565b602081526000610c8c6020830184610c4d565b9392505050565b600080600060608486031215610ca857600080fd5b8335610cb381610a96565b92506020840135610cc381610a96565b929592945050506040919091013590565b600060208284031215610ce657600080fd5b8135610c8c81610a96565b6001600160a01b038681168252851660208201526040810184905260a060608201819052600090610d2490830185610c4d565b905063ffffffff60e01b831660808301529695505050505050565b60008060408385031215610d5257600080fd5b8235610d5d81610a96565b915060208301358015158114610d7257600080fd5b809150509250929050565b60008219821115610d9e57634e487b7160e01b600052601160045260246000fd5b500190565b6020808252600c908201526b3737ba103232b83637bcb2b960a11b604082015260600190565b634e487b7160e01b600052603260045260246000fd5b6020808252600c908201526b1b9bdd08185c1c1c9bdd995960a21b604082015260600190565b600181811c90821680610e1957607f821691505b60208210811415610e3a57634e487b7160e01b600052602260045260246000fd5b50919050565b600060208284031215610e5257600080fd5b8151610c8c81610a96565b60008251610e6f818460208701610c1d565b919091019291505056fea264697066735822122085d579f926d83678dfcac498c1edbe7b241779c138a4ec6c737fece79319aa9d64736f6c634300080c0033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "uint32";
            readonly name: "tokenId";
            readonly type: "uint32";
        }, {
            readonly internalType: "address";
            readonly name: "erc721Destination";
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
        readonly name: "Deposit";
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
        readonly name: "Withdraw";
        readonly type: "event";
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
        readonly inputs: readonly [];
        readonly name: "currentTokenId";
        readonly outputs: readonly [{
            readonly internalType: "uint32";
            readonly name: "";
            readonly type: "uint32";
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
        readonly inputs: readonly [];
        readonly name: "deposit";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "erc721";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getBalance";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getIntegrity";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }, {
            readonly internalType: "bytes4";
            readonly name: "";
            readonly type: "bytes4";
        }];
        readonly stateMutability: "view";
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
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly name: "onERC721Received";
        readonly outputs: readonly [{
            readonly internalType: "bytes4";
            readonly name: "";
            readonly type: "bytes4";
        }];
        readonly stateMutability: "pure";
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
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "erc721Destination";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }];
        readonly name: "transfer";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
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
        readonly inputs: readonly [];
        readonly name: "transferOwnershipToTokenOwner";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "walletType";
        readonly outputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "withdraw";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly stateMutability: "payable";
        readonly type: "receive";
    }];
    static createInterface(): InfinityMintWalletInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): InfinityMintWallet;
}
export {};
//# sourceMappingURL=InfinityMintWallet__factory.d.ts.map