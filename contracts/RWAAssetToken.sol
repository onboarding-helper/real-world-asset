// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RWAAssetToken is ERC20, Ownable {
    constructor(string memory name, string memory symbol, uint256 supply, address initialOwner )
        ERC20(name, symbol)
          Ownable(initialOwner)
    {
        _mint(msg.sender, supply);
    }
}
