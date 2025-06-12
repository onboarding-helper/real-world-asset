const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy NFT Contract
  const NFT = await ethers.getContractFactory("RealEstateNFT");
  const nft = await NFT.deploy();
  await nft.waitForDeployment(); // Wait for the deployment to be mined
  const nftAddress = await nft.getAddress();
  console.log("NFT Contract deployed at:", nftAddress);

  // Issue a test badge
  const testBadge = await nft.issueBadge(
    deployer.address,
    "MetaRWA Tower",
    "Crypto Valley, Block #1",
    "https://metaworldasset.com/badges/1",
  );
  console.log("Test badge issued:", await testBadge.wait()); // Wait for the badge issuance transaction

  // Use the existing receiver address
  const RECEIVER_ADDRESS = "0xA17c98A79470a8A5eF9C46c04104fb75D456b98c";
  console.log("Using receiver address:", RECEIVER_ADDRESS);

  // Deploy new Sender contract
  const Sender = await ethers.getContractFactory("Sender");
  const sender = await Sender.deploy(RECEIVER_ADDRESS);
  await sender.waitForDeployment(); // Wait for Sender contract to be deployed
  const senderAddress = await sender.getAddress();
  console.log("New Sender Contract deployed to:", senderAddress);

  // Verify the receiver address
  const configuredReceiver = await sender.receiver();
  console.log("Configured receiver address:", configuredReceiver);

  // Deploy RealEstateToken (ERC-20 Token)
  const Token = await ethers.getContractFactory("RWAAssetToken");

  const token = await Token.deploy(
    "RealEstateToken",
    "RET",
    ethers.parseUnits("1000000", 18),
    deployer.address,
  );
  await token.waitForDeployment(); // Wait for RealEstateToken contract to be deployed
  const tokenAddress = await token.getAddress();
  console.log("RealEstateToken deployed to:", tokenAddress);

  // Deploy YieldVault contract
  const Yield = await ethers.getContractFactory("YieldVault");
  const yieldVault = await Yield.deploy(tokenAddress);
  await yieldVault.waitForDeployment(); // Wait for YieldVault contract to be deployed
  const yieldAddress = await yieldVault.getAddress();
  console.log("YieldVault deployed to:", yieldAddress);

  // Deploy LendingVault contract
  const Lending = await ethers.getContractFactory("LendingVault");
  const lendingVault = await Lending.deploy(tokenAddress);
  await lendingVault.waitForDeployment(); // Wait for LendingVault contract to be deployed
  const lendingAddress = await lendingVault.getAddress();
  console.log("LendingVault deployed to:", lendingAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
