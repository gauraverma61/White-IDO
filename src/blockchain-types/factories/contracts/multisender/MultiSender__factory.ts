/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  MultiSender,
  MultiSenderInterface,
} from "../../../contracts/multisender/MultiSender";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_arrayLimit",
        type: "uint256",
      },
    ],
    name: "ArrayLimitChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_fee",
        type: "uint256",
      },
    ],
    name: "BaseFeeChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_feePerAccount",
        type: "uint256",
      },
    ],
    name: "FeePerAccountChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_sourceAccount",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_targetAccount",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "Sent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_balance",
        type: "uint256",
      },
    ],
    name: "Withdrawn",
    type: "event",
  },
  {
    inputs: [],
    name: "arrayLimit",
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
    name: "baseFee",
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
    name: "feePerAccount",
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
        internalType: "uint256",
        name: "_arrayLimit",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_feePerAccount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_fees",
        type: "uint256",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "_accounts",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "_amounts",
        type: "uint256[]",
      },
    ],
    name: "multiSend",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
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
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_arrayLimit",
        type: "uint256",
      },
    ],
    name: "setArrayLimit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_fees",
        type: "uint256",
      },
    ],
    name: "setBaseFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_feePerAccount",
        type: "uint256",
      },
    ],
    name: "setFeePerAccount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
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
        internalType: "address",
        name: "_to",
        type: "address",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

const _bytecode =
  "0x60806040526101f46065556000606655600060675534801561002057600080fd5b5061110e806100306000396000f3fe6080604052600436106100ab5760003560e01c806380d859111161006457806380d859111461016d5780638da5cb5b1461018d5780639ec68f0f146101b5578063b4ae641c146101c8578063ee8a0a30146101de578063f2fde38b146101fe57600080fd5b806308e5c148146100b757806346860698146100d957806350b7c6e7146100f957806351cff8d9146101225780636ef25c3a14610142578063715018a61461015857600080fd5b366100b257005b600080fd5b3480156100c357600080fd5b506100d76100d2366004610d96565b61021e565b005b3480156100e557600080fd5b506100d76100f4366004610d96565b610268565b34801561010557600080fd5b5061010f60665481565b6040519081526020015b60405180910390f35b34801561012e57600080fd5b506100d761013d366004610dcb565b6102ab565b34801561014e57600080fd5b5061010f60675481565b34801561016457600080fd5b506100d7610366565b34801561017957600080fd5b506100d7610188366004610de6565b61037a565b34801561019957600080fd5b506033546040516001600160a01b039091168152602001610119565b6100d76101c3366004610ee8565b610548565b3480156101d457600080fd5b5061010f60655481565b3480156101ea57600080fd5b506100d76101f9366004610d96565b610559565b34801561020a57600080fd5b506100d7610219366004610dcb565b61059c565b610226610615565b606681905560408051338152602081018390527f2c4a137f204a402fa3de24fc37fcb0a6394f8149bf8baca289a7f746acac2c4b91015b60405180910390a150565b610270610615565b606781905560408051338152602081018390527fd156ca316d26c3ef349214cf79162a57b8271f66b5f38910a27a76a768f06d83910161025d565b6102b3610615565b6001600160a01b03811661030e5760405162461bcd60e51b815260206004820152601e60248201527f63616e277420776974686472617720746f207a65726f2061646472657373000060448201526064015b60405180910390fd5b476103226001600160a01b0383168261066f565b6040518181526001600160a01b0383169033907fd1c19fbcd4551a5edfb66d43d2e337c04837afda3482b42bdf569a8fccdae5fb9060200160405180910390a35050565b61036e610615565b610378600061071d565b565b600054610100900460ff161580801561039a5750600054600160ff909116105b806103b45750303b1580156103b4575060005460ff166001145b6104175760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608401610305565b6000805460ff19166001179055801561043a576000805461ff0019166101001790555b61044261076f565b60658490556066839055606782905560408051338152602081018690527fe0b40640e1ae86f6ec91fdad86540589c00399747c44f216e233a299c172e209910160405180910390a160408051338152602081018590527f2c4a137f204a402fa3de24fc37fcb0a6394f8149bf8baca289a7f746acac2c4b910160405180910390a160408051338152602081018490527fd156ca316d26c3ef349214cf79162a57b8271f66b5f38910a27a76a768f06d83910160405180910390a18015610542576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b50505050565b6105548333848461079e565b505050565b610561610615565b606581905560408051338152602081018390527fe0b40640e1ae86f6ec91fdad86540589c00399747c44f216e233a299c172e209910161025d565b6105a4610615565b6001600160a01b0381166106095760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610305565b6106128161071d565b50565b6033546001600160a01b031633146103785760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610305565b6000826001600160a01b03168260405160006040518083038185875af1925050503d80600081146106bc576040519150601f19603f3d011682016040523d82523d6000602084013e6106c1565b606091505b50509050806105545760405162461bcd60e51b815260206004820152602260248201527f5472616e7366657248656c7065723a2053656e64696e6720455448206661696c604482015261195960f21b6064820152608401610305565b603380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b600054610100900460ff166107965760405162461bcd60e51b815260040161030590610fba565b6103786108ad565b6107a882516108dd565b805182511461080f5760405162461bcd60e51b815260206004820152602d60248201527f746865206163636f756e74732073697a6520616e6420616d6f756e747320736960448201526c7a65206e6f7420657175616c7360981b6064820152608401610305565b6065548251111561086c5760405162461bcd60e51b815260206004820152602160248201527f61727261792073697a652065786365656420746865206172726179206c696d696044820152601d60fa1b6064820152608401610305565b73efefefefefefefefefefefefefefefefefefefef6001600160a01b038516036108a15761089c84848484610929565b610542565b61054284848484610a31565b600054610100900460ff166108d45760405162461bcd60e51b815260040161030590610fba565b6103783361071d565b6108e681610aa1565b3410156106125760405162461bcd60e51b8152602060048201526011602482015270686173206e6f20656e6f7567682066656560781b6044820152606401610305565b6000805b83518110156109c65761098684828151811061094b5761094b611005565b602002602001015184838151811061096557610965611005565b6020026020010151886001600160a01b0316610aca9092919063ffffffff16565b6109b283828151811061099b5761099b611005565b602002602001015183610b0390919063ffffffff16565b9150806109be81611031565b91505061092d565b506109db6109d48451610aa1565b3490610b16565b811115610a2a5760405162461bcd60e51b815260206004820152601d60248201527f686173206e6f20656e6f7567682065746820746f207472616e736665720000006044820152606401610305565b5050505050565b60005b8251811015610a2a57610a8f84848381518110610a5357610a53611005565b6020026020010151848481518110610a6d57610a6d611005565b6020026020010151886001600160a01b0316610b22909392919063ffffffff16565b80610a9981611031565b915050610a34565b6000610ac4606754610abe84606654610c6090919063ffffffff16565b90610b03565b92915050565b73efefefefefefefefefefefefefefefefefefefef6001600160a01b03841603610af857610554828261066f565b610554838383610c6c565b6000610b0f828461104a565b9392505050565b6000610b0f828461105d565b604080516001600160a01b0385811660248301528481166044830152606480830185905283518084039091018152608490920183526020820180516001600160e01b03166323b872dd60e01b1790529151600092839290881691610b869190611070565b6000604051808303816000865af19150503d8060008114610bc3576040519150601f19603f3d011682016040523d82523d6000602084013e610bc8565b606091505b5091509150818015610bf2575080511580610bf2575080806020019051810190610bf2919061109f565b610c585760405162461bcd60e51b815260206004820152603160248201527f5472616e7366657248656c7065723a3a736166655472616e7366657246726f6d6044820152700e881d1c985b9cd9995c8819985a5b1959607a1b6064820152608401610305565b505050505050565b6000610b0f82846110c1565b604080516001600160a01b038481166024830152604480830185905283518084039091018152606490920183526020820180516001600160e01b031663a9059cbb60e01b1790529151600092839290871691610cc89190611070565b6000604051808303816000865af19150503d8060008114610d05576040519150601f19603f3d011682016040523d82523d6000602084013e610d0a565b606091505b5091509150818015610d34575080511580610d34575080806020019051810190610d34919061109f565b610a2a5760405162461bcd60e51b815260206004820152602d60248201527f5472616e7366657248656c7065723a3a736166655472616e736665723a20747260448201526c185b9cd9995c8819985a5b1959609a1b6064820152608401610305565b600060208284031215610da857600080fd5b5035919050565b80356001600160a01b0381168114610dc657600080fd5b919050565b600060208284031215610ddd57600080fd5b610b0f82610daf565b600080600060608486031215610dfb57600080fd5b505081359360208301359350604090920135919050565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff81118282101715610e5157610e51610e12565b604052919050565b600067ffffffffffffffff821115610e7357610e73610e12565b5060051b60200190565b600082601f830112610e8e57600080fd5b81356020610ea3610e9e83610e59565b610e28565b82815260059290921b84018101918181019086841115610ec257600080fd5b8286015b84811015610edd5780358352918301918301610ec6565b509695505050505050565b600080600060608486031215610efd57600080fd5b610f0684610daf565b925060208085013567ffffffffffffffff80821115610f2457600080fd5b818701915087601f830112610f3857600080fd5b8135610f46610e9e82610e59565b81815260059190911b8301840190848101908a831115610f6557600080fd5b938501935b82851015610f8a57610f7b85610daf565b82529385019390850190610f6a565b965050506040870135925080831115610fa257600080fd5b5050610fb086828701610e7d565b9150509250925092565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b6000600182016110435761104361101b565b5060010190565b80820180821115610ac457610ac461101b565b81810381811115610ac457610ac461101b565b6000825160005b818110156110915760208186018101518583015201611077565b506000920191825250919050565b6000602082840312156110b157600080fd5b81518015158114610b0f57600080fd5b8082028115828204841417610ac457610ac461101b56fea264697066735822122049987636c2e538abbc53e500096d239d118ea2ef45b5f5679092b9ff681ad68b64736f6c63430008110033";

type MultiSenderConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MultiSenderConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MultiSender__factory extends ContractFactory {
  constructor(...args: MultiSenderConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<MultiSender> {
    return super.deploy(overrides || {}) as Promise<MultiSender>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): MultiSender {
    return super.attach(address) as MultiSender;
  }
  override connect(signer: Signer): MultiSender__factory {
    return super.connect(signer) as MultiSender__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MultiSenderInterface {
    return new utils.Interface(_abi) as MultiSenderInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MultiSender {
    return new Contract(address, _abi, signerOrProvider) as MultiSender;
  }
}