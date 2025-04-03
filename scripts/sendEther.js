const { ethers } = require("hardhat");

async function main() {
  const [sender] = await ethers.getSigners();
  
  // Get initial balances
  console.log("\nInitial Balances:");
  console.log("Sender Account:", sender.address);
  const senderBalance = await ethers.provider.getBalance(sender.address);
  console.log(`Balance: ${ethers.formatEther(senderBalance)} ETH`);

  // Get contract addresses
  const SENDER_ADDRESS = "0xA887973a2EC1a3B4C7d50b84306eBCBC21bF2d5A";  // From deploy.js
  const RECEIVER_ADDRESS = "0xc3b3dBE3d12128FDFf1694dd55fb18f8775E6667"; // From deployReceiver.js

  // Get contract instances
  const Sender = await ethers.getContractFactory("Sender");
  const Receiver = await ethers.getContractFactory("Receiver");
  const senderContract = Sender.attach(SENDER_ADDRESS);
  const receiverContract = Receiver.attach(RECEIVER_ADDRESS);

  // Amount to send
  const amountToSend = ethers.parseEther("2.0");
  console.log(`\nSending ${ethers.formatEther(amountToSend)} ETH...`);

  // Send the transaction
  const tx = await senderContract.sendEther({ value: amountToSend });
  await tx.wait();
  console.log("Transaction completed!");

  // Get final balances
  console.log("\nFinal Balances:");
  
  const receiverBalance = await receiverContract.getBalance();
  console.log(`Receiver Contract (${RECEIVER_ADDRESS})`);
  console.log(`Balance: ${ethers.formatEther(receiverBalance)} ETH`);

  const senderContractBalance = await ethers.provider.getBalance(SENDER_ADDRESS);
  console.log(`\nSender Contract (${SENDER_ADDRESS})`);
  const senderBalance2 = await ethers.provider.getBalance(sender.address);
  console.log(`Balance: ${ethers.formatEther(senderBalance2)} ETH`);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 