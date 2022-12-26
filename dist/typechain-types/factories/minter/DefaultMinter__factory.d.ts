import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { DefaultMinter, DefaultMinterInterface } from "../../minter/DefaultMinter";
type DefaultMinterConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class DefaultMinter__factory extends ContractFactory {
    constructor(...args: DefaultMinterConstructorParams);
    deploy(valuesContract: PromiseOrValue<string>, storageContract: PromiseOrValue<string>, assetContract: PromiseOrValue<string>, randomNumberContract: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<DefaultMinter>;
    getDeployTransaction(valuesContract: PromiseOrValue<string>, storageContract: PromiseOrValue<string>, assetContract: PromiseOrValue<string>, randomNumberContract: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): DefaultMinter;
    connect(signer: Signer): DefaultMinter__factory;
    static readonly bytecode = "0x60806040523480156200001157600080fd5b5060405162001bb938038062001bb98339810160408190526200003491620000cc565b60008054336001600160a01b0319918216811783558252600260205260408220805460ff19166001908117909155919091556004805482166001600160a01b03968716179055600580548216948616949094179093556003805484169285169290921790915560068054909216921691909117905562000129565b80516001600160a01b0381168114620000c757600080fd5b919050565b60008060008060808587031215620000e357600080fd5b620000ee85620000af565b9350620000fe60208601620000af565b92506200010e60408601620000af565b91506200011e60608601620000af565b905092959194509250565b611a8080620001396000396000f3fe608060405234801561001057600080fd5b50600436106100d05760003560e01c80630c380cf0146100d557806310a8c7a9146101055780631a5dad511461011a5780631bc8bf931461013b5780634c7394761461015b578063573f86001461016e5780636fa13f3c146101815780639bb2ad8814610194578063aed5ef82146101a7578063d15d4150146101ba578063d5f39488146101dd578063d8b964e6146101f0578063ec2b46c314610213578063f2fde38b14610226578063fe528b1814610239578063fe684c0e1461024c575b600080fd5b6004546100e8906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b610118610113366004611046565b61025f565b005b61012d6101283660046110f6565b6102ff565b6040519081526020016100fc565b61014e610149366004611156565b6108b5565b6040516100fc9190611404565b610118610169366004611417565b610a29565b6003546100e8906001600160a01b031681565b61011861018f366004611417565b610a8f565b61014e6101a2366004611434565b610af5565b6006546100e8906001600160a01b031681565b6101cd6101c8366004611417565b610c90565b60405190151581526020016100fc565b6000546100e8906001600160a01b031681565b6101cd6101fe366004611417565b60026020526000908152604090205460ff1681565b6005546100e8906001600160a01b031681565b610118610234366004611417565b610cc7565b610118610247366004611417565b610d67565b61011861025a36600461147f565b610dcd565b6000546001600160a01b031633146102925760405162461bcd60e51b8152600401610289906114b2565b60405180910390fd5b805161029d57600080fd5b60005b81518110156102fb576001600260008484815181106102c1576102c16114d8565b6020908102919091018101516001600160a01b03168252810191909152604001600020805460ff19169115159190911790556001016102a0565b5050565b600080546001600160a01b031633148061032857503360009081526002602052604090205460ff165b6103445760405162461bcd60e51b8152600401610289906114ee565b6004805460405163e7b6dac960e01b8152602092810192909252600c60248301526b1c1c995d9a595dd0dbdd5b9d60a21b60448301526001600160a01b03169063e7b6dac990606401602060405180830381865afa1580156103aa573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103ce9190611514565b9050806103da576108af565b6006546004805460405163e7b6dac960e01b81526000936001600160a01b039081169363a0d0ca0f939091169163e7b6dac99161043591016020808252600990820152681b985b5950dbdd5b9d60ba1b604082015260600190565b602060405180830381865afa158015610452573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104769190611514565b6040518263ffffffff1660e01b815260040161049491815260200190565b6020604051808303816000875af11580156104b3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104d79190611514565b60035460065460405163433ee8cd60e01b81529293506000926001600160a01b039283169263433ee8cd92610514928a929091169060040161152d565b6000604051808303816000875af1158015610533573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261055b91908101906116af565b905060006106276000600360009054906101000a90046001600160a01b03166001600160a01b03166346e4e7c96040518163ffffffff1660e01b8152600401602060405180830381865afa1580156105b7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105db91906117a9565b602085015160408601516060870151608088015160a08901518c60005b604051908082528060200260200182016040528015610621578160200160208202803683370190505b50610eaf565b600554604051632adccb2560e21b81529192506001600160a01b03169063ab732c949061065d90889060009086906004016117c6565b600060405180830381600087803b15801561067757600080fd5b505af115801561068b573d6000803e3d6000fd5b506001925050505b848163ffffffff1610156108aa5763ffffffff811660408084019190915260035483516006549251638e6e826d60e01b81526001600160a01b0392831693638e6e826d936106e7939291169060040161152d565b6000604051808303816000875af1158015610706573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261072e91908101906117f6565b60c0830152600354825160065460405163eb2c2da360e01b81526001600160a01b039384169363eb2c2da39361076b93909291169060040161152d565b6000604051808303816000875af115801561078a573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526107b291908101906117f6565b6080830152600354600654604051632637f35160e11b8152600481018790526001600160a01b039182166024820152911690634c6fe6a2906044016000604051808303816000875af115801561080c573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526108349190810190611832565b60e0830152600554604051632adccb2560e21b81526001600160a01b039091169063ab732c949061086d90899085908790600401611866565b600060405180830381600087803b15801561088757600080fd5b505af115801561089b573d6000803e3d6000fd5b50505050806001019050610693565b505050505b92915050565b6108bd610f13565b6000546001600160a01b03163314806108e557503360009081526002602052604090205460ff165b6109015760405162461bcd60e51b8152600401610289906114ee565b60035460065460405163433ee8cd60e01b81526000926001600160a01b039081169263433ee8cd92610939928a92169060040161152d565b6000604051808303816000875af1158015610958573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261098091908101906116af565b9050610a1e85600360009054906101000a90046001600160a01b03166001600160a01b03166346e4e7c96040518163ffffffff1660e01b8152600401602060405180830381865afa1580156109d9573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109fd91906117a9565b602084015160408501516060860151608087015160a08801518b60006105f8565b9150505b9392505050565b6000546001600160a01b0316331480610a5157503360009081526002602052604090205460ff165b610a6d5760405162461bcd60e51b8152600401610289906114ee565b600580546001600160a01b0319166001600160a01b0392909216919091179055565b6000546001600160a01b0316331480610ab757503360009081526002602052604090205460ff165b610ad35760405162461bcd60e51b8152600401610289906114ee565b600680546001600160a01b0319166001600160a01b0392909216919091179055565b610afd610f13565b6000546001600160a01b0316331480610b2557503360009081526002602052604090205460ff165b610b415760405162461bcd60e51b8152600401610289906114ee565b60055460405163fccc3cd560e01b81526001600160a01b03848116600483015263ffffffff87166024830152600092169063fccc3cd590604401600060405180830381865afa158015610b98573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610bc09190810190611905565b9050826001600160a01b031681606001516001600160a01b031614610c135760405162461bcd60e51b81526020600482015260096024820152683130b21037bbb732b960b91b6044820152606401610289565b8463ffffffff16816040015163ffffffff1614610c5e5760405162461bcd60e51b81526020600482015260096024820152680c4c2c840d2dcc8caf60bb1b6044820152606401610289565b610a1e84826000015183602001518460c001518560e0015186608001518760a001518860600151896101000151610eaf565b600080546001600160a01b03838116911614806108af5750506001600160a01b031660009081526002602052604090205460ff1690565b6000546001600160a01b03163314610cf15760405162461bcd60e51b8152600401610289906114b2565b600080546001600160a01b03908116825260026020526040808320805460ff1990811690915583546001600160a01b03191692851692831784558284528184208054909116600117905551909133917f93091b3f3cd424efabc74e181f3799f3476ed758412561ed3b29515c51f567529190a350565b6000546001600160a01b0316331480610d8f57503360009081526002602052604090205460ff165b610dab5760405162461bcd60e51b8152600401610289906114ee565b600380546001600160a01b0319166001600160a01b0392909216919091179055565b6000546001600160a01b03163314610df75760405162461bcd60e51b8152600401610289906114b2565b6000546001600160a01b0383811691161415610e4e5760405162461bcd60e51b815260206004820152601660248201527531b0b73737ba1036b7b234b33c903232b83637bcb2b960511b6044820152606401610289565b6001600160a01b038216600081815260026020908152604091829020805460ff1916851515908117909155915191825233917ff38de818d000d07d091732dd783c6855722d7bc1934d92b7635133289d341695910160405180910390a35050565b610eb7610f13565b50604080516101208101825263ffffffff998a168152978916602089015298909716978601979097526001600160a01b039096166060850152608084015260a083019490945260c082015260e081019290925261010082015290565b604051806101200160405280600063ffffffff168152602001600063ffffffff168152602001600063ffffffff16815260200160006001600160a01b0316815260200160608152602001606081526020016060815260200160608152602001606081525090565b634e487b7160e01b600052604160045260246000fd5b60405160c081016001600160401b0381118282101715610fb257610fb2610f7a565b60405290565b60405161012081016001600160401b0381118282101715610fb257610fb2610f7a565b604051601f8201601f191681016001600160401b038111828210171561100357611003610f7a565b604052919050565b60006001600160401b0382111561102457611024610f7a565b5060051b60200190565b6001600160a01b038116811461104357600080fd5b50565b6000602080838503121561105957600080fd5b82356001600160401b0381111561106f57600080fd5b8301601f8101851361108057600080fd5b803561109361108e8261100b565b610fdb565b81815260059190911b820183019083810190878311156110b257600080fd5b928401925b828410156110d95783356110ca8161102e565b825292840192908401906110b7565b979650505050505050565b63ffffffff8116811461104357600080fd5b6000806040838503121561110957600080fd5b8235611114816110e4565b915060208301356111248161102e565b809150509250929050565b60006001600160401b0382111561114857611148610f7a565b50601f01601f191660200190565b60008060006060848603121561116b57600080fd5b8335611176816110e4565b925060208401356111868161102e565b915060408401356001600160401b038111156111a157600080fd5b8401601f810186136111b257600080fd5b80356111c061108e8261112f565b8181528760208385010111156111d557600080fd5b816020840160208301376000602083830101528093505050509250925092565b600081518084526020808501945080840160005b8381101561122b57815163ffffffff1687529582019590820190600101611209565b509495945050505050565b60005b83811015611251578181015183820152602001611239565b83811115611260576000848401525b50505050565b6000815180845261127e816020860160208601611236565b601f01601f19169290920160200192915050565b600081518084526020808501808196508360051b8101915082860160005b858110156112da5782840389526112c8848351611266565b988501989350908401906001016112b0565b5091979650505050505050565b600081518084526020808501945080840160005b8381101561122b5781516001600160a01b0316875295820195908201906001016112fb565b805163ffffffff16825260006101206020830151611346602086018263ffffffff169052565b50604083015161135e604086018263ffffffff169052565b50606083015161137960608601826001600160a01b03169052565b506080830151816080860152611391828601826111f5565b91505060a083015184820360a08601526113ab8282611266565b91505060c083015184820360c08601526113c582826111f5565b91505060e083015184820360e08601526113df8282611292565b91505061010080840151858303828701526113fa83826112e7565b9695505050505050565b602081526000610a226020830184611320565b60006020828403121561142957600080fd5b8135610a228161102e565b60008060006060848603121561144957600080fd5b8335611454816110e4565b92506020840135611464816110e4565b915060408401356114748161102e565b809150509250925092565b6000806040838503121561149257600080fd5b823561149d8161102e565b91506020830135801515811461112457600080fd5b6020808252600c908201526b3737ba103232b83637bcb2b960a11b604082015260600190565b634e487b7160e01b600052603260045260246000fd5b6020808252600c908201526b1b9bdd08185c1c1c9bdd995960a21b604082015260600190565b60006020828403121561152657600080fd5b5051919050565b63ffffffff9290921682526001600160a01b0316602082015260400190565b8051611557816110e4565b919050565b600082601f83011261156d57600080fd5b8151602061157d61108e8361100b565b82815260059290921b8401810191818101908684111561159c57600080fd5b8286015b848110156115c05780516115b3816110e4565b83529183019183016115a0565b509695505050505050565b60006115d961108e8461112f565b90508281528383830111156115ed57600080fd5b610a22836020830184611236565b600082601f83011261160c57600080fd5b8151602061161c61108e8361100b565b82815260059290921b8401810191818101908684111561163b57600080fd5b8286015b848110156115c05780516001600160401b0381111561165e5760008081fd5b8701603f810189136116705760008081fd5b6116818986830151604084016115cb565b84525091830191830161163f565b600082601f8301126116a057600080fd5b610a22838351602085016115cb565b6000602082840312156116c157600080fd5b81516001600160401b03808211156116d857600080fd5b9083019060c082860312156116ec57600080fd5b6116f4610f90565b6116fd8361154c565b815261170b6020840161154c565b602082015260408301518281111561172257600080fd5b61172e8782860161155c565b60408301525060608301518281111561174657600080fd5b611752878286016115fb565b60608301525060808301518281111561176a57600080fd5b6117768782860161155c565b60808301525060a08301518281111561178e57600080fd5b61179a8782860161168f565b60a08301525095945050505050565b6000602082840312156117bb57600080fd5b8151610a22816110e4565b60018060a01b03841681528260208201526060604082015260006117ed6060830184611320565b95945050505050565b60006020828403121561180857600080fd5b81516001600160401b0381111561181e57600080fd5b61182a8482850161155c565b949350505050565b60006020828403121561184457600080fd5b81516001600160401b0381111561185a57600080fd5b61182a848285016115fb565b6001600160a01b038416815263ffffffff831660208201526060604082018190526000906117ed90830184611320565b80516115578161102e565b600082601f8301126118b257600080fd5b815160206118c261108e8361100b565b82815260059290921b840181019181810190868411156118e157600080fd5b8286015b848110156115c05780516118f88161102e565b83529183019183016118e5565b60006020828403121561191757600080fd5b81516001600160401b038082111561192e57600080fd5b90830190610120828603121561194357600080fd5b61194b610fb8565b6119548361154c565b81526119626020840161154c565b60208201526119736040840161154c565b604082015261198460608401611896565b606082015260808301518281111561199b57600080fd5b6119a78782860161155c565b60808301525060a0830151828111156119bf57600080fd5b6119cb8782860161168f565b60a08301525060c0830151828111156119e357600080fd5b6119ef8782860161155c565b60c08301525060e083015182811115611a0757600080fd5b611a13878286016115fb565b60e0830152506101008084015183811115611a2d57600080fd5b611a39888287016118a1565b91830191909152509594505050505056fea2646970667358221220e7a3a2ce674a342c14a0521233ce707ee6b67e89b4429e3120c1c407912bdf3f64736f6c634300080c0033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "valuesContract";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "storageContract";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "assetContract";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "randomNumberContract";
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
        readonly name: "assetController";
        readonly outputs: readonly [{
            readonly internalType: "contract Asset";
            readonly name: "";
            readonly type: "address";
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
            readonly internalType: "uint32";
            readonly name: "currentTokenId";
            readonly type: "uint32";
        }, {
            readonly internalType: "address";
            readonly name: "sender";
            readonly type: "address";
        }];
        readonly name: "getPreview";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "previewCount";
            readonly type: "uint256";
        }];
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
        readonly inputs: readonly [{
            readonly internalType: "uint32";
            readonly name: "currentTokenId";
            readonly type: "uint32";
        }, {
            readonly internalType: "address";
            readonly name: "sender";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly name: "mint";
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
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint32";
            readonly name: "index";
            readonly type: "uint32";
        }, {
            readonly internalType: "uint32";
            readonly name: "currentTokenId";
            readonly type: "uint32";
        }, {
            readonly internalType: "address";
            readonly name: "sender";
            readonly type: "address";
        }];
        readonly name: "mintPreview";
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
        readonly name: "randomNumberController";
        readonly outputs: readonly [{
            readonly internalType: "contract RandomNumber";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "assetContract";
            readonly type: "address";
        }];
        readonly name: "setAssetController";
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
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "randomNumberContract";
            readonly type: "address";
        }];
        readonly name: "setRandomNumberController";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "storageContract";
            readonly type: "address";
        }];
        readonly name: "setStorageController";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
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
        readonly name: "valuesController";
        readonly outputs: readonly [{
            readonly internalType: "contract InfinityMintValues";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): DefaultMinterInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): DefaultMinter;
}
export {};
//# sourceMappingURL=DefaultMinter__factory.d.ts.map