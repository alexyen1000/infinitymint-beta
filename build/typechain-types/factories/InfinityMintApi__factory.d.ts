import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { InfinityMintApi, InfinityMintApiInterface } from "../InfinityMintApi";
type InfinityMintApiConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class InfinityMintApi__factory extends ContractFactory {
    constructor(...args: InfinityMintApiConstructorParams);
    deploy(erc721Destination: PromiseOrValue<string>, storageestination: PromiseOrValue<string>, assetDestination: PromiseOrValue<string>, valuesDestination: PromiseOrValue<string>, royaltyDestination: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<InfinityMintApi>;
    getDeployTransaction(erc721Destination: PromiseOrValue<string>, storageestination: PromiseOrValue<string>, assetDestination: PromiseOrValue<string>, valuesDestination: PromiseOrValue<string>, royaltyDestination: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): InfinityMintApi;
    connect(signer: Signer): InfinityMintApi__factory;
    static readonly bytecode = "0x60806040523480156200001157600080fd5b5060405162001c3f38038062001c3f8339810160408190526200003491620000b4565b600080546001600160a01b03199081166001600160a01b0397881617909155600180548216958716959095179094556002805485169386169390931790925560038054841691851691909117905560048054909216921691909117905562000124565b80516001600160a01b0381168114620000af57600080fd5b919050565b600080600080600060a08688031215620000cd57600080fd5b620000d88662000097565b9450620000e86020870162000097565b9350620000f86040870162000097565b9250620001086060870162000097565b9150620001186080870162000097565b90509295509295909350565b611b0b80620001346000396000f3fe608060405234801561001057600080fd5b506004361061011d5760003560e01c80630c380cf0146101225780630e4937351461014b578063105c48131461016c5780631703c0001461017f57806318160ddd146101975780631e3edcf91461019f5780631f21bfbf146101bf57806323b7ec3b146101d457806329fd769e146101e75780633aec3519146101fa5780633ebdfda11461020d578063573f86001461022d57806370a08231146102405780639437b1121461025357806395ded45c1461026657806398d5fdca14610279578063bca6ce6414610281578063c04a479114610294578063c71040d7146102a7578063d8a26e3a146102c7578063e5725968146102da578063ec2b46c3146102ed578063ef5bee3b14610300575b600080fd5b600354610135906001600160a01b031681565b6040516101429190611164565b60405180910390f35b61015e61015936600461118d565b610313565b604051908152602001610142565b600454610135906001600160a01b031681565b6101876103ef565b6040519015158152602001610142565b61015e61046c565b6101b26101ad3660046111bf565b6104f3565b604051610142919061121d565b6101c7610754565b6040516101429190611230565b6101356101e236600461118d565b6107cb565b6101356101f536600461118d565b610888565b61013561020836600461118d565b610922565b61022061021b36600461118d565b610981565b604051610142919061132b565b600254610135906001600160a01b031681565b61015e61024e3660046111bf565b610a06565b61015e6102613660046111bf565b610a78565b6101b26102743660046111bf565b610bc1565b61015e610d17565b600054610135906001600160a01b031681565b6101876102a23660046111bf565b610d6c565b6102ba6102b536600461118d565b610de6565b604051610142919061141f565b6102206102d536600461118d565b610ef1565b61015e6102e83660046111bf565b610f29565b600154610135906001600160a01b031681565b61013561030e366004611432565b610f5a565b600080610321836000610f5a565b90506001600160a01b03811661033a5750600092915050565b60408051600481526024810182526020810180516001600160e01b031663c6e48e2360e01b179052905160009182916001600160a01b0385169161037d9161145e565b600060405180830381855afa9150503d80600081146103b8576040519150601f19603f3d011682016040523d82523d6000602084013e6103bd565b606091505b5091509150816103d257506000949350505050565b808060200190518101906103e6919061147a565b95945050505050565b60008060009054906101000a90046001600160a01b03166001600160a01b0316637817d7c06040518163ffffffff1660e01b8152600401602060405180830381865afa158015610443573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104679190611493565b905090565b60035460405163e7b6dac960e01b81526020600482015260096024820152686d6178537570706c7960b81b60448201526000916001600160a01b03169063e7b6dac990606401602060405180830381865afa1580156104cf573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610467919061147a565b60606001600160a01b03821661055e5760405162461bcd60e51b815260206004820152602560248201527f63616e6e6f74207669657720707265766965777320666f72206e756c6c206164604482015264647265737360d81b60648201526084015b60405180910390fd5b60015460035460405163e7b6dac960e01b81526000926001600160a01b0390811692636407a4009287929091169063e7b6dac99061059e906004016114b5565b602060405180830381865afa1580156105bb573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105df919061147a565b6040518363ffffffff1660e01b81526004016105fc9291906114db565b600060405180830381865afa158015610619573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610641919081019061189a565b90506000805b825181101561069d57846001600160a01b031683828151811061066c5761066c61194a565b6020026020010151606001516001600160a01b03161415610695578161069181611960565b9250505b600101610647565b50801561073e576000816001600160401b038111156106be576106be6114f4565b6040519080825280602002602001820160405280156106e7578160200160208202803683370190505b5090506000915060005b83518110156107355780828461070681611960565b9550815181106107185761071861194a565b63ffffffff909216602092830291909101909101526001016106f1565b50949350505050565b6040805160008082526020820190925290610735565b60008060009054906101000a90046001600160a01b03166001600160a01b0316629a9b7b6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156107a7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104679190611989565b60015460405163310d91f160e11b81526000916001600160a01b03169063621b23e2906107fc908590600401611230565b602060405180830381865afa158015610819573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061083d91906119a6565b90506001600160a01b0381166108835760405162461bcd60e51b815260206004820152600b60248201526a626164206164647265737360a81b6044820152606401610555565b919050565b60035460405163e7b6dac960e01b815260206004820152600f60248201526e0d8d2dcd6aec2d8d8cae892dcc8caf608b1b604482015260009161091c9184916001600160a01b03169063e7b6dac9906064015b602060405180830381865afa1580156108f8573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061030e919061147a565b50919050565b60035460405163e7b6dac960e01b81526020600482015260116024820152700d8d2dcd6a6e8d2c6d6cae4e692dcc8caf607b1b604482015260009161097b9184916001600160a01b03169063e7b6dac9906064016108db565b92915050565b6109896110fd565b60015460405163fccc3cd560e01b815233600482015263ffffffff841660248201526001600160a01b039091169063fccc3cd5906044015b600060405180830381865afa1580156109de573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261097b91908101906119c3565b600080546040516370a0823160e01b81526001600160a01b03909116906370a0823190610a37908590600401611164565b602060405180830381865afa158015610a54573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061097b919061147a565b60015460035460405163e7b6dac960e01b815260009283926001600160a01b0391821692636407a400928792169063e7b6dac990610ab8906004016114b5565b602060405180830381865afa158015610ad5573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610af9919061147a565b6040518363ffffffff1660e01b8152600401610b169291906114db565b600060405180830381865afa158015610b33573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610b5b919081019061189a565b90506000915060005b8151811015610bba57836001600160a01b0316828281518110610b8957610b8961194a565b6020026020010151606001516001600160a01b03161415610bb25782610bae81611960565b9350505b600101610b64565b5050919050565b6003546040516206259160e71b815260206004820152601760248201527664697361626c6552656769737465726564546f6b656e7360481b60448201526060916001600160a01b031690630312c88090606401602060405180830381865afa158015610c31573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c559190611493565b15610ca25760405162461bcd60e51b815260206004820152601d60248201527f616c6c20746f6b656e73206d6574686f642069732064697361626c65640000006044820152606401610555565b60015460405163495c94dd60e01b81526001600160a01b039091169063495c94dd90610cd2908590600401611164565b600060405180830381865afa158015610cef573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261097b91908101906119ff565b6000600460009054906101000a90046001600160a01b03166001600160a01b0316637ff9b5966040518163ffffffff1660e01b8152600401602060405180830381865afa1580156104cf573d6000803e3d6000fd5b600154604051631cae4b2d60e31b81526000916001600160a01b03169063e572596890610d9d908590600401611164565b602060405180830381865afa158015610dba573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610dde919061147a565b421092915050565b60005460408051629a9b7b60e01b815290516060926001600160a01b031691629a9b7b9160048083019260209291908290030181865afa158015610e2e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e529190611989565b63ffffffff168263ffffffff1610610e6957600080fd5b600154604051636c51371d60e11b81526000916001600160a01b03169063d8a26e3a90610e9a908690600401611230565b600060405180830381865afa158015610eb7573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610edf91908101906119c3565b9050610eea81611086565b9392505050565b610ef96110fd565b600154604051636c51371d60e11b81526001600160a01b039091169063d8a26e3a906109c1908590600401611230565b600154604051631cae4b2d60e31b81526000916001600160a01b03169063e572596890610a37908590600401611164565b600154604051636c51371d60e11b81526000916001600160a01b03169063d8a26e3a90610f8b908690600401611230565b600060405180830381865afa158015610fa8573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610fd091908101906119c3565b6101000151518363ffffffff161115610feb5750600061097b565b600154604051636c51371d60e11b81526001600160a01b039091169063d8a26e3a9061101b908690600401611230565b600060405180830381865afa158015611038573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261106091908101906119c3565b610100015182815181106110765761107661194a565b6020026020010151905092915050565b6060816000015182602001518360400151846060015185608001516040516020016110b1919061121d565b60408051601f198184030181529082905260a088015160c089015160e08a01516101008b01516110e79998979695602001611a33565b6040516020818303038152906040529050919050565b604051806101200160405280600063ffffffff168152602001600063ffffffff168152602001600063ffffffff16815260200160006001600160a01b0316815260200160608152602001606081526020016060815260200160608152602001606081525090565b6001600160a01b0391909116815260200190565b63ffffffff8116811461118a57600080fd5b50565b60006020828403121561119f57600080fd5b8135610eea81611178565b6001600160a01b038116811461118a57600080fd5b6000602082840312156111d157600080fd5b8135610eea816111aa565b600081518084526020808501945080840160005b8381101561121257815163ffffffff16875295820195908201906001016111f0565b509495945050505050565b602081526000610eea60208301846111dc565b63ffffffff91909116815260200190565b60005b8381101561125c578181015183820152602001611244565b8381111561126b576000848401525b50505050565b60008151808452611289816020860160208601611241565b601f01601f19169290920160200192915050565b600081518084526020808501808196508360051b8101915082860160005b858110156112e55782840389526112d3848351611271565b988501989350908401906001016112bb565b5091979650505050505050565b600081518084526020808501945080840160005b838110156112125781516001600160a01b031687529582019590820190600101611306565b6020815261134260208201835163ffffffff169052565b6000602083015161135b604084018263ffffffff169052565b50604083015163ffffffff811660608401525060608301516001600160a01b03811660808401525060808301516101208060a085015261139f6101408501836111dc565b915060a0850151601f19808685030160c08701526113bd8483611271565b935060c08701519150808685030160e08701526113da84836111dc565b935060e087015191506101008187860301818801526113f9858461129d565b90880151878203909201848801529350905061141583826112f2565b9695505050505050565b602081526000610eea6020830184611271565b6000806040838503121561144557600080fd5b823561145081611178565b946020939093013593505050565b60008251611470818460208701611241565b9190910192915050565b60006020828403121561148c57600080fd5b5051919050565b6000602082840312156114a557600080fd5b81518015158114610eea57600080fd5b6020808252600c908201526b1c1c995d9a595dd0dbdd5b9d60a21b604082015260600190565b6001600160a01b03929092168252602082015260400190565b634e487b7160e01b600052604160045260246000fd5b60405161012081016001600160401b038111828210171561152d5761152d6114f4565b60405290565b604051601f8201601f191681016001600160401b038111828210171561155b5761155b6114f4565b604052919050565b60006001600160401b0382111561157c5761157c6114f4565b5060051b60200190565b805161088381611178565b8051610883816111aa565b600082601f8301126115ad57600080fd5b815160206115c26115bd83611563565b611533565b82815260059290921b840181019181810190868411156115e157600080fd5b8286015b848110156116055780516115f881611178565b83529183019183016115e5565b509695505050505050565b60006001600160401b03831115611629576116296114f4565b61163c601f8401601f1916602001611533565b905082815283838301111561165057600080fd5b610eea836020830184611241565b600082601f83011261166f57600080fd5b610eea83835160208501611610565b600082601f83011261168f57600080fd5b8151602061169f6115bd83611563565b82815260059290921b840181019181810190868411156116be57600080fd5b8286015b848110156116055780516001600160401b038111156116e15760008081fd5b8701603f810189136116f35760008081fd5b611704898683015160408401611610565b8452509183019183016116c2565b600082601f83011261172357600080fd5b815160206117336115bd83611563565b82815260059290921b8401810191818101908684111561175257600080fd5b8286015b84811015611605578051611769816111aa565b8352918301918301611756565b6000610120828403121561178957600080fd5b61179161150a565b905061179c82611586565b81526117aa60208301611586565b60208201526117bb60408301611586565b60408201526117cc60608301611591565b606082015260808201516001600160401b03808211156117eb57600080fd5b6117f78583860161159c565b608084015260a084015191508082111561181057600080fd5b61181c8583860161165e565b60a084015260c084015191508082111561183557600080fd5b6118418583860161159c565b60c084015260e084015191508082111561185a57600080fd5b6118668583860161167e565b60e08401526101009150818401518181111561188157600080fd5b61188d86828701611712565b8385015250505092915050565b600060208083850312156118ad57600080fd5b82516001600160401b03808211156118c457600080fd5b818501915085601f8301126118d857600080fd5b81516118e66115bd82611563565b81815260059190911b8301840190848101908883111561190557600080fd5b8585015b8381101561193d578051858111156119215760008081fd5b61192f8b89838a0101611776565b845250918601918601611909565b5098975050505050505050565b634e487b7160e01b600052603260045260246000fd5b600060001982141561198257634e487b7160e01b600052601160045260246000fd5b5060010190565b60006020828403121561199b57600080fd5b8151610eea81611178565b6000602082840312156119b857600080fd5b8151610eea816111aa565b6000602082840312156119d557600080fd5b81516001600160401b038111156119eb57600080fd5b6119f784828501611776565b949350505050565b600060208284031215611a1157600080fd5b81516001600160401b03811115611a2757600080fd5b6119f78482850161159c565b63ffffffff8a811682528981166020830152881660408201526001600160a01b038716606082015261012060808201819052600090611a7483820189611271565b905082810360a0840152611a888188611271565b905082810360c0840152611a9c81876111dc565b905082810360e0840152611ab0818661129d565b9050828103610100840152611ac581856112f2565b9c9b50505050505050505050505056fea264697066735822122089797a3cf8a5ef6ac0dbd367f32403a3af8078957ae9f7406457804e9628779864736f6c634300080c0033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "erc721Destination";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "storageestination";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "assetDestination";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "valuesDestination";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "royaltyDestination";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "addr";
            readonly type: "address";
        }];
        readonly name: "allPreviews";
        readonly outputs: readonly [{
            readonly internalType: "uint32[]";
            readonly name: "";
            readonly type: "uint32[]";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }];
        readonly name: "allTokens";
        readonly outputs: readonly [{
            readonly internalType: "uint32[]";
            readonly name: "tokens";
            readonly type: "uint32[]";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "assetController";
        readonly outputs: readonly [{
            readonly internalType: "contract Asset";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "sender";
            readonly type: "address";
        }];
        readonly name: "balanceOf";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "erc721";
        readonly outputs: readonly [{
            readonly internalType: "contract InfinityMint";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint32";
            readonly name: "tokenId";
            readonly type: "uint32";
        }];
        readonly name: "get";
        readonly outputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "uint32";
                readonly name: "pathId";
                readonly type: "uint32";
            }, {
                readonly internalType: "uint32";
                readonly name: "pathSize";
                readonly type: "uint32";
            }, {
                readonly internalType: "uint32";
                readonly name: "currentTokenId";
                readonly type: "uint32";
            }, {
                readonly internalType: "address";
                readonly name: "owner";
                readonly type: "address";
            }, {
                readonly internalType: "uint32[]";
                readonly name: "colours";
                readonly type: "uint32[]";
            }, {
                readonly internalType: "bytes";
                readonly name: "mintData";
                readonly type: "bytes";
            }, {
                readonly internalType: "uint32[]";
                readonly name: "assets";
                readonly type: "uint32[]";
            }, {
                readonly internalType: "string[]";
                readonly name: "names";
                readonly type: "string[]";
            }, {
                readonly internalType: "address[]";
                readonly name: "destinations";
                readonly type: "address[]";
            }];
            readonly internalType: "struct InfinityMintObject.InfinityObject";
            readonly name: "";
            readonly type: "tuple";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint32";
            readonly name: "tokenId";
            readonly type: "uint32";
        }];
        readonly name: "getBalanceOfWallet";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint32";
            readonly name: "tokenId";
            readonly type: "uint32";
        }, {
            readonly internalType: "uint256";
            readonly name: "index";
            readonly type: "uint256";
        }];
        readonly name: "getLink";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint32";
            readonly name: "index";
            readonly type: "uint32";
        }];
        readonly name: "getPreview";
        readonly outputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "uint32";
                readonly name: "pathId";
                readonly type: "uint32";
            }, {
                readonly internalType: "uint32";
                readonly name: "pathSize";
                readonly type: "uint32";
            }, {
                readonly internalType: "uint32";
                readonly name: "currentTokenId";
                readonly type: "uint32";
            }, {
                readonly internalType: "address";
                readonly name: "owner";
                readonly type: "address";
            }, {
                readonly internalType: "uint32[]";
                readonly name: "colours";
                readonly type: "uint32[]";
            }, {
                readonly internalType: "bytes";
                readonly name: "mintData";
                readonly type: "bytes";
            }, {
                readonly internalType: "uint32[]";
                readonly name: "assets";
                readonly type: "uint32[]";
            }, {
                readonly internalType: "string[]";
                readonly name: "names";
                readonly type: "string[]";
            }, {
                readonly internalType: "address[]";
                readonly name: "destinations";
                readonly type: "address[]";
            }];
            readonly internalType: "struct InfinityMintObject.InfinityObject";
            readonly name: "";
            readonly type: "tuple";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "addr";
            readonly type: "address";
        }];
        readonly name: "getPreviewCount";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "count";
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
        readonly name: "getPreviewTimestamp";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getPrice";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint32";
            readonly name: "tokenId";
            readonly type: "uint32";
        }];
        readonly name: "getRaw";
        readonly outputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint32";
            readonly name: "tokenId";
            readonly type: "uint32";
        }];
        readonly name: "getStickerContract";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "result";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint32";
            readonly name: "tokenId";
            readonly type: "uint32";
        }];
        readonly name: "getWalletContract";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "result";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "isMintsEnabled";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "sender";
            readonly type: "address";
        }];
        readonly name: "isPreviewBlocked";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint32";
            readonly name: "tokenId";
            readonly type: "uint32";
        }];
        readonly name: "ownerOf";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "result";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "royaltyController";
        readonly outputs: readonly [{
            readonly internalType: "contract Royalty";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "storageController";
        readonly outputs: readonly [{
            readonly internalType: "contract InfinityMintStorage";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalMints";
        readonly outputs: readonly [{
            readonly internalType: "uint32";
            readonly name: "";
            readonly type: "uint32";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalSupply";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "valuesController";
        readonly outputs: readonly [{
            readonly internalType: "contract InfinityMintValues";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): InfinityMintApiInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): InfinityMintApi;
}
export {};
//# sourceMappingURL=InfinityMintApi__factory.d.ts.map