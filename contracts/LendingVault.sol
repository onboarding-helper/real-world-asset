// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./RWAAssetToken.sol";

contract LendingVault {
    RWAAssetToken public token;
    uint256 public loanToValueRatio = 60; // 60%

    mapping(address => uint256) public collateral;
    mapping(address => uint256) public debt;

    constructor(address _token) {
        token = RWAAssetToken(_token);
    }

    function depositCollateral(uint256 amount) external {
        token.transferFrom(msg.sender, address(this), amount);
        collateral[msg.sender] += amount;
    }

    function borrow(uint256 amount) external {
        uint256 maxBorrow = (collateral[msg.sender] * loanToValueRatio) / 100;
        require(amount <= maxBorrow, "Over LTV limit");
        debt[msg.sender] += amount;
        token.transfer(msg.sender, amount);
    }

    function repay(uint256 amount) external {
        require(debt[msg.sender] >= amount, "Too much repay");
        token.transferFrom(msg.sender, address(this), amount);
        debt[msg.sender] -= amount;
    }
}
