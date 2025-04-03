// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./RWAAssetToken.sol";

contract YieldVault {
    RWAAssetToken public token;
    mapping(address => uint256) public staked;
    mapping(address => uint256) public rewards;

    constructor(address tokenAddress) {
        token = RWAAssetToken(tokenAddress);
    }

    function stake(uint256 amount) external {
        token.transferFrom(msg.sender, address(this), amount);
        staked[msg.sender] += amount;
    }

    function distributeYield(address user, uint256 yieldAmount) external {
        // Admin adds yield
        rewards[user] += yieldAmount;
    }

    function claim() external {
        uint256 reward = rewards[msg.sender];
        rewards[msg.sender] = 0;
        token.transfer(msg.sender, reward);
    }
}
