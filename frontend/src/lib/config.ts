// Network and contract configuration

export const NETWORKS = {
  POLYGON_POS: {
    id: 137,
    name: 'Polygon PoS',
    icon: '🟣',
    rpcUrl: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com',
    networkId: 2, // AggLayer network ID
  },
  POLYGON_ZKEVM: {
    id: 1101,
    name: 'Polygon zkEVM',
    icon: '🔵',
    rpcUrl: 'https://zkevm-rpc.com',
    explorer: 'https://zkevm.polygonscan.com',
    networkId: 1, // AggLayer network ID
  },
  AMOY: {
    id: 80002,
    name: 'Polygon Amoy',
    icon: '🟣',
    rpcUrl: 'https://rpc-amoy.polygon.technology',
    explorer: 'https://amoy.polygonscan.com',
    networkId: 2, // AggLayer network ID
  },
  CARDONA: {
    id: 2442,
    name: 'Cardona zkEVM',
    icon: '🔵',
    rpcUrl: 'https://rpc.cardona.zkevm-rpc.com',
    explorer: 'https://cardona-zkevm.polygonscan.com',
    networkId: 1, // AggLayer network ID
  },
} as const;

// Contract addresses (to be populated after deployment)
export const CONTRACTS = {
  // Mainnet
  MAINNET: {
    ZAP_SENDER: '0x...',
    ZAP_RECEIVER: '0x...',
    MOCK_POOL: '0x...',
    USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC on Polygon PoS
    BRIDGE: '0x...',
  },
  // Testnet
  TESTNET: {
    ZAP_SENDER: '0x...', // Deployed on Amoy
    ZAP_RECEIVER: '0x...', // Deployed on Cardona
    MOCK_POOL: '0x...', // Deployed on Cardona
    USDC_AMOY: '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582',
    USDC_CARDONA: '0x37eAA0eF3549a5bB7D431be78a3D99BD0d7B5Cd5',
    BRIDGE_AMOY: '0x528e26b25a34a4A5d0dbDa1d57D318153d2ED582',
    BRIDGE_CARDONA: '0x528e26b25a34a4A5d0dbDa1d57D318153d2ED582',
  },
} as const;

// Vault definitions
export interface Vault {
  id: string;
  name: string;
  description: string;
  apy: number;
  tvl: string;
  token: string;
  tokenIcon: string;
  tokenAddress: string;
  risk: 'Low' | 'Medium' | 'High';
  protocol: string;
  sourceNetwork: keyof typeof NETWORKS;
  destinationNetwork: keyof typeof NETWORKS;
  poolAddress: string;
  featured?: boolean;
}

export const VAULTS: Vault[] = [
  {
    id: 'stable-yield-1',
    name: 'Stablecoin Yield Vault',
    description: 'Earn yield on USDC across multiple DeFi protocols',
    apy: 8.5,
    tvl: '$4.2M',
    token: 'USDC',
    tokenIcon: '💵',
    tokenAddress: CONTRACTS.TESTNET.USDC_AMOY,
    risk: 'Low',
    protocol: 'Aave + Compound',
    sourceNetwork: 'AMOY',
    destinationNetwork: 'CARDONA',
    poolAddress: CONTRACTS.TESTNET.MOCK_POOL,
    featured: true,
  },
  // Add more vaults as needed
];

// Helper function to get bridge address for a network
export function getBridgeAddress(network: keyof typeof NETWORKS): string {
  switch (network) {
    case 'AMOY':
      return CONTRACTS.TESTNET.BRIDGE_AMOY;
    case 'CARDONA':
      return CONTRACTS.TESTNET.BRIDGE_CARDONA;
    default:
      return CONTRACTS.MAINNET.BRIDGE;
  }
}

// Helper function to format address
export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Helper function to format amount
export function formatAmount(amount: string | number, decimals: number = 2): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(decimals)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(decimals)}K`;
  }
  return num.toFixed(decimals);
}
