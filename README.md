# 🌍 Circle Carbon Wallet - Cross-Chain CCTP Demo

A comprehensive carbon credit marketplace with **real Cross-Chain Transfer Protocol (CCTP)** integration, supporting wallet connections and cross-chain USDC transfers.

## ✨ **What's Working Now**

### 🏪 **Carbon Credit Marketplace**
- ✅ **4 Real Carbon Projects** with detailed information
- ✅ **Mock API Backend** built into Next.js
- ✅ **Project Listings** with prices, locations, and descriptions
- ✅ **Individual Project Pages** with purchase functionality

### 🔗 **Cross-Chain Transfer (CCTP)**
- ✅ **Real Wallet Integration** (MetaMask + Phantom)
- ✅ **Live Balance Fetching** from connected wallets
- ✅ **Multi-Chain Support** across 15+ testnets
- ✅ **CCTP Implementation** for USDC transfers between chains
- ✅ **Debug Logging** for troubleshooting transfers

### 🌐 **Supported Networks**
**EVM Chains:**
- Ethereum Sepolia, Arc Testnet, Avalanche Fuji
- Base Sepolia, Arbitrum Sepolia, Optimism Sepolia
- Linea Sepolia, Worldchain Sepolia, Polygon Amoy
- Sonic Testnet, Codex Testnet, Unichain Sepolia
- Sei Testnet, XDC Testnet, Plume Sepolia

**Solana:**
- Solana Mainnet, Solana Devnet
- HyperEVM Testnet
- Ink Sepolia

## 🚀 **Quick Start**

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 💼 **Wallet Setup**

### **No Environment Variables Required!** 
The app now connects to **real wallets** instead of using private keys:

- **MetaMask** for EVM chains (Ethereum, Arc, Base, etc.)
- **Phantom** for Solana chains

### **Testing CCTP Transfers:**
1. **Connect your wallets** using the wallet connection buttons
2. **Get test tokens** from faucets (see Testing section)
3. **Transfer USDC** between supported chains

## 🧪 **Testing Guide**

### **For Real CCTP Testing:**
1. **Ethereum Sepolia → Arc Testnet** (Recommended)
   - Get Sepolia ETH: [MetaMask Faucet](https://docs.metamask.io/developer-tools/faucet/)
   - Get test USDC: [Circle Faucet](https://faucet.circle.com)

2. **Solana Devnet → Arc Testnet**
   - Use the mock USDC setup script: `node scripts/setup-mock-usdc.js <your-wallet-address>`

### **Available Pages:**
- **`/`** - Carbon credit marketplace
- **`/transfer`** - Cross-chain USDC transfers  
- **`/listing/[id]`** - Individual carbon project pages

## 📁 **Project Structure**

```
src/
├── app/                 # Next.js 13+ app directory
│   ├── api/            # Mock API endpoints for carbon marketplace
│   ├── marketplace/    # Carbon credit marketplace page
│   ├── transfer/       # Cross-chain transfer page
│   └── listing/        # Individual project listing pages
├── components/         # Reusable UI components
│   ├── wallet-connection.tsx  # Wallet connection logic
│   └── ui/            # Shadcn/ui components
├── hooks/             
│   └── use-cross-chain-transfer.ts  # Main CCTP logic
├── lib/
│   ├── chains.ts      # Chain configurations and contract addresses
│   └── api.ts         # API client for marketplace
└── views/             # Page-specific components
```

## 📚 **Documentation**

- **Marketplace Report:** [`docs/marketplace-report.md`](docs/marketplace-report.md) - Detailed report on marketplace implementation
- **API Routes:** All API endpoints are documented in the marketplace report

## 🔧 **Development Notes**

### **Recent Improvements:**
- ✅ Fixed wallet connection integration 
- ✅ Added real balance fetching from connected wallets
- ✅ Improved error handling and debug logging
- ✅ Added support for 15+ testnet chains
- ✅ Created mock API backend for carbon marketplace
- ✅ Added comprehensive testing scripts

### **Known Issues:**
- Some faucets require "Proof of Humanity" verification
- CCTP attestation requires real test USDC (not mock tokens)

## 🤝 **Contributing**

This is a hackathon/demo project. For production use, ensure proper security audits and remove any debug logging.
3. Run the development server.
   ```bash
   npm run dev
   ```

The sample app will be running at [http://localhost:3000](http://localhost:3000).

