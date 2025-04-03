// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Sender {
    address payable public receiver;

    constructor(address payable _receiver) {
        receiver = _receiver;
    }

    function sendEther() public payable {
        require(msg.value > 0, "Must send some ETH");
        receiver.transfer(msg.value);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}