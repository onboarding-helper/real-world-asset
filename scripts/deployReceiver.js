const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy the Receiver contract
  const Receiver = await ethers.getContractFactory("Receiver");
  const receiver = await Receiver.deploy();
  await receiver.waitForDeployment();

  const contractAddress = await receiver.getAddress();
  console.log("Receiver Contract deployed to:", contractAddress);
  
  const balance = await ethers.provider.getBalance(contractAddress);
  console.log(`Receiver Contract Balance: ${ethers.formatEther(balance)} ETH`);

  // Save this address to use as RECEIVER_ADDRESS in .env
  console.log("\nAdd this to your .env file:");
  console.log(`RECEIVER_ADDRESS=${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });