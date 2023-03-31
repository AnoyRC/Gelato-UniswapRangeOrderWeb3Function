import {
  Web3Function,
  Web3FunctionContext,
} from "@gelatonetwork/web3-functions-sdk";
import { Contract } from "ethers";
import ky from "ky"; // we recommend using ky as axios doesn't support fetch by default
const { ethers } = require("ethers");
const {
  abi: V3SwapRouterABI,
} = require("@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json");
const {
  abi: Quoter2Abi,
} = require("@uniswap/v3-periphery/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json");

const ERC20ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
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
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
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
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
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
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const dataStoreContractABI = [
  {
    inputs: [],
    name: "getMemberCount",
    outputs: [
      {
        internalType: "uint256",
        name: "count",
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
        name: "",
        type: "uint256",
      },
    ],
    name: "orderMembers",
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
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "swapDone",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "givenValue",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "targetValue",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "metamask",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
    ],
    name: "swapStart",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "userData",
    outputs: [
      {
        internalType: "uint256",
        name: "givenvalue",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "targetvalue",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const V3SwapRouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
const WETHAddress = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";
const UNIADDRESS = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
const dataStoreAddress = "0x71Aa0165df40872B55C41A79ad9Eb99f54813fF7";
const QUOTER2_ADDRESS = "0x61fFE014bA17989E743c5F6cB21bF9697530B21e";

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { userArgs, gelatoArgs, provider } = context;
  const PRIVATE_KEY = await context.secrets.get("PRIVATE_KEY");
  const ALCHEMY_URL_TESTNET = await context.secrets.get("ALCHEMY_URL");
  const WALLET_ADDRESS = await context.secrets.get("WALLET_ADDRESS");

  if (!PRIVATE_KEY) {
    return {
      canExec: false,
      message: "Private key not set",
    };
  }
  if (!ALCHEMY_URL_TESTNET) {
    return {
      canExec: false,
      message: "URL not set",
    };
  }
  if (!WALLET_ADDRESS) {
    return {
      canExec: false,
      message: "Wallet key not set",
    };
  }

  const newProvider = new ethers.providers.JsonRpcProvider(ALCHEMY_URL_TESTNET);
  const wallet = new ethers.Wallet(PRIVATE_KEY);
  const signer = wallet.connect(newProvider);

  const dataStoreContract = new ethers.Contract(
    dataStoreAddress,
    dataStoreContractABI,
    newProvider
  );

  let y = await dataStoreContract.getMemberCount();
  y = ethers.utils.formatUnits(y);
  y = y * 10 ** 18;
  console.log(y);

  if (y === 0) {
    return {
      canExec: false,
      message: "No orders placed",
    };
  }

  const getPrice = async (givenValue) => {
    const quoter2 = new ethers.Contract(
      QUOTER2_ADDRESS,
      Quoter2Abi,
      newProvider
    );
    const params = {
      tokenIn: WETHAddress,
      tokenOut: UNIADDRESS,
      fee: 3000,
      amountIn: ethers.utils.parseEther(givenValue),
      sqrtPriceLimitX96: 0,
    };
    const output = await quoter2.callStatic.quoteExactInputSingle(params);

    console.log(ethers.utils.formatUnits(output.amountOut.toString()));
    return ethers.utils.formatUnits(output.amountOut.toString());
  };

  const swapToken = async (givenValue, deadline: number) => {
    const swapRouterContract = new ethers.Contract(
      V3SwapRouterAddress,
      V3SwapRouterABI
    );

    const params = {
      tokenIn: WETHAddress,
      tokenOut: UNIADDRESS,
      fee: 3000,
      recipient: WALLET_ADDRESS,
      deadline: deadline,
      amountIn: ethers.utils.parseEther(givenValue),
      amountOutMinimum: 0,
      sqrtPriceLimitX96: 0,
    };

    const encodedData = swapRouterContract.interface.encodeFunctionData(
      "exactInputSingle",
      [params]
    );

    const txArgs = {
      to: V3SwapRouterAddress,
      from: WALLET_ADDRESS,
      data: encodedData,
      value: ethers.utils.parseEther(givenValue),
      gasLimit: ethers.utils.hexlify(1000000),
    };

    const tx = await signer.sendTransaction(txArgs);
    console.log("tx", tx);
  };

  for (let i = 0; i < y; i++) {
    const x = await dataStoreContract.orderMembers(i);
    const data = await dataStoreContract.userData(x);
    console.log(ethers.utils.formatUnits(data.givenvalue));
    const currentPrice = await getPrice(
      ethers.utils.formatUnits(data.givenvalue)
    );
    console.log(ethers.utils.formatUnits(data.targetvalue));
    let deadline = ethers.utils.formatUnits(data.deadline);
    deadline = deadline * 10 ** 18;
    const currentTime = Math.floor(Date.now() / 1000);
    console.log(deadline);
    if (deadline < currentTime) {
      //return eth to users
      const tx = {
        to: x,
        value: data.givenvalue,
      };
      const txObj = await signer.sendTransaction(tx);
      console.log("txObj:", txObj);
      // call swapDone
      const dataStoreEncoded =
        await dataStoreContract.interface.encodeFunctionData("swapDone", [
          x,
          i,
        ]);
      const txArg = {
        to: dataStoreAddress,
        from: WALLET_ADDRESS,
        data: dataStoreEncoded,
        gasLimit: ethers.utils.hexlify(1000000),
      };
      const swapDonetx = await signer.sendTransaction(txArg);
      console.log("tx", swapDonetx);

      return {
        canExec: false,
        message: "Deadline Over",
      };
    }
    if (currentPrice > ethers.utils.formatUnits(data.targetvalue)) {
      console.log("greater");
      await swapToken(ethers.utils.formatUnits(data.givenvalue), deadline);

      const gasPrice = newProvider.getGasPrice();
      //send tokens to users
      const unicontract = new ethers.Contract(UNIADDRESS, ERC20ABI, signer);
      console.log("here");
      const txObj = await unicontract.transfer(x, data.targetvalue);
      console.log("txObj:", txObj);
      console.log("transfered");
      //calling swapDone
      const dataStoreEncoded =
        await dataStoreContract.interface.encodeFunctionData("swapDone", [
          x,
          i,
        ]);
      const txArg = {
        to: dataStoreAddress,
        from: WALLET_ADDRESS,
        data: dataStoreEncoded,
        gasLimit: ethers.utils.hexlify(1000000),
      };
      const swapDonetx = await signer.sendTransaction(txArg);
      console.log("tx", swapDonetx);

      return {
        canExec: true,
        callData: "Swapped to uni and transfered",
      };
    } else {
      return {
        canExec: false,
        message: "Price is less than target",
      };
    }
  }

  // Return execution call data
  return {
    canExec: true,
    callData: "YOUR PAYLOAD",
  };
});
