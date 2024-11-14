const { ethers } = require("hardhat");

const ENDPOINTS = {
  baseSepolia: "0x6EDCE65403992e310A62460808c4b910D972f10f",
  bscTestnet: "0x6EDCE65403992e310A62460808c4b910D972f10f"
};

async function main() {
  try {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);

    const network = await ethers.provider.getNetwork();
    console.log("Network:", network.name);
    const endpoint = ENDPOINTS[network.name];
    if (!endpoint) throw new Error(`No endpoint for network ${network.name}`);

    const AkashaOFT = await ethers.getContractFactory("AkashaOFT");
    console.log("Deploying AkashaOFT...");

    const oft = await AkashaOFT.deploy(
      "Akasha Test",
      "tAKASHA",
      endpoint,
      deployer.address,
      {
        gasLimit: 3500000,
        gasPrice: ethers.parseUnits("20", "gwei")
      }
    );

    console.log("Deployment transaction hash:", oft.deploymentTransaction()?.hash);
    console.log("Waiting for deployment...");
    
    await oft.waitForDeployment();
    console.log("Contract deployed to:", await oft.getAddress());

  } catch (error) {
    console.error("Deployment failed:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 