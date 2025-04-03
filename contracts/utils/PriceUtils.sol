// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library PriceUtils {
    function calculateTokenPrice(uint256 assetValue, uint256 supply) internal pure returns (uint256) {
        require(supply > 0, "Invalid supply");
        return assetValue / supply;
    }
}
