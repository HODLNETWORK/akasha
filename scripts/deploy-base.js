const { ethers } = require("hardhat");

const BASE_ENDPOINT = "0x1a44076050125825900e736c501f859c50fE728c";
const BASE_TOKEN = "0x54b659832f59c24ceC0E4A2Cd193377F1BCEfc3c";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying Base adapter with account:", deployer.address);
  
  console.log("Using endpoint:", BASE_ENDPOINT);
  console.log("Using token:", BASE_TOKEN);
  
  const AkashaOFTAdapter = await ethers.getContractFactory("AkashaOFTAdapter");
  console.log("Deploying AkashaOFTAdapter...");
  
  const adapter = await AkashaOFTAdapter.deploy(
    BASE_TOKEN,
    BASE_ENDPOINT,
    deployer.address
  );

  await adapter.deployed();
  console.log("AkashaOFTAdapter deployed to:", adapter.address);

  // Setup adapter configurations
  console.log("Setting up adapter configurations...");
  
  // Set enforced options for 60k gas (recommended by LayerZero)
  const options = ethers.utils.solidityPack(
    ["uint16", "uint256"],
    [1, 60000] // type 1 = SEND, gas = 60000
  );

  const enforcedOptions = [{
    eid: 102, // BSC endpoint ID
    msgType: 1, // SEND type
    options: options
  }];

  await adapter.setEnforcedOptions(enforcedOptions);
  console.log("Enforced options set");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 