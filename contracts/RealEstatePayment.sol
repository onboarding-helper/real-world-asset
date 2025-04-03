// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract RealEstatePayment {
    address public builder;
    uint public propertyPrice;
    bool public isSold;

    event PropertyPurchased(address indexed buyer, uint amount);

    constructor(uint _propertyPrice) {
        builder = msg.sender;
        propertyPrice = _propertyPrice;
        isSold = false;
    }

    function buyProperty() external payable {
        require(!isSold, "Property already sold");
        require(msg.value == propertyPrice, "Send exact property price");

        payable(builder).transfer(msg.value);
        isSold = true;

        emit PropertyPurchased(msg.sender, msg.value);
    }
}
