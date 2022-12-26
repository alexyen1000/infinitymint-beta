"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectiveMinter__factory = void 0;
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
const ethers_1 = require("ethers");
const _abi = [
    {
        inputs: [
            {
                internalType: "address",
                name: "valuesContract",
                type: "address",
            },
            {
                internalType: "address",
                name: "storageContract",
                type: "address",
            },
            {
                internalType: "address",
                name: "assetContract",
                type: "address",
            },
            {
                internalType: "address",
                name: "randomNumberContract",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "changee",
                type: "address",
            },
            {
                indexed: false,
                internalType: "bool",
                name: "value",
                type: "bool",
            },
        ],
        name: "PermissionChange",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
            },
        ],
        name: "TransferedOwnership",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        name: "approved",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "assetController",
        outputs: [
            {
                internalType: "contract Asset",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "deployer",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint32",
                name: "currentTokenId",
                type: "uint32",
            },
            {
                internalType: "address",
                name: "sender",
                type: "address",
            },
        ],
        name: "getPreview",
        outputs: [
            {
                internalType: "uint256",
                name: "previewCount",
                type: "uint256",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "addr",
                type: "address",
            },
        ],
        name: "isAuthenticated",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint32",
                name: "currentTokenId",
                type: "uint32",
            },
            {
                internalType: "address",
                name: "sender",
                type: "address",
            },
            {
                internalType: "bytes",
                name: "mintData",
                type: "bytes",
            },
        ],
        name: "mint",
        outputs: [
            {
                components: [
                    {
                        internalType: "uint32",
                        name: "pathId",
                        type: "uint32",
                    },
                    {
                        internalType: "uint32",
                        name: "pathSize",
                        type: "uint32",
                    },
                    {
                        internalType: "uint32",
                        name: "currentTokenId",
                        type: "uint32",
                    },
                    {
                        internalType: "address",
                        name: "owner",
                        type: "address",
                    },
                    {
                        internalType: "uint32[]",
                        name: "colours",
                        type: "uint32[]",
                    },
                    {
                        internalType: "bytes",
                        name: "mintData",
                        type: "bytes",
                    },
                    {
                        internalType: "uint32[]",
                        name: "assets",
                        type: "uint32[]",
                    },
                    {
                        internalType: "string[]",
                        name: "names",
                        type: "string[]",
                    },
                    {
                        internalType: "address[]",
                        name: "destinations",
                        type: "address[]",
                    },
                ],
                internalType: "struct InfinityMintObject.InfinityObject",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint32",
                name: "index",
                type: "uint32",
            },
            {
                internalType: "uint32",
                name: "currentTokenId",
                type: "uint32",
            },
            {
                internalType: "address",
                name: "sender",
                type: "address",
            },
        ],
        name: "mintPreview",
        outputs: [
            {
                components: [
                    {
                        internalType: "uint32",
                        name: "pathId",
                        type: "uint32",
                    },
                    {
                        internalType: "uint32",
                        name: "pathSize",
                        type: "uint32",
                    },
                    {
                        internalType: "uint32",
                        name: "currentTokenId",
                        type: "uint32",
                    },
                    {
                        internalType: "address",
                        name: "owner",
                        type: "address",
                    },
                    {
                        internalType: "uint32[]",
                        name: "colours",
                        type: "uint32[]",
                    },
                    {
                        internalType: "bytes",
                        name: "mintData",
                        type: "bytes",
                    },
                    {
                        internalType: "uint32[]",
                        name: "assets",
                        type: "uint32[]",
                    },
                    {
                        internalType: "string[]",
                        name: "names",
                        type: "string[]",
                    },
                    {
                        internalType: "address[]",
                        name: "destinations",
                        type: "address[]",
                    },
                ],
                internalType: "struct InfinityMintObject.InfinityObject",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address[]",
                name: "addrs",
                type: "address[]",
            },
        ],
        name: "multiApprove",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "randomNumberController",
        outputs: [
            {
                internalType: "contract RandomNumber",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "assetContract",
                type: "address",
            },
        ],
        name: "setAssetController",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "addr",
                type: "address",
            },
            {
                internalType: "bool",
                name: "value",
                type: "bool",
            },
        ],
        name: "setPrivilages",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "randomNumberContract",
                type: "address",
            },
        ],
        name: "setRandomNumberController",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "storageContract",
                type: "address",
            },
        ],
        name: "setStorageController",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "storageController",
        outputs: [
            {
                internalType: "contract InfinityMintStorage",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "addr",
                type: "address",
            },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "valuesController",
        outputs: [
            {
                internalType: "contract InfinityMintValues",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];
const _bytecode = "0x60806040523480156200001157600080fd5b5060405162001be938038062001be98339810160408190526200003491620000cc565b60008054336001600160a01b0319918216811783558252600260205260408220805460ff19166001908117909155919091556004805482166001600160a01b03968716179055600580548216948616949094179093556003805484169285169290921790915560068054909216921691909117905562000129565b80516001600160a01b0381168114620000c757600080fd5b919050565b60008060008060808587031215620000e357600080fd5b620000ee85620000af565b9350620000fe60208601620000af565b92506200010e60408601620000af565b91506200011e60608601620000af565b905092959194509250565b611ab080620001396000396000f3fe608060405234801561001057600080fd5b50600436106100d05760003560e01c80630c380cf0146100d557806310a8c7a9146101055780631a5dad511461011a5780631bc8bf931461013b5780634c7394761461015b578063573f86001461016e5780636fa13f3c146101815780639bb2ad8814610194578063aed5ef82146101a7578063d15d4150146101ba578063d5f39488146101dd578063d8b964e6146101f0578063ec2b46c314610213578063f2fde38b14610226578063fe528b1814610239578063fe684c0e1461024c575b600080fd5b6004546100e8906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b610118610113366004611076565b61025f565b005b61012d610128366004611126565b6102ff565b6040519081526020016100fc565b61014e610149366004611186565b6108b5565b6040516100fc9190611434565b610118610169366004611447565b610a59565b6003546100e8906001600160a01b031681565b61011861018f366004611447565b610abf565b61014e6101a2366004611464565b610b25565b6006546100e8906001600160a01b031681565b6101cd6101c8366004611447565b610cc0565b60405190151581526020016100fc565b6000546100e8906001600160a01b031681565b6101cd6101fe366004611447565b60026020526000908152604090205460ff1681565b6005546100e8906001600160a01b031681565b610118610234366004611447565b610cf7565b610118610247366004611447565b610d97565b61011861025a3660046114af565b610dfd565b6000546001600160a01b031633146102925760405162461bcd60e51b8152600401610289906114e2565b60405180910390fd5b805161029d57600080fd5b60005b81518110156102fb576001600260008484815181106102c1576102c1611508565b6020908102919091018101516001600160a01b03168252810191909152604001600020805460ff19169115159190911790556001016102a0565b5050565b600080546001600160a01b031633148061032857503360009081526002602052604090205460ff165b6103445760405162461bcd60e51b81526004016102899061151e565b6004805460405163e7b6dac960e01b8152602092810192909252600c60248301526b1c1c995d9a595dd0dbdd5b9d60a21b60448301526001600160a01b03169063e7b6dac990606401602060405180830381865afa1580156103aa573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103ce9190611544565b9050806103da576108af565b6006546004805460405163e7b6dac960e01b81526000936001600160a01b039081169363a0d0ca0f939091169163e7b6dac99161043591016020808252600990820152681b985b5950dbdd5b9d60ba1b604082015260600190565b602060405180830381865afa158015610452573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104769190611544565b6040518263ffffffff1660e01b815260040161049491815260200190565b6020604051808303816000875af11580156104b3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104d79190611544565b60035460065460405163433ee8cd60e01b81529293506000926001600160a01b039283169263433ee8cd92610514928a929091169060040161155d565b6000604051808303816000875af1158015610533573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261055b91908101906116df565b905060006106276000600360009054906101000a90046001600160a01b03166001600160a01b03166346e4e7c96040518163ffffffff1660e01b8152600401602060405180830381865afa1580156105b7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105db91906117d9565b602085015160408601516060870151608088015160a08901518c60005b604051908082528060200260200182016040528015610621578160200160208202803683370190505b50610edf565b600554604051632adccb2560e21b81529192506001600160a01b03169063ab732c949061065d90889060009086906004016117f6565b600060405180830381600087803b15801561067757600080fd5b505af115801561068b573d6000803e3d6000fd5b506001925050505b848163ffffffff1610156108aa5763ffffffff811660408084019190915260035483516006549251638e6e826d60e01b81526001600160a01b0392831693638e6e826d936106e7939291169060040161155d565b6000604051808303816000875af1158015610706573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261072e9190810190611826565b60c0830152600354825160065460405163eb2c2da360e01b81526001600160a01b039384169363eb2c2da39361076b93909291169060040161155d565b6000604051808303816000875af115801561078a573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526107b29190810190611826565b6080830152600354600654604051632637f35160e11b8152600481018790526001600160a01b039182166024820152911690634c6fe6a2906044016000604051808303816000875af115801561080c573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526108349190810190611862565b60e0830152600554604051632adccb2560e21b81526001600160a01b039091169063ab732c949061086d90899085908790600401611896565b600060405180830381600087803b15801561088757600080fd5b505af115801561089b573d6000803e3d6000fd5b50505050806001019050610693565b505050505b92915050565b6108bd610f43565b6000546001600160a01b03163314806108e557503360009081526002602052604090205460ff165b6109015760405162461bcd60e51b81526004016102899061151e565b60035482516000916001600160a01b031690637bd6ec4a9061092c90860160209081019087016117d9565b60065460405160e084901b6001600160e01b031916815263ffffffff928316600482015291891660248301526001600160a01b031660448201526064016000604051808303816000875af1158015610988573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526109b091908101906116df565b9050610a4e85600360009054906101000a90046001600160a01b03166001600160a01b03166346e4e7c96040518163ffffffff1660e01b8152600401602060405180830381865afa158015610a09573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a2d91906117d9565b602084015160408501516060860151608087015160a08801518b60006105f8565b9150505b9392505050565b6000546001600160a01b0316331480610a8157503360009081526002602052604090205460ff165b610a9d5760405162461bcd60e51b81526004016102899061151e565b600580546001600160a01b0319166001600160a01b0392909216919091179055565b6000546001600160a01b0316331480610ae757503360009081526002602052604090205460ff165b610b035760405162461bcd60e51b81526004016102899061151e565b600680546001600160a01b0319166001600160a01b0392909216919091179055565b610b2d610f43565b6000546001600160a01b0316331480610b5557503360009081526002602052604090205460ff165b610b715760405162461bcd60e51b81526004016102899061151e565b60055460405163fccc3cd560e01b81526001600160a01b03848116600483015263ffffffff87166024830152600092169063fccc3cd590604401600060405180830381865afa158015610bc8573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610bf09190810190611935565b9050826001600160a01b031681606001516001600160a01b031614610c435760405162461bcd60e51b81526020600482015260096024820152683130b21037bbb732b960b91b6044820152606401610289565b8463ffffffff16816040015163ffffffff1614610c8e5760405162461bcd60e51b81526020600482015260096024820152680c4c2c840d2dcc8caf60bb1b6044820152606401610289565b610a4e84826000015183602001518460c001518560e0015186608001518760a001518860600151896101000151610edf565b600080546001600160a01b03838116911614806108af5750506001600160a01b031660009081526002602052604090205460ff1690565b6000546001600160a01b03163314610d215760405162461bcd60e51b8152600401610289906114e2565b600080546001600160a01b03908116825260026020526040808320805460ff1990811690915583546001600160a01b03191692851692831784558284528184208054909116600117905551909133917f93091b3f3cd424efabc74e181f3799f3476ed758412561ed3b29515c51f567529190a350565b6000546001600160a01b0316331480610dbf57503360009081526002602052604090205460ff165b610ddb5760405162461bcd60e51b81526004016102899061151e565b600380546001600160a01b0319166001600160a01b0392909216919091179055565b6000546001600160a01b03163314610e275760405162461bcd60e51b8152600401610289906114e2565b6000546001600160a01b0383811691161415610e7e5760405162461bcd60e51b815260206004820152601660248201527531b0b73737ba1036b7b234b33c903232b83637bcb2b960511b6044820152606401610289565b6001600160a01b038216600081815260026020908152604091829020805460ff1916851515908117909155915191825233917ff38de818d000d07d091732dd783c6855722d7bc1934d92b7635133289d341695910160405180910390a35050565b610ee7610f43565b50604080516101208101825263ffffffff998a168152978916602089015298909716978601979097526001600160a01b039096166060850152608084015260a083019490945260c082015260e081019290925261010082015290565b604051806101200160405280600063ffffffff168152602001600063ffffffff168152602001600063ffffffff16815260200160006001600160a01b0316815260200160608152602001606081526020016060815260200160608152602001606081525090565b634e487b7160e01b600052604160045260246000fd5b60405160c081016001600160401b0381118282101715610fe257610fe2610faa565b60405290565b60405161012081016001600160401b0381118282101715610fe257610fe2610faa565b604051601f8201601f191681016001600160401b038111828210171561103357611033610faa565b604052919050565b60006001600160401b0382111561105457611054610faa565b5060051b60200190565b6001600160a01b038116811461107357600080fd5b50565b6000602080838503121561108957600080fd5b82356001600160401b0381111561109f57600080fd5b8301601f810185136110b057600080fd5b80356110c36110be8261103b565b61100b565b81815260059190911b820183019083810190878311156110e257600080fd5b928401925b828410156111095783356110fa8161105e565b825292840192908401906110e7565b979650505050505050565b63ffffffff8116811461107357600080fd5b6000806040838503121561113957600080fd5b823561114481611114565b915060208301356111548161105e565b809150509250929050565b60006001600160401b0382111561117857611178610faa565b50601f01601f191660200190565b60008060006060848603121561119b57600080fd5b83356111a681611114565b925060208401356111b68161105e565b915060408401356001600160401b038111156111d157600080fd5b8401601f810186136111e257600080fd5b80356111f06110be8261115f565b81815287602083850101111561120557600080fd5b816020840160208301376000602083830101528093505050509250925092565b600081518084526020808501945080840160005b8381101561125b57815163ffffffff1687529582019590820190600101611239565b509495945050505050565b60005b83811015611281578181015183820152602001611269565b83811115611290576000848401525b50505050565b600081518084526112ae816020860160208601611266565b601f01601f19169290920160200192915050565b600081518084526020808501808196508360051b8101915082860160005b8581101561130a5782840389526112f8848351611296565b988501989350908401906001016112e0565b5091979650505050505050565b600081518084526020808501945080840160005b8381101561125b5781516001600160a01b03168752958201959082019060010161132b565b805163ffffffff16825260006101206020830151611376602086018263ffffffff169052565b50604083015161138e604086018263ffffffff169052565b5060608301516113a960608601826001600160a01b03169052565b5060808301518160808601526113c182860182611225565b91505060a083015184820360a08601526113db8282611296565b91505060c083015184820360c08601526113f58282611225565b91505060e083015184820360e086015261140f82826112c2565b915050610100808401518583038287015261142a8382611317565b9695505050505050565b602081526000610a526020830184611350565b60006020828403121561145957600080fd5b8135610a528161105e565b60008060006060848603121561147957600080fd5b833561148481611114565b9250602084013561149481611114565b915060408401356114a48161105e565b809150509250925092565b600080604083850312156114c257600080fd5b82356114cd8161105e565b91506020830135801515811461115457600080fd5b6020808252600c908201526b3737ba103232b83637bcb2b960a11b604082015260600190565b634e487b7160e01b600052603260045260246000fd5b6020808252600c908201526b1b9bdd08185c1c1c9bdd995960a21b604082015260600190565b60006020828403121561155657600080fd5b5051919050565b63ffffffff9290921682526001600160a01b0316602082015260400190565b805161158781611114565b919050565b600082601f83011261159d57600080fd5b815160206115ad6110be8361103b565b82815260059290921b840181019181810190868411156115cc57600080fd5b8286015b848110156115f05780516115e381611114565b83529183019183016115d0565b509695505050505050565b60006116096110be8461115f565b905082815283838301111561161d57600080fd5b610a52836020830184611266565b600082601f83011261163c57600080fd5b8151602061164c6110be8361103b565b82815260059290921b8401810191818101908684111561166b57600080fd5b8286015b848110156115f05780516001600160401b0381111561168e5760008081fd5b8701603f810189136116a05760008081fd5b6116b18986830151604084016115fb565b84525091830191830161166f565b600082601f8301126116d057600080fd5b610a52838351602085016115fb565b6000602082840312156116f157600080fd5b81516001600160401b038082111561170857600080fd5b9083019060c0828603121561171c57600080fd5b611724610fc0565b61172d8361157c565b815261173b6020840161157c565b602082015260408301518281111561175257600080fd5b61175e8782860161158c565b60408301525060608301518281111561177657600080fd5b6117828782860161162b565b60608301525060808301518281111561179a57600080fd5b6117a68782860161158c565b60808301525060a0830151828111156117be57600080fd5b6117ca878286016116bf565b60a08301525095945050505050565b6000602082840312156117eb57600080fd5b8151610a5281611114565b60018060a01b038416815282602082015260606040820152600061181d6060830184611350565b95945050505050565b60006020828403121561183857600080fd5b81516001600160401b0381111561184e57600080fd5b61185a8482850161158c565b949350505050565b60006020828403121561187457600080fd5b81516001600160401b0381111561188a57600080fd5b61185a8482850161162b565b6001600160a01b038416815263ffffffff8316602082015260606040820181905260009061181d90830184611350565b80516115878161105e565b600082601f8301126118e257600080fd5b815160206118f26110be8361103b565b82815260059290921b8401810191818101908684111561191157600080fd5b8286015b848110156115f05780516119288161105e565b8352918301918301611915565b60006020828403121561194757600080fd5b81516001600160401b038082111561195e57600080fd5b90830190610120828603121561197357600080fd5b61197b610fe8565b6119848361157c565b81526119926020840161157c565b60208201526119a36040840161157c565b60408201526119b4606084016118c6565b60608201526080830151828111156119cb57600080fd5b6119d78782860161158c565b60808301525060a0830151828111156119ef57600080fd5b6119fb878286016116bf565b60a08301525060c083015182811115611a1357600080fd5b611a1f8782860161158c565b60c08301525060e083015182811115611a3757600080fd5b611a438782860161162b565b60e0830152506101008084015183811115611a5d57600080fd5b611a69888287016118d1565b91830191909152509594505050505056fea2646970667358221220648298ee8158e09765c338bfd1e2f49d3ed98f8153e873e2b5bcc1482d1583ff64736f6c634300080c0033";
const isSuperArgs = (xs) => xs.length > 1;
class SelectiveMinter__factory extends ethers_1.ContractFactory {
    constructor(...args) {
        if (isSuperArgs(args)) {
            super(...args);
        }
        else {
            super(_abi, _bytecode, args[0]);
        }
    }
    deploy(valuesContract, storageContract, assetContract, randomNumberContract, overrides) {
        return super.deploy(valuesContract, storageContract, assetContract, randomNumberContract, overrides || {});
    }
    getDeployTransaction(valuesContract, storageContract, assetContract, randomNumberContract, overrides) {
        return super.getDeployTransaction(valuesContract, storageContract, assetContract, randomNumberContract, overrides || {});
    }
    attach(address) {
        return super.attach(address);
    }
    connect(signer) {
        return super.connect(signer);
    }
    static createInterface() {
        return new ethers_1.utils.Interface(_abi);
    }
    static connect(address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    }
}
exports.SelectiveMinter__factory = SelectiveMinter__factory;
SelectiveMinter__factory.bytecode = _bytecode;
SelectiveMinter__factory.abi = _abi;
//# sourceMappingURL=SelectiveMinter__factory.js.map