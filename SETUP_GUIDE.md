# Circle Cross-Chain Transfer - Setup Guide

## 🚀 Quick Start

This is a Circle CCTP (Cross-Chain Transfer Protocol) demo app that enables USDC transfers between different blockchain networks.

### Prerequisites
- Node.js 18+
- npm or yarn
- MetaMask wallet
- Phantom wallet (for Solana transfers)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd circle-carbon-wallet

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🌐 Supported Networks

### EVM Chains
- **Ethereum Sepolia** (recommended for testing)
- **Arc Testnet** 
- **Base Sepolia**
- **Avalanche Fuji**
- **Arbitrum Sepolia**
- And more...

### Solana Networks
- **Solana Mainnet**
- **Solana Devnet**

## 🔗 Wallet Connection

The app supports:
- **MetaMask** for EVM chains
- **Phantom** for Solana chains

Both wallets are automatically detected and connected when available.

## 💰 Getting Test Tokens

### For Ethereum Sepolia (Recommended)
1. **Get Sepolia ETH**: Use [Sepolia Faucet](https://sepoliafaucet.com)
2. **Get Test USDC**: Use [Circle's Faucet](https://faucet.circle.com) 

### For Other Networks
- Check the respective faucets for each testnet
- Ensure you have both native gas tokens and USDC for testing

## 🔄 How CCTP Works

1. **Burn**: Lock/burn USDC on source chain
2. **Attest**: Circle provides cryptographic proof
3. **Mint**: Mint equivalent USDC on destination chain

## 🛠️ Development Features

### Wallet Integration
- Real-time balance fetching
- Automatic network switching
- Connected wallet prioritization

### Debug Mode
- Extensive console logging
- Transaction step tracking
- Error handling and recovery

### Cross-Chain Support
- EVM ↔ EVM transfers
- EVM ↔ Solana transfers  
- Solana ↔ EVM transfers

## 📁 Key Files

- `src/hooks/use-cross-chain-transfer.ts` - Main transfer logic
- `src/components/wallet-connection.tsx` - Wallet connection UI
- `src/views/transfer/TransferForm.tsx` - Transfer form UI
- `src/lib/chains.ts` - Chain configurations
- `src/lib/bridgeKitClient.ts` - Bridge integration

## 🚨 Important Notes

- **Use testnets only** - Never test with mainnet funds
- **Check balances** - Ensure you have gas fees on destination chains
- **Wait for confirmations** - CCTP attestation can take 2-5 minutes

## 🐛 Troubleshooting

### Common Issues
1. **"Insufficient balance"** - Check wallet connection and token balances
2. **"Network mismatch"** - Switch MetaMask to correct network
3. **"Transaction failed"** - Ensure sufficient gas fees

### Debug Tips
- Check browser console for detailed logs
- Verify wallet connections in the UI
- Test with small amounts first

## 🤝 Contributing

1. Test your changes locally
2. Ensure all wallet connections work
3. Verify transfers complete successfully
4. Update this guide if needed

## 📞 Support

For issues or questions:
- Check browser console logs
- Verify network configurations
- Test with fresh wallet connections
