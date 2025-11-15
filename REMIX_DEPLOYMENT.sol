// REMIX DEPLOYMENT INSTRUCTIONS
// =============================

/*
1. Go to: https://remix.ethereum.org
2. Create a new workspace
3. Copy the contract files below into Remix
4. Compile and deploy!

STEP 1: Create CarbonPoints.sol
*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarbonPoints is ERC20, Ownable {
    constructor() ERC20("Carbon Points", "CPOINT") Ownable(msg.sender) {}

    /// Mint points to a user after they purchase verified carbon offsets
    function mintPoints(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}

/*
STEP 2: Create OffsetManager.sol
*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CarbonPoints.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract OffsetManager {
    IERC20 public usdc;
    CarbonPoints public carbonPoints;
    address public owner;

    constructor(address _usdc, address _carbonPoints) {
        usdc = IERC20(_usdc);
        carbonPoints = CarbonPoints(_carbonPoints);
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    /// User pays USDC → mints CPOINT
    function buyOffsets(uint256 usdcAmount) external {
        require(usdcAmount > 0, "Amount must be > 0");

        // Transfer USDC from user to contract
        bool ok = usdc.transferFrom(msg.sender, address(this), usdcAmount);
        require(ok, "USDC transfer failed");

        // 1 USDC = 1 carbon point (simple demo logic)
        carbonPoints.mintPoints(msg.sender, usdcAmount);
    }

    /// Withdraw accumulated USDC (optional)
    function withdraw(address to, uint256 amount) external onlyOwner {
        usdc.transfer(to, amount);
    }
}

/*
DEPLOYMENT STEPS IN REMIX:
1. Deploy CarbonPoints first
2. Copy the CarbonPoints address
3. Deploy OffsetManager with USDC address and CarbonPoints address
4. Transfer ownership of CarbonPoints to OffsetManager

USDC Addresses for testnets:
- Arc Testnet: 0x3600000000000000000000000000000000000000
- Ethereum Sepolia: 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238
- Polygon Amoy: 0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582
*/
