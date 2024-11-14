const { ethers } = require("hardhat");

// LayerZero endpoints by chain
const ENDPOINTS = {
  base: "0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675", // Base mainnet
  bsc: "0x3c2269811836af69497E5F486A85D7316753cf62",  // BSC mainnet
};

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const AkashaOFT = await ethers.getContractFactory("AkashaOFT");
  
  // Deploy on current network
  const network = await ethers.provider.getNetwork();
  const endpoint = ENDPOINTS[network.name];
  if (!endpoint) throw new Error(`No endpoint for network ${network.name}`);

  const oft = await AkashaOFT.deploy(
    "Akasha",           // name
    "AKASHA",          // symbol
    endpoint,          // LayerZero endpoint
    6                  // sharedDecimals (using 6 as recommended)
  );

  await oft.deployed();
  console.log(`AkashaOFT deployed to ${oft.address}`);

  // Helper function to convert address to bytes32
  function addressToBytes32(address) {
    return ethers.utils.hexZeroPad(address, 32);
  }

  // Set peer addresses after both contracts are deployed
  // You'll need to manually set these after deploying to both chains
  console.log(`
To set up peer connection, call:
await oft.setPeer(REMOTE_CHAIN_ID, "${addressToBytes32(oft.address)}");

To configure DVN settings, call:
await oft.setConfig(
  SEND_VERSION,
  REMOTE_CHAIN_ID,
  SEND_CONFIG_TYPE,
  SEND_CONFIG
);
  `);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 

  async function setupAdapter(adapter) {
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