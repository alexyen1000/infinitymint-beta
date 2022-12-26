"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfinityMintValues__factory = void 0;
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
const ethers_1 = require("ethers");
const _abi = [
    {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "key",
                type: "string",
            },
        ],
        name: "getValue",
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
                internalType: "string",
                name: "key",
                type: "string",
            },
        ],
        name: "isTrue",
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
                internalType: "string",
                name: "key",
                type: "string",
            },
            {
                internalType: "bool",
                name: "value",
                type: "bool",
            },
        ],
        name: "setBooleanValue",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "key",
                type: "string",
            },
            {
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
        ],
        name: "setValue",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string[]",
                name: "keys",
                type: "string[]",
            },
            {
                internalType: "uint256[]",
                name: "_values",
                type: "uint256[]",
            },
            {
                internalType: "string[]",
                name: "booleanKeys",
                type: "string[]",
            },
            {
                internalType: "bool[]",
                name: "_booleanValues",
                type: "bool[]",
            },
        ],
        name: "setupValues",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "key",
                type: "string",
            },
        ],
        name: "tryGetValue",
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
];
const _bytecode = "0x608060405234801561001057600080fd5b50600380546001600160a01b031916331790556107f9806100326000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c80630312c880146100675780630b3f0d8d1461008f5780633d8f89d7146100a45780637c2da7aa146100b7578063960384a0146100ca578063e7b6dac9146100eb575b600080fd5b61007a610075366004610453565b6100fe565b60405190151581526020015b60405180910390f35b6100a261009d3660046105b8565b610129565b005b6100a26100b23660046106b8565b610218565b6100a26100c5366004610705565b610296565b6100dd6100d8366004610453565b6102e2565b604051908152602001610086565b6100dd6100f9366004610453565b61036d565b60006001826040516101109190610749565b9081526040519081900360200190205460ff1692915050565b6003546001600160a01b0316331461014057600080fd5b825184511461014e57600080fd5b805182511461015c57600080fd5b60005b84518110156101b6576101a485828151811061017d5761017d610784565b602002602001015185838151811061019757610197610784565b6020026020010151610296565b806101ae8161079a565b91505061015f565b5060005b8251811015610211576101ff8382815181106101d8576101d8610784565b60200260200101518383815181106101f2576101f2610784565b6020026020010151610218565b806102098161079a565b9150506101ba565b5050505050565b6003546001600160a01b0316331461022f57600080fd5b806001836040516102409190610749565b908152604051908190036020018120805492151560ff1990931692909217909155600190600290610272908590610749565b908152604051908190036020019020805491151560ff199092169190911790555050565b6003546001600160a01b031633146102ad57600080fd5b806000836040516102be9190610749565b90815260200160405180910390208190555060016002836040516102729190610749565b60006002826040516102f49190610749565b9081526040519081900360200190205460ff166103475760405162461bcd60e51b815260206004820152600d60248201526c496e76616c69642056616c756560981b604482015260640160405180910390fd5b6000826040516103579190610749565b9081526020016040518091039020549050919050565b600060028260405161037f9190610749565b9081526040519081900360200190205460ff1661034757506000919050565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f191681016001600160401b03811182821017156103dc576103dc61039e565b604052919050565b600082601f8301126103f557600080fd5b81356001600160401b0381111561040e5761040e61039e565b610421601f8201601f19166020016103b4565b81815284602083860101111561043657600080fd5b816020850160208301376000918101602001919091529392505050565b60006020828403121561046557600080fd5b81356001600160401b0381111561047b57600080fd5b610487848285016103e4565b949350505050565b60006001600160401b038211156104a8576104a861039e565b5060051b60200190565b600082601f8301126104c357600080fd5b813560206104d86104d38361048f565b6103b4565b82815260059290921b840181019181810190868411156104f757600080fd5b8286015b848110156105365780356001600160401b0381111561051a5760008081fd5b6105288986838b01016103e4565b8452509183019183016104fb565b509695505050505050565b8035801515811461055157600080fd5b919050565b600082601f83011261056757600080fd5b813560206105776104d38361048f565b82815260059290921b8401810191818101908684111561059657600080fd5b8286015b84811015610536576105ab81610541565b835291830191830161059a565b600080600080608085870312156105ce57600080fd5b84356001600160401b03808211156105e557600080fd5b6105f1888389016104b2565b955060209150818701358181111561060857600080fd5b8701601f8101891361061957600080fd5b80356106276104d38261048f565b81815260059190911b8201840190848101908b83111561064657600080fd5b928501925b828410156106645783358252928501929085019061064b565b9750505050604087013591508082111561067d57600080fd5b610689888389016104b2565b9350606087013591508082111561069f57600080fd5b506106ac87828801610556565b91505092959194509250565b600080604083850312156106cb57600080fd5b82356001600160401b038111156106e157600080fd5b6106ed858286016103e4565b9250506106fc60208401610541565b90509250929050565b6000806040838503121561071857600080fd5b82356001600160401b0381111561072e57600080fd5b61073a858286016103e4565b95602094909401359450505050565b6000825160005b8181101561076a5760208186018101518583015201610750565b81811115610779576000828501525b509190910192915050565b634e487b7160e01b600052603260045260246000fd5b60006000198214156107bc57634e487b7160e01b600052601160045260246000fd5b506001019056fea264697066735822122091a52327479c0f1d1bcfd546f096866fa0184ee0f3732b9dea82c93f24d1987f64736f6c634300080c0033";
const isSuperArgs = (xs) => xs.length > 1;
class InfinityMintValues__factory extends ethers_1.ContractFactory {
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
exports.InfinityMintValues__factory = InfinityMintValues__factory;
InfinityMintValues__factory.bytecode = _bytecode;
InfinityMintValues__factory.abi = _abi;
//# sourceMappingURL=InfinityMintValues__factory.js.map