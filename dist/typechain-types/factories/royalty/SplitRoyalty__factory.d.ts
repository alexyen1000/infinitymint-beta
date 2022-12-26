import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { SplitRoyalty, SplitRoyaltyInterface } from "../../royalty/SplitRoyalty";
type SplitRoyaltyConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class SplitRoyalty__factory extends ContractFactory {
    constructor(...args: SplitRoyaltyConstructorParams);
    deploy(valuesContract: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<SplitRoyalty>;
    getDeployTransaction(valuesContract: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): SplitRoyalty;
    connect(signer: Signer): SplitRoyalty__factory;
    static readonly bytecode = "0x60806040523480156200001157600080fd5b506040516200186e3803806200186e833981016040819052620000349162000576565b600080546001600160a01b0319908116339081178355825260026020526040808320805460ff1916600190811790915592909255600380546001600160a01b038516921682179055905163e7b6dac960e01b815282919063e7b6dac990620000c1906004016020808252600e908201526d62617365546f6b656e56616c756560901b604082015260600190565b602060405180830381865afa158015620000df573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620001059190620005a8565b60035460405163e7b6dac960e01b815260206004820152600d60248201526c7374617274696e67507269636560981b60448201526001600160a01b039091169063e7b6dac990606401602060405180830381865afa1580156200016c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620001929190620005a8565b6200019e9190620005c2565b60075560035460405163e7b6dac960e01b815260206004820152600e60248201526d62617365546f6b656e56616c756560901b60448201526001600160a01b039091169063e7b6dac990606401602060405180830381865afa15801562000209573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200022f9190620005a8565b60035460405163e7b6dac960e01b815260206004820152600d60248201526c7374617274696e67507269636560981b60448201526001600160a01b039091169063e7b6dac990606401602060405180830381865afa15801562000296573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620002bc9190620005a8565b620002c89190620005c2565b60095560035460405163e7b6dac960e01b815260206004820152600e60248201526d62617365546f6b656e56616c756560901b60448201526001600160a01b039091169063e7b6dac990606401602060405180830381865afa15801562000333573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620003599190620005a8565b60035460405163e7b6dac960e01b815260206004820152600d60248201526c7374617274696e67507269636560981b60448201526001600160a01b039091169063e7b6dac990606401602060405180830381865afa158015620003c0573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620003e69190620005a8565b620003f29190620005c2565b60085560035460405163e7b6dac960e01b815260206004820152600c60248201526b1cdd1a58dad95c94dc1b1a5d60a21b60448201526064916001600160a01b03169063e7b6dac9908301602060405180830381865afa1580156200045b573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620004819190620005a8565b1115620004de5760405162461bcd60e51b815260206004820152602160248201527f737469636b65722073706c697420697320612076616c7565206f7665722031306044820152600360fc1b606482015260840160405180910390fd5b60035460405163e7b6dac960e01b815260206004820152600c60248201526b1cdd1a58dad95c94dc1b1a5d60a21b60448201526001600160a01b039091169063e7b6dac990606401602060405180830381865afa15801562000544573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200056a9190620005a8565b600a5550620005f09050565b6000602082840312156200058957600080fd5b81516001600160a01b0381168114620005a157600080fd5b9392505050565b600060208284031215620005bb57600080fd5b5051919050565b6000816000190483118215151615620005eb57634e487b7160e01b600052601160045260246000fd5b500290565b61126e80620006006000396000f3fe608060405234801561001057600080fd5b50600436106101335760003560e01c806304caf36a146101385780630d494e971461014d57806310a8c7a914610169578063121c4ee71461017c5780633a9c021e146101845780634ab247fd1461019e57806354fe9fd7146101b15780635b6bf641146101d15780637ff9b596146101d9578063948509ea146101e2578063a2b40d191461020d578063a931376914610220578063b1f525c614610229578063b64d7df114610249578063c235391814610252578063c26623f014610272578063c7a4d6c914610292578063cc490e64146102b2578063d15d4150146102ba578063d5f39488146102dd578063d8b964e6146102f0578063e8953af214610313578063f2fde38b14610326578063f80335a214610339578063fe684c0e1461034c575b600080fd5b61014b610146366004610eb3565b61035f565b005b61015660085481565b6040519081526020015b60405180910390f35b61014b610177366004610f10565b610733565b61014b6107ca565b61018c600081565b60405160ff9091168152602001610160565b61014b6101ac366004610fd5565b610837565b6101566101bf36600461100a565b60056020526000908152604090205481565b61018c600181565b61015660075481565b6004546101f5906001600160a01b031681565b6040516001600160a01b039091168152602001610160565b61014b61021b36600461102e565b6108c2565b610156600a5481565b61015661023736600461102e565b600c6020526000908152604090205481565b61015660095481565b61015661026036600461102e565b6000908152600c602052604090205490565b61015661028036600461102e565b60066020526000908152604090205481565b6102a56102a036600461100a565b6108f6565b6040516101609190611047565b600d54610156565b6102cd6102c836600461100a565b610a1f565b6040519015158152602001610160565b6000546101f5906001600160a01b031681565b6102cd6102fe36600461100a565b60026020526000908152604090205460ff1681565b61015661032136600461100a565b610a5a565b61014b61033436600461100a565b610b82565b61014b61034736600461102e565b610c22565b61014b61035a36600461108b565b610c88565b6000546001600160a01b031633148061038757503360009081526002602052604090205460ff165b6103ac5760405162461bcd60e51b81526004016103a3906110c9565b60405180910390fd5b60018060008282546103be9190611105565b9091555050600154826103d9576103d482610c22565b610720565b6000828152600c60205260409020546103f3906001611105565b6000838152600c6020526040902055600d5415806104125750600d5482115b8061041b575060005b806104265750606483105b1561046d57600080546001600160a01b031681526005602052604090205461044f908490611105565b600080546001600160a01b0316815260056020526040902055610720565b600083815b600d5481101561068b576000806000600d84815481106104945761049461111d565b9060005260206000200180546104a990611133565b80601f01602080910402602001604051908101604052809291908181526020018280546104d590611133565b80156105225780601f106104f757610100808354040283529160200191610522565b820191906000526020600020905b81548152906001019060200180831161050557829003601f168201915b505050505080602001905181019061053a9190611168565b91945092509050816105a45760405162461bcd60e51b815260206004820152602d60248201527f50726563656e74616765206973206c657373207468616e207a65726f206f722060448201526c657175616c20746f207a65726f60981b60648201526084016103a3565b8088146105b357505050610679565b6000826105c160648c61119f565b6105cb91906111c1565b9050600081116106275760405162461bcd60e51b815260206004820152602160248201527f50726f666974206973206c657373207468616e206f7220657175616c207a65726044820152606f60f81b60648201526084016103a3565b6001600160a01b03841660009081526005602052604090205461064b908290611105565b6001600160a01b03851660009081526005602052604090205561066e81876111e0565b955060019650505050505b80610683816111f7565b915050610472565b50816106d95760405162461bcd60e51b815260206004820152601d60248201527f646964206e6f7420696e6372656d656e7420616e792070726f6669747300000060448201526064016103a3565b801561071d57600080546001600160a01b0316815260056020526040902054610703908290611105565b600080546001600160a01b03168152600560205260409020555b50505b600154811461072e57600080fd5b505050565b6000546001600160a01b0316331461075d5760405162461bcd60e51b81526004016103a390611212565b805161076857600080fd5b60005b81518110156107c65760016002600084848151811061078c5761078c61111d565b6020908102919091018101516001600160a01b03168252810191909152604001600020805460ff191691151591909117905560010161076b565b5050565b6000546001600160a01b031633146107f45760405162461bcd60e51b81526004016103a390611212565b604080516000808252602082019092529061081f565b606081526020019060019003908161080a5790505b50805161083491600d91602090910190610d6a565b50565b6000546001600160a01b031633146108615760405162461bcd60e51b81526004016103a390611212565b604080516001600160a01b038516602082015290810183905260608101829052600d9060800160408051601f198184030181529190528154600181018355600092835260209283902082516108bc9491909201920190610dc7565b50505050565b6000546001600160a01b031633146108ec5760405162461bcd60e51b81526004016103a390611212565b6007805460095555565b606060005b600d54811015610a19576000806000600d848154811061091d5761091d61111d565b90600052602060002001805461093290611133565b80601f016020809104026020016040519081016040528092919081815260200182805461095e90611133565b80156109ab5780601f10610980576101008083540402835291602001916109ab565b820191906000526020600020905b81548152906001019060200180831161098e57829003601f168201915b50505050508060200190518101906109c39190611168565b925092509250856001600160a01b0316836001600160a01b03161415610a0357818582815181106109f6576109f661111d565b6020026020010181815250505b5050508080610a11906111f7565b9150506108fb565b50919050565b600080546001600160a01b0383811691161480610a5457506001600160a01b03821660009081526002602052604090205460ff165b92915050565b600080546001600160a01b0316331480610a8357503360009081526002602052604090205460ff165b610a9f5760405162461bcd60e51b81526004016103a3906110c9565b6001806000828254610ab19190611105565b90915550506001546001600160a01b038316600090815260056020526040902054610b195760405162461bcd60e51b8152602060048201526018602482015277496e76616c6964206f7220456d707479206164647265737360401b60448201526064016103a3565b6001600160a01b03831660008181526005602090815260408083208054908490558151818152928301939093529194507f2cbba200147d9b2ecc06e0ff06af07d3630a1d26383fb0b6385fa32a327b7822910160405180910390a26001548114610a1957600080fd5b6000546001600160a01b03163314610bac5760405162461bcd60e51b81526004016103a390611212565b600080546001600160a01b03908116825260026020526040808320805460ff1990811690915583546001600160a01b03191692851692831784558284528184208054909116600117905551909133917f93091b3f3cd424efabc74e181f3799f3476ed758412561ed3b29515c51f567529190a350565b6000546001600160a01b0316331480610c4a57503360009081526002602052604090205460ff165b610c665760405162461bcd60e51b81526004016103a3906110c9565b6000818152600660205260408120805491610c80836111f7565b919050555050565b6000546001600160a01b03163314610cb25760405162461bcd60e51b81526004016103a390611212565b6000546001600160a01b0383811691161415610d095760405162461bcd60e51b815260206004820152601660248201527531b0b73737ba1036b7b234b33c903232b83637bcb2b960511b60448201526064016103a3565b6001600160a01b038216600081815260026020908152604091829020805460ff1916851515908117909155915191825233917ff38de818d000d07d091732dd783c6855722d7bc1934d92b7635133289d341695910160405180910390a35050565b828054828255906000526020600020908101928215610db7579160200282015b82811115610db75782518051610da7918491602090910190610dc7565b5091602001919060010190610d8a565b50610dc3929150610e47565b5090565b828054610dd390611133565b90600052602060002090601f016020900481019282610df55760008555610e3b565b82601f10610e0e57805160ff1916838001178555610e3b565b82800160010185558215610e3b579182015b82811115610e3b578251825591602001919060010190610e20565b50610dc3929150610e64565b80821115610dc3576000610e5b8282610e79565b50600101610e47565b5b80821115610dc35760008155600101610e65565b508054610e8590611133565b6000825580601f10610e95575050565b601f0160209004906000526020600020908101906108349190610e64565b60008060408385031215610ec657600080fd5b50508035926020909101359150565b634e487b7160e01b600052604160045260246000fd5b6001600160a01b038116811461083457600080fd5b8035610f0b81610eeb565b919050565b60006020808385031215610f2357600080fd5b823567ffffffffffffffff80821115610f3b57600080fd5b818501915085601f830112610f4f57600080fd5b813581811115610f6157610f61610ed5565b8060051b604051601f19603f83011681018181108582111715610f8657610f86610ed5565b604052918252848201925083810185019188831115610fa457600080fd5b938501935b82851015610fc957610fba85610f00565b84529385019392850192610fa9565b98975050505050505050565b600080600060608486031215610fea57600080fd5b8335610ff581610eeb565b95602085013595506040909401359392505050565b60006020828403121561101c57600080fd5b813561102781610eeb565b9392505050565b60006020828403121561104057600080fd5b5035919050565b6020808252825182820181905260009190848201906040850190845b8181101561107f57835183529284019291840191600101611063565b50909695505050505050565b6000806040838503121561109e57600080fd5b82356110a981610eeb565b9150602083013580151581146110be57600080fd5b809150509250929050565b6020808252600c908201526b1b9bdd08185c1c1c9bdd995960a21b604082015260600190565b634e487b7160e01b600052601160045260246000fd5b60008219821115611118576111186110ef565b500190565b634e487b7160e01b600052603260045260246000fd5b600181811c9082168061114757607f821691505b60208210811415610a1957634e487b7160e01b600052602260045260246000fd5b60008060006060848603121561117d57600080fd5b835161118881610eeb565b602085015160409095015190969495509392505050565b6000826111bc57634e487b7160e01b600052601260045260246000fd5b500490565b60008160001904831182151516156111db576111db6110ef565b500290565b6000828210156111f2576111f26110ef565b500390565b600060001982141561120b5761120b6110ef565b5060010190565b6020808252600c908201526b3737ba103232b83637bcb2b960a11b60408201526060019056fea2646970667358221220bd47d74497325a58dfb57c62da1cdf19fb0ab66572311d5648a67f0975fb483964736f6c634300080c0033";
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
            readonly name: "addr";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "percentage";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "splitType";
            readonly type: "uint256";
        }];
        readonly name: "addSplit";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
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
            readonly name: "splitType";
            readonly type: "uint256";
        }];
        readonly name: "getCount";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getSplitCount";
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
        readonly name: "getSplits";
        readonly outputs: readonly [{
            readonly internalType: "uint256[]";
            readonly name: "split";
            readonly type: "uint256[]";
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
        readonly inputs: readonly [];
        readonly name: "resetSplits";
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
    static createInterface(): SplitRoyaltyInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): SplitRoyalty;
}
export {};
//# sourceMappingURL=SplitRoyalty__factory.d.ts.map