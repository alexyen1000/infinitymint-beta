"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfinityMintProject__factory = void 0;
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
const ethers_1 = require("ethers");
const _abi = [
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
        inputs: [],
        name: "getCurrentTag",
        outputs: [
            {
                internalType: "bytes",
                name: "",
                type: "bytes",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getCurrentVersion",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getProject",
        outputs: [
            {
                internalType: "bytes",
                name: "",
                type: "bytes",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getUpdates",
        outputs: [
            {
                internalType: "bytes[]",
                name: "updates",
                type: "bytes[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getVersions",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
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
        inputs: [
            {
                internalType: "bytes",
                name: "project",
                type: "bytes",
            },
        ],
        name: "setInitialProject",
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
                internalType: "uint256",
                name: "version",
                type: "uint256",
            },
        ],
        name: "setVersion",
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
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes",
                name: "project",
                type: "bytes",
            },
            {
                internalType: "bytes",
                name: "tag",
                type: "bytes",
            },
            {
                internalType: "bool",
                name: "setAsCurrentVersion",
                type: "bool",
            },
        ],
        name: "updateProject",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];
const _bytecode = "0x60806040526000600655600060075534801561001a57600080fd5b50600080546001600160a01b0319163390811782558152600260205260408120805460ff191660019081179091555561125e806100586000396000f3fe608060405234801561001057600080fd5b50600436106100ba5760003560e01c80630b98a032146100bf57806310a8c7a9146100d4578063408def1e146100e75780634e275bcb146100fa5780636d0cc895146101185780636e57b7001461012a578063a8a1d27314610132578063c13a474414610147578063d15d41501461015a578063d5f394881461017d578063d8b964e6146101a8578063f2fde38b146101cb578063fabec44a146101de578063fe684c0e146101e6575b600080fd5b6100d26100cd366004610da8565b6101f9565b005b6100d26100e2366004610e32565b610420565b6100d26100f5366004610ede565b6104b7565b610102610588565b60405161010f9190610f53565b60405180910390f35b6006545b60405190815260200161010f565b61010261062b565b61013a610705565b60405161010f9190610f6d565b6100d2610155366004610fcf565b61093f565b61016d61016836600461100b565b610a8d565b604051901515815260200161010f565b600054610190906001600160a01b031681565b6040516001600160a01b03909116815260200161010f565b61016d6101b636600461100b565b60026020526000908152604090205460ff1681565b6100d26101d936600461100b565b610ac8565b60075461011c565b6100d26101f4366004611026565b610b68565b6000546001600160a01b031633148061022157503360009081526002602052604090205460ff165b6102465760405162461bcd60e51b815260040161023d90611059565b60405180910390fd5b82516102645760405162461bcd60e51b815260040161023d9061107f565b81516102a25760405162461bcd60e51b815260206004820152600d60248201526c189b185b9ac81d1859c81cd95d609a1b604482015260640161023d565b6005826040516102b291906110aa565b908152602001604051809103902080546102cb906110c6565b15905061030c5760405162461bcd60e51b815260206004820152600f60248201526e1d1859c8185b1c9958591e481cd95d608a1b604482015260640161023d565b6006546103675760405162461bcd60e51b815260206004820152602360248201527f696e697469616c2070726f6a656374206e6f7420736574206279206465706c6f6044820152623cb2b960e91b606482015260840161023d565b6006546000908152600360209081526040909120845161038992860190610c4a565b50600654600090815260046020908152604090912083516103ac92850190610c4a565b5082516040516103c491339142914391602001611101565b6040516020818303038152906040526005836040516103e391906110aa565b90815260200160405180910390209080519060200190610404929190610c4a565b508015610412576006546007555b505060068054600101905550565b6000546001600160a01b0316331461044a5760405162461bcd60e51b815260040161023d90611127565b805161045557600080fd5b60005b81518110156104b3576001600260008484815181106104795761047961114d565b6020908102919091018101516001600160a01b03168252810191909152604001600020805460ff1916911515919091179055600101610458565b5050565b6000546001600160a01b03163314806104df57503360009081526002602052604090205460ff165b6104fb5760405162461bcd60e51b815260040161023d90611059565b6006548110801561050c5750600081115b61054a5760405162461bcd60e51b815260206004820152600f60248201526e34b73b30b634b2103b32b939b4b7b760891b604482015260640161023d565b60008181526003602052604090208054610563906110c6565b151590506105835760405162461bcd60e51b815260040161023d9061107f565b600755565b60075460009081526004602052604090208054606091906105a8906110c6565b80601f01602080910402602001604051908101604052809291908181526020018280546105d4906110c6565b80156106215780601f106105f657610100808354040283529160200191610621565b820191906000526020600020905b81548152906001019060200180831161060457829003601f168201915b5050505050905090565b60075460009081526003602052604081208054606092919061064c906110c6565b80601f0160208091040260200160405190810160405280929190818152602001828054610678906110c6565b80156106c55780601f1061069a576101008083540402835291602001916106c5565b820191906000526020600020905b8154815290600101906020018083116106a857829003601f168201915b5050505050905080516000141561070057505060408051808201909152600e81526d7b276c6f63616c273a747275657d60901b602082015290565b919050565b60606000805b60065481101561078f576000818152600460205260409020805461072e906110c6565b1580159150610774575060008181526004602052604090819020905160059161075691611163565b9081526020016040518091039020805461076f906110c6565b151590505b156107875781610783816111ff565b9250505b60010161070b565b50806001600160401b038111156107a8576107a8610ce3565b6040519080825280602002602001820160405280156107db57816020015b60608152602001906001900390816107c65790505b5091506000905060005b60065481101561093a5760008181526004602052604090208054610808906110c6565b158015915061084e575060008181526004602052604090819020905160059161083091611163565b90815260200160405180910390208054610849906110c6565b151590505b156109325760008181526004602052604090819020905160059161087191611163565b9081526020016040518091039020805461088a906110c6565b80601f01602080910402602001604051908101604052809291908181526020018280546108b6906110c6565b80156109035780601f106108d857610100808354040283529160200191610903565b820191906000526020600020905b8154815290600101906020018083116108e657829003601f168201915b5050505050838380610914906111ff565b9450815181106109265761092661114d565b60200260200101819052505b6001016107e5565b505090565b6000546001600160a01b031633146109695760405162461bcd60e51b815260040161023d90611127565b600654156109b75760405162461bcd60e51b815260206004820152601b60248201527a1a5b9a5d1a585b081c1c9bda9958dd08185b1c9958591e481cd95d602a1b604482015260640161023d565b600654600090815260036020908152604090912082516109d992840190610c4a565b5060408051808201825260078152661a5b9a5d1a585b60ca1b602080830191825260065460009081526004909152929092209051610a179290610c4a565b508051604051610a2f91339142914391602001611101565b6040516020818303038152906040526005604051610a5a90661a5b9a5d1a585b60ca1b815260070190565b90815260200160405180910390209080519060200190610a7b929190610c4a565b50506000600755600680546001019055565b600080546001600160a01b0383811691161480610ac257506001600160a01b03821660009081526002602052604090205460ff165b92915050565b6000546001600160a01b03163314610af25760405162461bcd60e51b815260040161023d90611127565b600080546001600160a01b03908116825260026020526040808320805460ff1990811690915583546001600160a01b03191692851692831784558284528184208054909116600117905551909133917f93091b3f3cd424efabc74e181f3799f3476ed758412561ed3b29515c51f567529190a350565b6000546001600160a01b03163314610b925760405162461bcd60e51b815260040161023d90611127565b6000546001600160a01b0383811691161415610be95760405162461bcd60e51b815260206004820152601660248201527531b0b73737ba1036b7b234b33c903232b83637bcb2b960511b604482015260640161023d565b6001600160a01b038216600081815260026020908152604091829020805460ff1916851515908117909155915191825233917ff38de818d000d07d091732dd783c6855722d7bc1934d92b7635133289d341695910160405180910390a35050565b828054610c56906110c6565b90600052602060002090601f016020900481019282610c785760008555610cbe565b82601f10610c9157805160ff1916838001178555610cbe565b82800160010185558215610cbe579182015b82811115610cbe578251825591602001919060010190610ca3565b50610cca929150610cce565b5090565b5b80821115610cca5760008155600101610ccf565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f191681016001600160401b0381118282101715610d2157610d21610ce3565b604052919050565b600082601f830112610d3a57600080fd5b81356001600160401b03811115610d5357610d53610ce3565b610d66601f8201601f1916602001610cf9565b818152846020838601011115610d7b57600080fd5b816020850160208301376000918101602001919091529392505050565b8035801515811461070057600080fd5b600080600060608486031215610dbd57600080fd5b83356001600160401b0380821115610dd457600080fd5b610de087838801610d29565b94506020860135915080821115610df657600080fd5b50610e0386828701610d29565b925050610e1260408501610d98565b90509250925092565b80356001600160a01b038116811461070057600080fd5b60006020808385031215610e4557600080fd5b82356001600160401b0380821115610e5c57600080fd5b818501915085601f830112610e7057600080fd5b813581811115610e8257610e82610ce3565b8060051b9150610e93848301610cf9565b8181529183018401918481019088841115610ead57600080fd5b938501935b83851015610ed257610ec385610e1b565b82529385019390850190610eb2565b98975050505050505050565b600060208284031215610ef057600080fd5b5035919050565b60005b83811015610f12578181015183820152602001610efa565b83811115610f21576000848401525b50505050565b60008151808452610f3f816020860160208601610ef7565b601f01601f19169290920160200192915050565b602081526000610f666020830184610f27565b9392505050565b6000602080830181845280855180835260408601915060408160051b870101925083870160005b82811015610fc257603f19888603018452610fb0858351610f27565b94509285019290850190600101610f94565b5092979650505050505050565b600060208284031215610fe157600080fd5b81356001600160401b03811115610ff757600080fd5b61100384828501610d29565b949350505050565b60006020828403121561101d57600080fd5b610f6682610e1b565b6000806040838503121561103957600080fd5b61104283610e1b565b915061105060208401610d98565b90509250929050565b6020808252600c908201526b1b9bdd08185c1c1c9bdd995960a21b604082015260600190565b602080825260119082015270189b185b9ac81c1c9bda9958dd081cd95d607a1b604082015260600190565b600082516110bc818460208701610ef7565b9190910192915050565b600181811c908216806110da57607f821691505b602082108114156110fb57634e487b7160e01b600052602260045260246000fd5b50919050565b6001600160a01b0394909416845260208401929092526040830152606082015260800190565b6020808252600c908201526b3737ba103232b83637bcb2b960a11b604082015260600190565b634e487b7160e01b600052603260045260246000fd5b600080835481600182811c91508083168061117f57607f831692505b602080841082141561119f57634e487b7160e01b86526022600452602486fd5b8180156111b357600181146111c4576111f1565b60ff198616895284890196506111f1565b60008a81526020902060005b868110156111e95781548b8201529085019083016111d0565b505084890196505b509498975050505050505050565b600060001982141561122157634e487b7160e01b600052601160045260246000fd5b506001019056fea26469706673582212206cb20f2f7a47ef79858243679f72f714537ee440ef05e2a47b04dfc3a081cc6a64736f6c634300080c0033";
const isSuperArgs = (xs) => xs.length > 1;
class InfinityMintProject__factory extends ethers_1.ContractFactory {
    constructor(...args) {
        if (isSuperArgs(args)) {
            super(...args);
        }
        else {
            super(_abi, _bytecode, args[0]);
        }
    }
    deploy(overrides) {
        return super.deploy(overrides || {});
    }
    getDeployTransaction(overrides) {
        return super.getDeployTransaction(overrides || {});
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
exports.InfinityMintProject__factory = InfinityMintProject__factory;
InfinityMintProject__factory.bytecode = _bytecode;
InfinityMintProject__factory.abi = _abi;
//# sourceMappingURL=InfinityMintProject__factory.js.map