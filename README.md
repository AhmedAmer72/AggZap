# 🔮 AggZap - The Chainless DeFi Adapter

<div align="center">

![AggZap Banner](https://via.placeholder.com/800x200/8b3dff/ffffff?text=AggZap+-+One+Click+Cross-Chain+Yield)

**"We are the Stripe for Cross-Chain DeFi. We make every Polygon chain feel like one big bank account."**

[![Polygon](https://img.shields.io/badge/Polygon-AggLayer-8247E5?style=for-the-badge&logo=polygon)](https://polygon.technology)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?style=for-the-badge&logo=solidity)](https://soliditylang.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

## 🚀 The Problem

Cross-chain DeFi is broken. To farm yield on Astar zkEVM, a user currently has to:

```
1. Bridge to Ethereum     → 5 mins, $20 gas
2. Bridge to Astar        → 10 mins, $15 gas  
3. Swap tokens            → 2 mins, $5 gas
4. Deposit into Protocol  → 2 mins, $5 gas
─────────────────────────────────────────────
Total: ~20 minutes, $45 in fees, 4 transactions
```

**This is unacceptable in 2025.**

## ✨ The AggZap Solution

AggZap leverages Polygon's **AggLayer** and `bridgeAndCall()` to atomically bridge funds AND deposit into DeFi protocols in a **single transaction**.

```
User clicks "Deposit" on Polygon PoS
        ↓
   ~30 seconds
        ↓
Funds earning yield on zkEVM ✅
```

**One click. One fee (0.1%). Done.**

---

## 🏗️ Architecture

```
╔═══════════════════════════════════════════════════════════════════════════╗
║                           AggZap Architecture                              ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║   User Wallet (Polygon PoS)                                                ║
║         │                                                                  ║
║         │ 1. zapLiquidity(token, amount, destination)                     ║
║         ▼                                                                  ║
║   ┌─────────────────┐                                                      ║
║   │   ZapSender.sol │  ◄── Source Chain Contract                          ║
║   │   (Amoy/PoS)    │                                                      ║
║   └────────┬────────┘                                                      ║
║            │                                                               ║
║            │ 2. bridge.bridgeAndCall(...)                                 ║
║            ▼                                                               ║
║   ┌─────────────────────────────────────────────┐                         ║
║   │           🌉 Polygon Unified Bridge          │                         ║
║   │              (AggLayer Magic)                │                         ║
║   └─────────────────────┬───────────────────────┘                         ║
║                         │                                                  ║
║                         │ 3. Atomic bridge + call                         ║
║                         ▼                                                  ║
║   ┌─────────────────┐                                                      ║
║   │  ZapReceiver.sol│  ◄── Destination Chain Contract                     ║
║   │  (Cardona/zkEVM)│                                                      ║
║   └────────┬────────┘                                                      ║
║            │                                                               ║
║            │ 4. onMessageReceived() → depositFor(user)                    ║
║            ▼                                                               ║
║   ┌─────────────────┐                                                      ║
║   │   MockPool.sol  │  ◄── DeFi Protocol (Aave, Compound, etc.)          ║
║   └────────┬────────┘                                                      ║
║            │                                                               ║
║            │ 5. Mint LP tokens to user                                    ║
║            ▼                                                               ║
║   User receives LP tokens on destination chain 🎉                         ║
║                                                                            ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

---

## 🛠️ Tech Stack

### Smart Contracts
- **Solidity 0.8.20** - Latest stable version with optimizations
- **Hardhat** - Development framework
- **OpenZeppelin** - Battle-tested contract libraries
- **Polygon Unified Bridge** - Cross-chain communication via `bridgeAndCall()`

### Frontend
- **Next.js 14** - React framework with App Router
- **Wagmi v2** - Ethereum hooks library
- **RainbowKit** - Wallet connection UI
- **Framer Motion** - Beautiful animations
- **TailwindCSS** - Utility-first styling

---

## 📦 Project Structure

```
AggZap/
├── contracts/
│   ├── interfaces/
│   │   ├── IPolygonZkEVMBridgeV2.sol    # AggLayer bridge interface
│   │   └── IBridgeMessageReceiver.sol    # Receiver interface
│   ├── ZapSender.sol                     # Source chain entry point
│   ├── ZapReceiver.sol                   # Destination chain handler
│   ├── MockPool.sol                      # Test DeFi pool
│   └── MockTokens.sol                    # Test tokens (USDC, WETH)
├── scripts/
│   └── deploy_and_zap.ts                 # Deployment & interaction script
├── test/
│   └── AggZap.test.ts                    # Comprehensive test suite
├── frontend/
│   ├── src/
│   │   ├── app/                          # Next.js App Router
│   │   ├── components/
│   │   │   ├── layout/                   # Header, Footer
│   │   │   ├── sections/                 # Hero, VaultGrid, Stats
│   │   │   ├── modals/                   # VaultModal with zap flow
│   │   │   ├── ui/                       # ZapProgress, buttons
│   │   │   └── effects/                  # ParticleBackground
│   │   ├── hooks/                        # useZap, useTokenBalance
│   │   └── lib/                          # Contracts, config
│   └── ...
├── hardhat.config.ts
└── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- MetaMask or compatible wallet

### 1. Clone & Install

```bash
git clone https://github.com/your-repo/aggzap.git
cd aggzap
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your private key and RPC URLs
```

### 3. Compile Contracts

```bash
npm run compile
```

### 4. Run Tests

```bash
npm run test
```

### 5. Deploy (Local)

```bash
npx hardhat run scripts/deploy_and_zap.ts
```

### 6. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` 🎉

---

## 📋 Smart Contract Details

### ZapSender.sol (Source Chain)

The entry point for users. Handles:
- Token transfers from user
- Fee calculation (0.1%)
- Encoding calldata for destination
- Calling `bridgeAndCall()` on the Unified Bridge

**Key Function:**
```solidity
function zapLiquidity(
    address destinationZapContract,
    address token,
    uint256 amount,
    uint32 destinationNetworkId
) external returns (bytes32 zapId)
```

### ZapReceiver.sol (Destination Chain)

Receives bridged tokens and executes DeFi deposits. Implements `IBridgeMessageReceiver`.

**Key Function:**
```solidity
function onMessageReceived(
    address originAddress,
    uint32 originNetwork,
    bytes memory data
) external payable
```

### Why `bridgeAndCall()` vs `bridgeAsset()`?

| Feature | bridgeAsset() | bridgeAndCall() |
|---------|--------------|-----------------|
| Token transfer | ✅ | ✅ |
| Automatic claim | ❌ | ✅ |
| Execute action on destination | ❌ | ✅ |
| Transactions required | 2-4 | 1 |
| User experience | Complex | Seamless |

**`bridgeAndCall()` is the key to "Chain Abstraction"** - users don't need to know they're interacting with multiple chains.

---

## 🎨 Frontend Features

### Stunning UI
- **Glassmorphism** design with blur effects
- **Gradient animations** and glow effects
- **Particle background** for visual depth
- **Responsive** design for all devices

### Vault Cards
- Display APY, TVL, risk level
- One-click deposit flow
- Real-time transaction progress

### Zap Progress Visualization
```
┌──────────────────────────────────────────────┐
│  [●] Bundling Assets                         │
│  [●] Initiating Bridge                       │
│  [◐] Crossing AggLayer  ← Currently here     │
│  [ ] Depositing on zkEVM                     │
│  [ ] Complete                                │
│                                              │
│  🟣 ────────●────────── 🔵                   │
│  PoS                    zkEVM                │
└──────────────────────────────────────────────┘
```

---

## 🔐 Security Considerations

1. **Bridge Verification**: Only the Unified Bridge can call `onMessageReceived()`
2. **Sender Authorization**: Only whitelisted ZapSenders can trigger deposits
3. **Reentrancy Protection**: All state-changing functions use `ReentrancyGuard`
4. **Fallback Address**: If the destination call fails, funds go to user's wallet
5. **Fee Caps**: Protocol fee capped at 1% maximum

---

## 🗺️ Roadmap

### Phase 1 (Weeks 1-4) ✅
- [x] ZapSender contract
- [x] ZapReceiver contract
- [x] MockPool for testing
- [x] Deployment scripts

### Phase 2 (Weeks 5-8) ✅
- [x] Next.js frontend
- [x] Wallet integration (RainbowKit)
- [x] Vault dashboard
- [x] Zap flow with animations

### Phase 3 (Weeks 9-10)
- [ ] Testnet deployment (Amoy → Cardona)
- [ ] Real DeFi integrations (Aave, Compound)
- [ ] Audit preparation
- [ ] Mainnet launch

---

## 🏆 Why AggZap Wins

### Polygon Alignment
AggZap demonstrates the **AggLayer**, Polygon's flagship technology for 2025. We're building what Polygon wants to see succeed.

### DeFi Narrative
We're solving **"User Fragmentation"** - a top thesis for VCs like:
- Spartan Group
- Variant Fund
- Framework Ventures

### Technical Excellence
Implementing `bridgeAndCall()` proves deep understanding of Polygon 2.0 architecture.

---

## 📄 License

MIT License - see [LICENSE](LICENSE)

---

## 🤝 Contributing

Contributions welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md).

---

## 📞 Contact

- **Twitter**: [@AggZap](https://twitter.com/aggzap)
- **Discord**: [discord.gg/aggzap](https://discord.gg/aggzap)
- **Email**: team@aggzap.io

---

<div align="center">

**Built with 💜 on Polygon AggLayer**

*Making DeFi feel like one chain*

</div>
