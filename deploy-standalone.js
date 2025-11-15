import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

async function deploy() {
  console.log('🚀 Starting standalone deployment...');
  
  // Network configuration
  const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8545'; // Local network
  const PRIVATE_KEY = process.env.PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'; // Default Hardhat key
  const USDC_ADDRESS = '0x3600000000000000000000000000000000000000';
  
  // Setup provider and wallet
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  
  console.log('📍 Deploying from address:', wallet.address);
  
  try {
    // Load contract artifacts
    const CarbonPointsArtifact = loadContract('CarbonPoints');
    const OffsetManagerArtifact = loadContract('OffsetManager');
    
    // Deploy CarbonPoints
    console.log('📄 Deploying CarbonPoints...');
    const CarbonPointsFactory = new ethers.ContractFactory(
      CarbonPointsArtifact.abi,
      CarbonPointsArtifact.bytecode,
      wallet
    );
    const carbonPoints = await CarbonPointsFactory.deploy();
    await carbonPoints.waitForDeployment();
    const carbonPointsAddress = await carbonPoints.getAddress();
    console.log('✅ CarbonPoints deployed to:', carbonPointsAddress);
    
    // Deploy OffsetManager
    console.log('📄 Deploying OffsetManager...');
    const OffsetManagerFactory = new ethers.ContractFactory(
      OffsetManagerArtifact.abi,
      OffsetManagerArtifact.bytecode,
      wallet
    );
    const offsetManager = await OffsetManagerFactory.deploy(USDC_ADDRESS, carbonPointsAddress);
    await offsetManager.waitForDeployment();
    const offsetManagerAddress = await offsetManager.getAddress();
    console.log('✅ OffsetManager deployed to:', offsetManagerAddress);
    
    // Transfer ownership
    console.log('🔑 Transferring ownership...');
    await carbonPoints.transferOwnership(offsetManagerAddress);
    console.log('✅ Ownership transferred!');
    
    // Save deployment info
    const deploymentInfo = {
      network: RPC_URL,
      contracts: {
        CarbonPoints: carbonPointsAddress,
        OffsetManager: offsetManagerAddress,
        USDC: USDC_ADDRESS
      },
      timestamp: new Date().toISOString()
    };
    
    fs.writeFileSync('deployment.json', JSON.stringify(deploymentInfo, null, 2));
    
    console.log('\n🎉 Deployment Summary:');
    console.log('========================');
    console.log('CarbonPoints: ', carbonPointsAddress);
    console.log('OffsetManager:', offsetManagerAddress);
    console.log('USDC Address: ', USDC_ADDRESS);
    console.log('========================');
    console.log('📄 Deployment info saved to deployment.json');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

deploy().catch(console.error);
