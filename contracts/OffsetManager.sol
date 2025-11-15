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
