// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RealEstateNFT is ERC721, Ownable {
    uint256 private _nextTokenId;

    // Structure to store building verification details
    struct BuildingBadge {
        string buildingName;
        string location;
        bool isVerified;
        uint256 verificationDate;
        string badgeURI;
    }

    // Mapping from token ID to Building Badge details
    mapping(uint256 => BuildingBadge) public buildingBadges;
    
    // Events
    event BuildingVerified(uint256 tokenId, string buildingName, bool isVerified);
    event BadgeIssued(uint256 tokenId, address recipient, string buildingName);

    constructor() ERC721("MetaWorldAsset Building Badge", "MHB") Ownable(msg.sender) {}

    // Function to check if a token exists
    function exists(uint256 tokenId) public view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    // Function to issue a new badge NFT
    function issueBadge(
        address recipient,
        string memory buildingName,
        string memory location,
        string memory badgeURI
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(recipient, tokenId);

        buildingBadges[tokenId] = BuildingBadge({
            buildingName: buildingName,
            location: location,
            isVerified: true,
            verificationDate: block.timestamp,
            badgeURI: badgeURI
        });

        emit BadgeIssued(tokenId, recipient, buildingName);
        emit BuildingVerified(tokenId, buildingName, true);

        return tokenId;
    }

    // Function to verify a building's badge
    function verifyBuilding(uint256 tokenId) public onlyOwner {
        require(exists(tokenId), "Badge does not exist");
        buildingBadges[tokenId].isVerified = true;
        buildingBadges[tokenId].verificationDate = block.timestamp;
        
        emit BuildingVerified(
            tokenId,
            buildingBadges[tokenId].buildingName,
            true
        );
    }

    // Function to revoke verification
    function revokeVerification(uint256 tokenId) public onlyOwner {
        require(exists(tokenId), "Badge does not exist");
        buildingBadges[tokenId].isVerified = false;
        
        emit BuildingVerified(
            tokenId,
            buildingBadges[tokenId].buildingName,
            false
        );
    }

    // Function to get building badge details
    function getBuildingBadge(uint256 tokenId) public view returns (
        string memory buildingName,
        string memory location,
        bool verificationStatus,
        uint256 verificationDate,
        string memory badgeURI
    ) {
        require(exists(tokenId), "Badge does not exist");
        BuildingBadge memory badge = buildingBadges[tokenId];
        return (
            badge.buildingName,
            badge.location,
            badge.isVerified,
            badge.verificationDate,
            badge.badgeURI
        );
    }

    // Function to check if a building is verified
    function isVerified(uint256 tokenId) public view returns (bool) {
        require(exists(tokenId), "Badge does not exist");
        return buildingBadges[tokenId].isVerified;
    }

    // Hook that is called before any token transfer
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        address previousOwner = super._update(to, tokenId, auth);

        // Reset verification status when token is transferred
        if (from != address(0) && to != address(0)) { // Skip during minting and burning
            buildingBadges[tokenId].isVerified = false;
            emit BuildingVerified(
                tokenId,
                buildingBadges[tokenId].buildingName,
                false
            );
        }

        return previousOwner;
    }
}