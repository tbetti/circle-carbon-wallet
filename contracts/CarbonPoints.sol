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
