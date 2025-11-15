import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load contract artifacts
function loadContract(name) {
  const artifactPath = path.join(__dirname, 'artifacts', 'contracts', `${name}.sol`, `${name}.json`);
  if (!fs.existsSync(artifactPath)) {
    throw new Error(`Contract artifact not found: ${artifactPath}`);
  }
  return JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
}

async function deployManually() {
  console.log('🚀 Manual deployment to Arc Testnet...');
  
  const RPC_URL = 'https://rpc.testnet.arc.network';
  const PRIVATE_KEY = process.env.PRIVATE_KEY || '0x6026d368d590751f6fd5d1d1257ecf1d471c7aaf5403ac4cae824cfe28f8aa04';
  const USDC_ADDRESS = '0x3600000000000000000000000000000000000000';
  
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  
  console.log('📍 Deployer:', wallet.address);
  
  try {
    // Load contracts
    const CarbonPointsArtifact = loadContract('CarbonPoints');
    const OffsetManagerArtifact = loadContract('OffsetManager');
    
    // Deploy CarbonPoints
    console.log('\n🌱 Deploying CarbonPoints...');
    const carbonPointsTx = {
      data: CarbonPointsArtifact.bytecode,
      gasLimit: 2000000,
    };
    
    const deployTx1 = await wallet.sendTransaction(carbonPointsTx);
    console.log('📤 CarbonPoints transaction sent:', deployTx1.hash);
    
    // Wait for confirmation with timeout
    let carbonPointsReceipt;
    let attempts = 0;
    while (attempts < 30) {
      try {
        carbonPointsReceipt = await provider.getTransactionReceipt(deployTx1.hash);
        if (carbonPointsReceipt) break;
      } catch (e) {
        // Continue trying
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
      console.log(`⏳ Waiting for confirmation... attempt ${attempts}/30`);
    }
    
    if (!carbonPointsReceipt) {
      console.log('⚠️  Could not get CarbonPoints receipt, but transaction was sent.');
      console.log('🔍 Check manually: https://testnet.arcscan.app/tx/' + deployTx1.hash);
      return;
    }
    
    const carbonPointsAddress = carbonPointsReceipt.contractAddress;
    console.log('✅ CarbonPoints deployed at:', carbonPointsAddress);
    
    // Deploy OffsetManager
    console.log('\n🏭 Deploying OffsetManager...');
    const OffsetManagerFactory = new ethers.ContractFactory(
      OffsetManagerArtifact.abi,
      OffsetManagerArtifact.bytecode,
      wallet
    );
    
    // Encode constructor parameters: (usdcAddress, carbonPointsAddress)
    const constructorParams = ethers.AbiCoder.defaultAbiCoder().encode(
      ['address', 'address'],
      [USDC_ADDRESS, carbonPointsAddress]
    );
    
    const offsetManagerBytecode = OffsetManagerArtifact.bytecode + constructorParams.slice(2);
    
    const offsetManagerTx = {
      data: offsetManagerBytecode,
      gasLimit: 2000000,
    };
    
    const deployTx2 = await wallet.sendTransaction(offsetManagerTx);
    console.log('📤 OffsetManager transaction sent:', deployTx2.hash);
    
    // Save deployment info even if we can't confirm
    const deploymentInfo = {
      network: 'arc-testnet',
      chainId: 5042002,
      timestamp: new Date().toISOString(),
      deployer: wallet.address,
      usdcAddress: USDC_ADDRESS,
      transactions: {
        carbonPoints: deployTx1.hash,
        offsetManager: deployTx2.hash
      },
      contracts: {
        carbonPointsAddress: carbonPointsAddress,
        // We'll need to check this manually
        offsetManagerAddress: 'PENDING_CONFIRMATION'
      },
      explorerLinks: {
        carbonPoints: `https://testnet.arcscan.app/tx/${deployTx1.hash}`,
        offsetManager: `https://testnet.arcscan.app/tx/${deployTx2.hash}`
      }
    };
    
    const outputPath = path.join(__dirname, 'deployments', 'arc-manual.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));
    
    console.log('\n🎉 Deployment Transactions Sent!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🌱 CarbonPoints: ${carbonPointsAddress}`);
    console.log(`🔍 Check: https://testnet.arcscan.app/tx/${deployTx1.hash}`);
    console.log(`🏭 OffsetManager: Pending confirmation`);
    console.log(`🔍 Check: https://testnet.arcscan.app/tx/${deployTx2.hash}`);
    console.log(`📄 Details saved: ${outputPath}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('\n💡 Next steps:');
    console.log('1. Check the transactions in Arc explorer');
    console.log('2. Wait for confirmations (may take a few minutes)');
    console.log('3. Update the app with contract addresses');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    throw error;
  }
}

deployManually().catch(console.error);
