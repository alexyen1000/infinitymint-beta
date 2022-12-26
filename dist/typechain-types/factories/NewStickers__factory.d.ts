import { Signer, ContractFactory, BigNumberish, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { NewStickers, NewStickersInterface } from "../NewStickers";
type NewStickersConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class NewStickers__factory extends ContractFactory {
    constructor(...args: NewStickersConstructorParams);
    deploy(oracleDestination: PromiseOrValue<string>, erc721: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, tokenName: PromiseOrValue<string>, tokenSymbol: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<NewStickers>;
    getDeployTransaction(oracleDestination: PromiseOrValue<string>, erc721: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, tokenName: PromiseOrValue<string>, tokenSymbol: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): NewStickers;
    connect(signer: Signer): NewStickers__factory;
    static readonly bytecode = "0x60806040523480156200001157600080fd5b506040516200249a3803806200249a83398101604081905262000034916200025d565b8151829082906200004d906005906020850190620000cd565b50805162000063906006906020840190620000cd565b505060078054336001600160a01b031991821681179092556000918252600960205260408220805460ff19166001179055600891909155600a805482166001600160a01b03988916179055600b8054909116959096169490941790945550600c5550620003349050565b828054620000db90620002f7565b90600052602060002090601f016020900481019282620000ff57600085556200014a565b82601f106200011a57805160ff19168380011785556200014a565b828001600101855582156200014a579182015b828111156200014a5782518255916020019190600101906200012d565b50620001589291506200015c565b5090565b5b808211156200015857600081556001016200015d565b80516001600160a01b03811681146200018b57600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b600082601f830112620001b857600080fd5b81516001600160401b0380821115620001d557620001d562000190565b604051601f8301601f19908116603f0116810190828211818310171562000200576200020062000190565b816040528381526020925086838588010111156200021d57600080fd5b600091505b8382101562000241578582018301518183018401529082019062000222565b83821115620002535760008385830101525b9695505050505050565b600080600080600060a086880312156200027657600080fd5b620002818662000173565b9450620002916020870162000173565b6040870151606088015191955093506001600160401b0380821115620002b657600080fd5b620002c489838a01620001a6565b93506080880151915080821115620002db57600080fd5b50620002ea88828901620001a6565b9150509295509295909350565b600181811c908216806200030c57607f821691505b602082108114156200032e57634e487b7160e01b600052602260045260246000fd5b50919050565b61215680620003446000396000f3fe60806040526004361061018e5760003560e01c806384d4db06116100dd57806384d4db06146103ca5780638f965d80146103dd578063948509ea1461041457806395d89b4114610434578063a22cb46514610449578063b88d4fde14610469578063ba0bba4014610489578063c87b56dd1461049e578063cc2ee196146104be578063d15d4150146104d3578063d49a2a7c146104f3578063d5f3948814610543578063d8b964e614610563578063e985e9c514610593578063f2fde38b146105b3578063fe684c0e146105d3578063feb6ce69146105f357600080fd5b806301ffc9a71461019357806306fdde03146101c8578063081812fc146101ea578063095ea7b31461021757806310a8c7a91461023957806317d70f7c1461025957806323b872dd1461027d57806323d882d31461029d57806342842e0e146102bd578063430c2081146102dd5780634f558e79146102fd5780636352211e1461031d57806370a082311461033d57806375467b26146103735780637631dfdb14610395578063780fae66146103b5575b600080fd5b34801561019f57600080fd5b506101b36101ae36600461194d565b610620565b60405190151581526020015b60405180910390f35b3480156101d457600080fd5b506101dd610672565b6040516101bf91906119be565b3480156101f657600080fd5b5061020a6102053660046119d1565b610704565b6040516101bf91906119ea565b34801561022357600080fd5b50610237610232366004611a13565b61071f565b005b34801561024557600080fd5b50610237610254366004611a85565b610874565b34801561026557600080fd5b5061026f600c5481565b6040519081526020016101bf565b34801561028957600080fd5b50610237610298366004611b36565b61090b565b3480156102a957600080fd5b506102376102b8366004611bce565b610a7b565b3480156102c957600080fd5b506102376102d8366004611b36565b610ab8565b3480156102e957600080fd5b506101b36102f8366004611a13565b610ad8565b34801561030957600080fd5b506101b36103183660046119d1565b610b37565b34801561032957600080fd5b5061020a6103383660046119d1565b610b54565b34801561034957600080fd5b5061026f610358366004611c16565b6001600160a01b031660009081526004602052604090205490565b34801561037f57600080fd5b50610388610bb9565b6040516101bf9190611c33565b3480156103a157600080fd5b50600a5461020a906001600160a01b031681565b3480156103c157600080fd5b50600e5461026f565b6102376103d8366004611ca5565b610ce7565b3480156103e957600080fd5b506103fd6103f83660046119d1565b610fba565b6040516101bf9b9a99989796959493929190611d07565b34801561042057600080fd5b50600b5461020a906001600160a01b031681565b34801561044057600080fd5b506101dd6110b0565b34801561045557600080fd5b50610237610464366004611d7c565b6110bf565b34801561047557600080fd5b50610237610484366004611db5565b61112c565b34801561049557600080fd5b5061023761113e565b3480156104aa57600080fd5b506101dd6104b93660046119d1565b6112ac565b3480156104ca57600080fd5b506101dd61134e565b3480156104df57600080fd5b506101b36104ee366004611c16565b61135d565b3480156104ff57600080fd5b50600754600c5460408051808201825260038152626e657760e81b602082015290516101bf9330936001600160a01b039091169290916335268a9f60e21b90611e08565b34801561054f57600080fd5b5060075461020a906001600160a01b031681565b34801561056f57600080fd5b506101b361057e366004611c16565b60096020526000908152604090205460ff1681565b34801561059f57600080fd5b506101b36105ae366004611e56565b611396565b3480156105bf57600080fd5b506102376105ce366004611c16565b6113c4565b3480156105df57600080fd5b506102376105ee366004611d7c565b61146a565b3480156105ff57600080fd5b5061061361060e3660046119d1565b611545565b6040516101bf9190611e84565b60006001600160e01b031982166380ac58cd60e01b148061065157506001600160e01b03198216635b5e139f60e01b145b8061066c57506301ffc9a760e01b6001600160e01b03198316145b92915050565b60606005805461068190611f47565b80601f01602080910402602001604051908101604052809291908181526020018280546106ad90611f47565b80156106fa5780601f106106cf576101008083540402835291602001916106fa565b820191906000526020600020905b8154815290600101906020018083116106dd57829003601f168201915b5050505050905090565b6000908152600260205260409020546001600160a01b031690565b600061072a82610b54565b9050806001600160a01b0316836001600160a01b0316141561078a5760405162461bcd60e51b815260206004820152601460248201527331b0b73737ba1030b8383937bb329037bbb732b960611b60448201526064015b60405180910390fd5b336001600160a01b03821614806107a657506107a68133611396565b6108185760405162461bcd60e51b815260206004820152603d60248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f7420746f60448201527f6b656e206f776e6572206f7220617070726f76656420666f7220616c6c0000006064820152608401610781565b60008281526002602052604080822080546001600160a01b0319166001600160a01b0387811691821790925591518593918516917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591a4505050565b6007546001600160a01b0316331461089e5760405162461bcd60e51b815260040161078190611f82565b80516108a957600080fd5b60005b8151811015610907576001600960008484815181106108cd576108cd611fa8565b6020908102919091018101516001600160a01b03168252810191909152604001600020805460ff19169115159190911790556001016108ac565b5050565b6109153382610ad8565b6109595760405162461bcd60e51b81526020600482015260156024820152743737ba1030b8383937bb32b21037b91037bbb732b960591b6044820152606401610781565b6001600160a01b0383166109a95760405162461bcd60e51b815260206004820152601760248201527673656e64696e6720746f206e756c6c206164647265737360481b6044820152606401610781565b600081815260026020908152604080832080546001600160a01b03191690556001600160a01b0386168352600490915281208054600192906109ec908490611fd4565b90915550506001600160a01b0382166000908152600460205260408120805460019290610a1a908490611feb565b909155505060008181526020819052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b6007546001600160a01b03163314610aa55760405162461bcd60e51b815260040161078190611f82565b805161090790601090602084019061189b565b610ad3838383604051806020016040528060008152506116e9565b505050565b600080610ae483610b54565b9050806001600160a01b0316846001600160a01b03161480610b0b5750610b0b8185611396565b80610b2f5750836001600160a01b0316610b2484610704565b6001600160a01b0316145b949350505050565b6000908152602081905260409020546001600160a01b0316151590565b6000610b5f82610b37565b610b9d5760405162461bcd60e51b815260206004820152600f60248201526e1a5b9d985b1a59081d1bdad95b9259608a1b6044820152606401610781565b506000908152602081905260409020546001600160a01b031690565b60606000805b600e54811015610c1c576000818152600d602052604090206008015462010000900460ff168015610c0157506000818152600d602052604090206008015460ff165b15610c145781610c1081612003565b9250505b600101610bbf565b50806001600160401b03811115610c3557610c35611a3f565b604051908082528060200260200182016040528015610c5e578160200160208202803683370190505b5091506000905060005b600e54811015610ce2576000818152600d602052604090206008015462010000900460ff168015610caa57506000818152600d602052604090206008015460ff165b15610cda57808383610cbb81612003565b945081518110610ccd57610ccd611fa8565b6020026020010181815250505b600101610c68565b505090565b811580610cf2575083155b610d3d5760405162461bcd60e51b815260206004820152601c60248201527b707073206d757374206265207a65726f20696620756e74696c69747960201b6044820152606401610781565b60115460ff16610db35760405162461bcd60e51b815260206004820152603b60248201527f6465706c6f79657220686173206e6f742073657420757020746869732073746960448201527a636b65727320636f6e7472616374207375636365737366756c6c7960281b6064820152608401610781565b600a54604051631844598360e21b81526000916001600160a01b031690636111660c90610de49033906004016119ea565b608060405180830381865afa158015610e01573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e25919061201e565b9050806060015115156001151514610eb05760405162461bcd60e51b815260206004820152604260248201527f706c65617365207265676973746572207769746820737469636b6572206f726160448201527f636c652066697273742077697468207468652063757272656e74206164647265606482015261737360f01b608482015260a401610781565b8280610f415750600a546001600160a01b031663a5058ff48686336040516001600160e01b031960e086901b168152600481019390935260248301919091526001600160a01b03166044820152606401602060405180830381865afa158015610f1d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f419190612092565b610fb35760405162461bcd60e51b815260206004820152603e60248201527f63616e6e6f74206166666f7264207468652050505320796f752068617665207360448201527f657420666f722074686174206475726174696f6e2063757272656e746c7900006064820152608401610781565b5050505050565b600d602052600090815260409020805460018201546002830154600384018054939492936001600160a01b039092169291610ff490611f47565b80601f016020809104026020016040519081016040528092919081815260200182805461102090611f47565b801561106d5780601f106110425761010080835404028352916020019161106d565b820191906000526020600020905b81548152906001019060200180831161105057829003601f168201915b5050506004840154600585015460068601546007870154600890970154959660ff938416969295509093509181811691610100810482169162010000909104168b565b60606006805461068190611f47565b3360008181526003602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3191015b60405180910390a35050565b611138848484846116e9565b50505050565b6007546001600160a01b031633146111685760405162461bcd60e51b815260040161078190611f82565b60115460ff16156111b05760405162461bcd60e51b8152602060048201526012602482015271068617320616c7265616479207365742075760741b6044820152606401610781565b600a54600c546040516312187ff160e21b81526001600160a01b0390921691634861ffc4916111e39130906004016120af565b602060405180830381865afa158015611200573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906112249190612092565b15611238576011805460ff19166001179055565b600a54600c54604051634564a42560e01b81526001600160a01b0390921691634564a4259161126b9130906004016120af565b600060405180830381600087803b15801561128557600080fd5b505af1158015611299573d6000803e3d6000fd5b50506011805460ff191660011790555050565b60008181526001602052604090208054606091906112c990611f47565b80601f01602080910402602001604051908101604052809291908181526020018280546112f590611f47565b80156113425780601f1061131757610100808354040283529160200191611342565b820191906000526020600020905b81548152906001019060200180831161132557829003601f168201915b50505050509050919050565b60606010805461068190611f47565b6007546000906001600160a01b038381169116148061066c5750506001600160a01b031660009081526009602052604090205460ff1690565b6001600160a01b03918216600090815260036020908152604080832093909416825291909152205460ff1690565b6007546001600160a01b031633146113ee5760405162461bcd60e51b815260040161078190611f82565b600780546001600160a01b03908116600090815260096020526040808220805460ff1990811690915584546001600160a01b03191693861693841790945582825280822080549094166001179093559151909133917f93091b3f3cd424efabc74e181f3799f3476ed758412561ed3b29515c51f567529190a350565b6007546001600160a01b031633146114945760405162461bcd60e51b815260040161078190611f82565b6007546001600160a01b03838116911614156114eb5760405162461bcd60e51b815260206004820152601660248201527531b0b73737ba1036b7b234b33c903232b83637bcb2b960511b6044820152606401610781565b6001600160a01b038216600081815260096020908152604091829020805460ff1916851515908117909155915191825233917ff38de818d000d07d091732dd783c6855722d7bc1934d92b7635133289d3416959101611120565b6040805161016080820183526000808352602080840182905283850182905260608085018190526080850183905260a0850183905260c0850183905260e08501839052610100850183905261012085018390526101408501839052868352600d825291859020855193840186528054845260018101549184019190915260028101546001600160a01b03169483019490945260038401805493949293918401916115ee90611f47565b80601f016020809104026020016040519081016040528092919081815260200182805461161a90611f47565b80156116675780601f1061163c57610100808354040283529160200191611667565b820191906000526020600020905b81548152906001019060200180831161164a57829003601f168201915b5050509183525050600482015460ff90811615156020830152600583015460408301526006830154606083015260078301546080830152600890920154808316151560a083015261010081048316151560c0830152620100009004909116151560e09091015261014081015190915015156001146116e457600080fd5b919050565b6116f484848461090b565b6117013385858585611759565b6111385760405162461bcd60e51b815260206004820152602360248201527f45524337323120526563656976657220436f6e6669726d6174696f6e2049732060448201526210985960ea1b6064820152608401610781565b6000833b61176957506001611892565b604051630a85bd0160e11b81526001600160a01b0385169063150b7a029061179b9089908990889088906004016120c6565b6020604051808303816000875af19250505080156117d6575060408051601f3d908101601f191682019092526117d391810190612103565b60015b61187c573d808015611804576040519150601f19603f3d011682016040523d82523d6000602084013e611809565b606091505b5080516118745760405162461bcd60e51b815260206004820152603360248201527f5468697320636f6e747261637420646f6573206e6f7420696d706c656d656e746044820152721030b71024a2a9219b9918a932b1b2b4bb32b960691b6064820152608401610781565b805181602001fd5b6001600160e01b031916630a85bd0160e11b1490505b95945050505050565b8280546118a790611f47565b90600052602060002090601f0160209004810192826118c9576000855561190f565b82601f106118e257805160ff191683800117855561190f565b8280016001018555821561190f579182015b8281111561190f5782518255916020019190600101906118f4565b5061191b92915061191f565b5090565b5b8082111561191b5760008155600101611920565b6001600160e01b03198116811461194a57600080fd5b50565b60006020828403121561195f57600080fd5b813561196a81611934565b9392505050565b6000815180845260005b818110156119975760208185018101518683018201520161197b565b818111156119a9576000602083870101525b50601f01601f19169290920160200192915050565b60208152600061196a6020830184611971565b6000602082840312156119e357600080fd5b5035919050565b6001600160a01b0391909116815260200190565b6001600160a01b038116811461194a57600080fd5b60008060408385031215611a2657600080fd5b8235611a31816119fe565b946020939093013593505050565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f191681016001600160401b0381118282101715611a7d57611a7d611a3f565b604052919050565b60006020808385031215611a9857600080fd5b82356001600160401b0380821115611aaf57600080fd5b818501915085601f830112611ac357600080fd5b813581811115611ad557611ad5611a3f565b8060051b9150611ae6848301611a55565b8181529183018401918481019088841115611b0057600080fd5b938501935b83851015611b2a5784359250611b1a836119fe565b8282529385019390850190611b05565b98975050505050505050565b600080600060608486031215611b4b57600080fd5b8335611b56816119fe565b92506020840135611b66816119fe565b929592945050506040919091013590565b60006001600160401b03831115611b9057611b90611a3f565b611ba3601f8401601f1916602001611a55565b9050828152838383011115611bb757600080fd5b828260208301376000602084830101529392505050565b600060208284031215611be057600080fd5b81356001600160401b03811115611bf657600080fd5b8201601f81018413611c0757600080fd5b610b2f84823560208401611b77565b600060208284031215611c2857600080fd5b813561196a816119fe565b6020808252825182820181905260009190848201906040850190845b81811015611c6b57835183529284019291840191600101611c4f565b50909695505050505050565b801515811461194a57600080fd5b600082601f830112611c9657600080fd5b61196a83833560208501611b77565b60008060008060808587031215611cbb57600080fd5b84359350602085013592506040850135611cd481611c77565b915060608501356001600160401b03811115611cef57600080fd5b611cfb87828801611c85565b91505092959194509250565b8b8152602081018b90526001600160a01b038a16604082015261016060608201819052600090611d398382018c611971565b9915156080840152505060a081019690965260c086019490945260e085019290925215156101008401521515610120830152151561014090910152949350505050565b60008060408385031215611d8f57600080fd5b8235611d9a816119fe565b91506020830135611daa81611c77565b809150509250929050565b60008060008060808587031215611dcb57600080fd5b8435611dd6816119fe565b93506020850135611de6816119fe565b92506040850135915060608501356001600160401b03811115611cef57600080fd5b6001600160a01b038681168252851660208201526040810184905260a060608201819052600090611e3b90830185611971565b905063ffffffff60e01b831660808301529695505050505050565b60008060408385031215611e6957600080fd5b8235611e74816119fe565b91506020830135611daa816119fe565b60208152815160208201526020820151604082015260006040830151611eb560608401826001600160a01b03169052565b506060830151610160806080850152611ed2610180850183611971565b91506080850151611ee760a086018215159052565b5060a085015160c085015260c085015160e085015260e0850151610100818187015280870151915050610120611f208187018315159052565b8601519050610140611f358682018315159052565b90950151151593019290925250919050565b600181811c90821680611f5b57607f821691505b60208210811415611f7c57634e487b7160e01b600052602260045260246000fd5b50919050565b6020808252600c908201526b3737ba103232b83637bcb2b960a11b604082015260600190565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b600082821015611fe657611fe6611fbe565b500390565b60008219821115611ffe57611ffe611fbe565b500190565b600060001982141561201757612017611fbe565b5060010190565b60006080828403121561203057600080fd5b604051608081018181106001600160401b038211171561205257612052611a3f565b6040528251612060816119fe565b808252506020830151602082015260408301516040820152606083015161208681611c77565b60608201529392505050565b6000602082840312156120a457600080fd5b815161196a81611c77565b9182526001600160a01b0316602082015260400190565b6001600160a01b03858116825284166020820152604081018390526080606082018190526000906120f990830184611971565b9695505050505050565b60006020828403121561211557600080fd5b815161196a8161193456fea2646970667358221220b6bceb4bc167bca23ac356dc5aa22eab0123abf12addc05726411f0ecdebd14264736f6c634300080c0033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "oracleDestination";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "erc721";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_tokenId";
            readonly type: "uint256";
        }, {
            readonly internalType: "string";
            readonly name: "tokenName";
            readonly type: "string";
        }, {
            readonly internalType: "string";
            readonly name: "tokenSymbol";
            readonly type: "string";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "approved";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }];
        readonly name: "Approval";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "operator";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "bool";
            readonly name: "approved";
            readonly type: "bool";
        }];
        readonly name: "ApprovalForAll";
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
        }, {
            readonly indexed: true;
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }];
        readonly name: "Transfer";
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
            readonly name: "_to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_tokenId";
            readonly type: "uint256";
        }];
        readonly name: "approve";
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
            readonly internalType: "address";
            readonly name: "_owner";
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
            readonly name: "_tokenId";
            readonly type: "uint256";
        }];
        readonly name: "exists";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getActiveStickers";
        readonly outputs: readonly [{
            readonly internalType: "uint256[]";
            readonly name: "results";
            readonly type: "uint256[]";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_tokenId";
            readonly type: "uint256";
        }];
        readonly name: "getApproved";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
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
        readonly inputs: readonly [];
        readonly name: "getOptions";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_stickerId";
            readonly type: "uint256";
        }];
        readonly name: "getSticker";
        readonly outputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "uint256";
                readonly name: "stickerId";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "oracaleId";
                readonly type: "uint256";
            }, {
                readonly internalType: "address";
                readonly name: "owner";
                readonly type: "address";
            }, {
                readonly internalType: "string";
                readonly name: "stickerUri";
                readonly type: "string";
            }, {
                readonly internalType: "bool";
                readonly name: "utility";
                readonly type: "bool";
            }, {
                readonly internalType: "uint256";
                readonly name: "duration";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "pps";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "creation";
                readonly type: "uint256";
            }, {
                readonly internalType: "bool";
                readonly name: "active";
                readonly type: "bool";
            }, {
                readonly internalType: "bool";
                readonly name: "completed";
                readonly type: "bool";
            }, {
                readonly internalType: "bool";
                readonly name: "valid";
                readonly type: "bool";
            }];
            readonly internalType: "struct NewStickers.Sticker";
            readonly name: "sticker";
            readonly type: "tuple";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getStickerCount";
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
            readonly name: "_owner";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_operator";
            readonly type: "address";
        }];
        readonly name: "isApprovedForAll";
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
            readonly name: "addr";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }];
        readonly name: "isApprovedOrOwner";
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
        readonly inputs: readonly [];
        readonly name: "name";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_tokenId";
            readonly type: "uint256";
        }];
        readonly name: "ownerOf";
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
            readonly name: "pps";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "duration";
            readonly type: "uint256";
        }, {
            readonly internalType: "bool";
            readonly name: "utility";
            readonly type: "bool";
        }, {
            readonly internalType: "bytes";
            readonly name: "requestData";
            readonly type: "bytes";
        }];
        readonly name: "request";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_from";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_tokenId";
            readonly type: "uint256";
        }];
        readonly name: "safeTransferFrom";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_from";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_tokenId";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "_data";
            readonly type: "bytes";
        }];
        readonly name: "safeTransferFrom";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_operator";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "_approved";
            readonly type: "bool";
        }];
        readonly name: "setApprovalForAll";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "_options";
            readonly type: "string";
        }];
        readonly name: "setOptions";
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
        readonly name: "setup";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "stickerOracle";
        readonly outputs: readonly [{
            readonly internalType: "contract StickerOracle";
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
        readonly name: "stickers";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "stickerId";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "oracaleId";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }, {
            readonly internalType: "string";
            readonly name: "stickerUri";
            readonly type: "string";
        }, {
            readonly internalType: "bool";
            readonly name: "utility";
            readonly type: "bool";
        }, {
            readonly internalType: "uint256";
            readonly name: "duration";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "pps";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "creation";
            readonly type: "uint256";
        }, {
            readonly internalType: "bool";
            readonly name: "active";
            readonly type: "bool";
        }, {
            readonly internalType: "bool";
            readonly name: "completed";
            readonly type: "bool";
        }, {
            readonly internalType: "bool";
            readonly name: "valid";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes4";
            readonly name: "interfaceId";
            readonly type: "bytes4";
        }];
        readonly name: "supportsInterface";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "symbol";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "tokenId";
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
            readonly name: "_tokenId";
            readonly type: "uint256";
        }];
        readonly name: "tokenURI";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_from";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_tokenId";
            readonly type: "uint256";
        }];
        readonly name: "transferFrom";
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
    }];
    static createInterface(): NewStickersInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): NewStickers;
}
export {};
//# sourceMappingURL=NewStickers__factory.d.ts.map