import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// USDC ABI (minimal for balance checking)
const USDC_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

// Load contract artifacts
function loadContract(name) {
  const artifactPath = path.join(__dirname, 'artifacts', 'contracts', `${name}.sol`, `${name}.json`);
  if (!fs.existsSync(artifactPath)) {
    throw new Error(`Contract artifact not found: ${artifactPath}`);
  }
  return JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
}

async function deploy() {
  console.log('🚀 Starting deployment to Arc Testnet (USDC-based)...');
  
  // Network configuration for Arc Testnet
  const RPC_URL = 'https://rpc.testnet.arc.network'; // Use primary Arc RPC
  const PRIVATE_KEY = process.env.PRIVATE_KEY || '0x6026d368d590751f6fd5d1d1257ecf1d471c7aaf5403ac4cae824cfe28f8aa04';
  const USDC_ADDRESS = '0x3600000000000000000000000000000000000000'; // Official Arc Testnet USDC
  
  if (!PRIVATE_KEY || PRIVATE_KEY === 'your_private_key_here') {
    console.log('❌ Error: Please set your PRIVATE_KEY in .env file');
    return;
  }
  
  // Setup provider and wallet
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  
  console.log('📍 Deploying from address:', wallet.address);
  console.log('💰 USDC Token Address:', USDC_ADDRESS);
  
  // Check USDC balance (what we actually need for gas on Arc!)
  try {
    const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, provider);
    const balance = await usdcContract.balanceOf(wallet.address);
    const decimals = await usdcContract.decimals();
    const symbol = await usdcContract.symbol();
    
    const formattedBalance = ethers.formatUnits(balance, decimals);
    console.log(`💰 ${symbol} Balance:`, formattedBalance, symbol);
    
    if (balance === 0n) {
      console.log('❌ ERROR: Account has 0 USDC!');
      console.log('🔗 Get Arc testnet USDC from Circle faucet: https://faucet.circle.com/');
      console.log('📝 You need USDC for gas fees on Arc Testnet');
      return;
    }
    
    // Check if we have enough USDC for deployment (estimate ~0.1 USDC should be plenty)
    const minRequired = ethers.parseUnits('0.05', decimals); // 0.05 USDC minimum
    if (balance < minRequired) {
      console.log('⚠️  Warning: Low USDC balance. Consider getting more from faucet.');
    }
    
  } catch (error) {
    console.log('⚠️  Could not check USDC balance:', error.message);
    console.log('🔍 Make sure USDC address is correct and you have Arc testnet access');
    return;
  }
  
  try {
    // Load contract artifacts
    console.log('📄 Loading contract artifacts...');
    const CarbonPointsArtifact = loadContract('CarbonPoints');
    const OffsetManagerArtifact = loadContract('OffsetManager');
    
    // Deploy CarbonPoints contract
    console.log('\n🌱 Deploying CarbonPoints contract...');
    const CarbonPointsFactory = new ethers.ContractFactory(
      CarbonPointsArtifact.abi,
      CarbonPointsArtifact.bytecode,
      wallet
    );
    
    // Deploy with USDC-appropriate gas settings
    const carbonPoints = await CarbonPointsFactory.deploy({
      gasLimit: 2000000,  // Conservative gas limit
      // Note: Arc uses USDC for gas, so no gasPrice needed in traditional sense
    });
    
    console.log('⏳ Waiting for CarbonPoints deployment...');
    await carbonPoints.waitForDeployment();
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2s delay
    const carbonPointsAddress = await carbonPoints.getAddress();
    console.log('✅ CarbonPoints deployed at:', carbonPointsAddress);
    
    // Deploy OffsetManager contract
    console.log('\n🏭 Deploying OffsetManager contract...');
    const OffsetManagerFactory = new ethers.ContractFactory(
      OffsetManagerArtifact.abi,
      OffsetManagerArtifact.bytecode,
      wallet
    );
    
    const offsetManager = await OffsetManagerFactory.deploy(
      USDC_ADDRESS,
      carbonPointsAddress,
      {
        gasLimit: 2000000,
      }
    );
    
    console.log('⏳ Waiting for OffsetManager deployment...');
    await offsetManager.waitForDeployment();
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2s delay
    const offsetManagerAddress = await offsetManager.getAddress();
    console.log('✅ OffsetManager deployed at:', offsetManagerAddress);
    
    // Transfer ownership of CarbonPoints to OffsetManager so it can mint
    console.log('\n🔗 Setting up contract permissions...');
    const transferOwnershipTx = await carbonPoints.transferOwnership(offsetManagerAddress, {
      gasLimit: 100000,
    });
    await transferOwnershipTx.wait();
    console.log('✅ CarbonPoints ownership transferred to OffsetManager');
    
    // Save deployment addresses
    const    deploymentInfo = {
      network: 'arc-testnet',
      chainId: 5042002, // Official Arc testnet chain ID
      timestamp: new Date().toISOString(),
      deployer: wallet.address,
      usdcAddress: USDC_ADDRESS,
      contracts: {
        CarbonPoints: {
          address: carbonPointsAddress,
          name: 'Carbon Points Token'
        },
        OffsetManager: {
          address: offsetManagerAddress,
          name: 'Offset Manager'
        }
      }
    };
    
    const outputPath = path.join(__dirname, 'deployments', 'arc-testnet.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));
    
    console.log('\n🎉 Deployment Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📍 Network: Arc Testnet`);
    console.log(`💰 USDC Address: ${USDC_ADDRESS}`);
    console.log(`🌱 CarbonPoints: ${carbonPointsAddress}`);
    console.log(`🏭 OffsetManager: ${offsetManagerAddress}`);
    console.log(`📄 Deployment info saved to: ${outputPath}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Test the setup
    console.log('\n🧪 Testing contract setup...');
    console.log(`💱 Conversion rate: 1 USDC = 1 Carbon Point (fixed in contract)`);
    
    const carbonOwner = await carbonPoints.owner();
    console.log(`� CarbonPoints owner: ${carbonOwner}`);
    console.log(`🔐 OffsetManager address: ${offsetManagerAddress}`);
    console.log(`✅ Ownership transfer: ${carbonOwner === offsetManagerAddress ? 'SUCCESS' : 'FAILED'}`);
    
    console.log('\n✨ Deployment completed successfully!');
    console.log('🔗 Ready to integrate with your app!');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    if (error.reason) {
      console.error('📝 Reason:', error.reason);
    }
    throw error;
  }
}

// Handle script execution
if (import.meta.url === `file://${process.argv[1]}`) {
  deploy().catch((error) => {
    console.error('💥 Deployment error:', error);
    process.exit(1);
  });
}

export default deploy;
