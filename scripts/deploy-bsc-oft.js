const { ethers } = require("hardhat");

const BSC_ENDPOINT = "0x1a44076050125825900e736c501f859c50fE728c";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying BSC OFT with account:", deployer.address);
  
  console.log("Using endpoint:", BSC_ENDPOINT);
  
  const AkashaOFT = await ethers.getContractFactory("AkashaOFT");
  console.log("Deploying AkashaOFT...");
  
  const oft = await AkashaOFT.deploy(
    "Akasha",           // name
    "AKASHA",          // symbol
    BSC_ENDPOINT,      // endpoint
    deployer.address,  // owner
    {
      gasLimit: 3000000,
      gasPrice: ethers.utils.parseUnits("6", "gwei"),
      type: 0
    }
  );

  console.log("Waiting for deployment...");
  await oft.deployed();
  console.log("AkashaOFT deployed to:", oft.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 