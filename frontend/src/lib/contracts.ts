// Contract ABIs for frontend integration

export const ZAP_SENDER_ABI = [
  {
    inputs: [
      { internalType: "address", name: "_bridge", type: "address" },
      { internalType: "address", name: "_feeRecipient", type: "address" }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [],
    name: "FeeTooHigh",
    type: "error"
  },
  {
    inputs: [],
    name: "InvalidAmount",
    type: "error"
  },
  {
    inputs: [],
    name: "InvalidBridgeAddress",
    type: "error"
  },
  {
    inputs: [],
    name: "InvalidDestinationReceiver",
    type: "error"
  },
  {
    inputs: [],
    name: "TransferFailed",
    type: "error"
  },
  {
    inputs: [],
    name: "UnsupportedToken",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: true, internalType: "address", name: "token", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "uint32", name: "destinationNetwork", type: "uint32" },
      { indexed: false, internalType: "address", name: "destinationReceiver", type: "address" },
      { indexed: true, internalType: "bytes32", name: "zapId", type: "bytes32" }
    ],
    name: "ZapInitiated",
    type: "event"
  },
  {
    inputs: [
      { internalType: "address", name: "destinationZapContract", type: "address" },
      { internalType: "address", name: "token", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint32", name: "destinationNetworkId", type: "uint32" }
    ],
    name: "zapLiquidity",
    outputs: [{ internalType: "bytes32", name: "zapId", type: "bytes32" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "destinationZapContract", type: "address" },
      { internalType: "uint32", name: "destinationNetworkId", type: "uint32" }
    ],
    name: "zapLiquidityETH",
    outputs: [{ internalType: "bytes32", name: "zapId", type: "bytes32" }],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "calculateFee",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "feeBps",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getStats",
    outputs: [
      { internalType: "uint256", name: "_totalZaps", type: "uint256" },
      { internalType: "uint256", name: "_totalVolume", type: "uint256" },
      { internalType: "uint256", name: "_feeBps", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    name: "isTokenSupported",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  }
] as const;

export const ZAP_RECEIVER_ABI = [
  {
    inputs: [{ internalType: "address", name: "_bridge", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: true, internalType: "address", name: "pool", type: "address" },
      { indexed: true, internalType: "address", name: "token", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "lpReceived", type: "uint256" }
    ],
    name: "DepositExecuted",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: true, internalType: "address", name: "token", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "uint32", name: "originNetwork", type: "uint32" },
      { indexed: false, internalType: "address", name: "originSender", type: "address" }
    ],
    name: "ZapReceived",
    type: "event"
  },
  {
    inputs: [
      { internalType: "address", name: "originAddress", type: "address" },
      { internalType: "uint32", name: "originNetwork", type: "uint32" },
      { internalType: "bytes", name: "data", type: "bytes" }
    ],
    name: "onMessageReceived",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [],
    name: "getStats",
    outputs: [
      { internalType: "uint256", name: "_totalDeposits", type: "uint256" },
      { internalType: "uint256", name: "_totalVolume", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  }
] as const;

export const MOCK_POOL_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: true, internalType: "address", name: "token", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "lpMinted", type: "uint256" }
    ],
    name: "Deposit",
    type: "event"
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" },
      { internalType: "address", name: "token", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "depositFor",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "uint256", name: "lpAmount", type: "uint256" }
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "getAPY",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "lpToken",
    outputs: [{ internalType: "contract ZapLP", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  }
] as const;

export const ERC20_ABI = [
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  }
] as const;
