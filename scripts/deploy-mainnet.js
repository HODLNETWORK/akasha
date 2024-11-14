const { ethers } = require("hardhat");

const ENDPOINTS = {
  "base": "0x1a44076050125825900e736c501f859c50fE728c",
  "bsc": "0x1a44076050125825900e736c501f859c50fE728c",
  "8453": "0x1a44076050125825900e736c501f859c50fE728c", // Base mainnet
  "56": "0x1a44076050125825900e736c501f859c50fE728c"    // BSC mainnet
};

const AKASHA_TOKEN = "0x54b659832f59c24ceC0E4A2Cd193377F1BCEfc3c";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying adapter with account:", deployer.address);

  const network = await ethers.provider.getNetwork();
  const chainId = network.chainId.toString();
  console.log("Network chainId:", chainId);
  
  const endpoint = ENDPOINTS[chainId];
  if (!endpoint) throw new Error(`No endpoint for chainId ${chainId}`);
  
  console.log("Using endpoint:", endpoint);
  console.log("Using token:", AKASHA_TOKEN);
  
  const AkashaOFTAdapter = await ethers.getContractFactory("AkashaOFTAdapter");
  console.log("Deploying AkashaOFTAdapter...");
  
  const adapter = await AkashaOFTAdapter.deploy(
    AKASHA_TOKEN,
    endpoint,
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