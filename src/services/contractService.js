// services/contractService.js
import { ethers } from 'ethers';

// ABIs (simplified for this example)
const SoulboundNFTAbi = [
  "function hasRole(bytes32 role, address account) external view returns (bool)",
  "function grantRole(bytes32 role, address account) external",
  "function verifyIdentity(address entity, string memory did, bytes32 credentialHash, string memory credentialCID) external",
  "function getTokenIdByDID(string memory did) external view returns (uint256)",
  "function getDID(uint256 tokenId) external view returns (string memory)"
];

const BridgeAbi = [
  "function requestVerification(string memory did, string memory targetChain) external returns (uint256)",
  "function verificationRequests(uint256) external view returns (uint256 requestId, string sourceChain, string targetChain, string did, bool verified, uint256 timestamp)",
  "function bridgeTokens(address tokenAddress, uint256 amount, string memory targetChain) external",
  "function tokenTransferRequests(uint256) external view returns (uint256 transferId, address tokenAddress, uint256 amount, string sourceChain, string targetChain, address sender, bool completed)"
];

const ERC20Abi = [
  "function balanceOf(address account) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transfer(address recipient, uint256 amount) returns (bool)"
];

const contractAddresses = {
  polygon: {
    soulboundNFT: "0x224434fd5e24Cc3EA7E227327B6f4be0A43969F9 ",
    bridge: "0xEDe05747FB7d095d3562e7169B5632A3fBe6e9Bd",
    goldToken: "0x8415b5f0ae583E8581673427C007c720Aa610706"
  }
};

class ContractService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contracts = {};
  }

  async init() {
    if (window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
      
      // Initialize contracts
      this.contracts.soulboundNFT = new ethers.Contract(
        contractAddresses.polygon.soulboundNFT,
        SoulboundNFTAbi,
        this.signer
      );
      
      this.contracts.bridge = new ethers.Contract(
        contractAddresses.polygon.bridge,
        BridgeAbi,
        this.signer
      );
      
      this.contracts.goldToken = new ethers.Contract(
        contractAddresses.polygon.goldToken,
        ERC20Abi,
        this.signer
      );
      
      return true;
    }
    return false;
  }

  async requestVerification(did, targetChain) {
    if (!this.contracts.bridge) await this.init();
    return this.contracts.bridge.requestVerification(did, targetChain);
  }

  async bridgeTokens(tokenAddress, amount, targetChain) {
    if (!this.contracts.bridge) await this.init();
    
    // First approve the token transfer
    const tokenContract = new ethers.Contract(tokenAddress, ERC20Abi, this.signer);
    await tokenContract.approve(contractAddresses.polygon.bridge, amount);
    
    // Then call the bridge
    return this.contracts.bridge.bridgeTokens(tokenAddress, amount, targetChain);
  }

  async createIdentity(did, credentialHash, credentialCID) {
    if (!this.contracts.soulboundNFT) await this.init();
    
    const walletAddress = await this.signer.getAddress();
    return this.contracts.soulboundNFT.verifyIdentity(
      walletAddress, 
      did, 
      credentialHash, 
      credentialCID
    );
  }
}

export default new ContractService();