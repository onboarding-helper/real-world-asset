// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Receiver {
    // Event to log received payments
    event ReceivedPayment(address indexed from, uint256 amount);

    // Make contract payable
    receive() external payable {
        emit ReceivedPayment(msg.sender, msg.value);
    }

    // Fallback function
    fallback() external payable {
        emit ReceivedPayment(msg.sender, msg.value);
    }

    // Get contract balance
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
} 