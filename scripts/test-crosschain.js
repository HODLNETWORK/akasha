const { ethers } = require("hardhat");

// Contract addresses from deployments
const BSC_OFT = "0xca7A227b771F0B16AA844f0972BF371B209B8D44";
const BASE_ADAPTER = "0xfED6a7d8C083c5403Ac785196900eb9a721f6E8a";

// Chain IDs
const BASE_CHAIN_ID = 8453;
const BSC_CHAIN_ID = 56;

async function main() {
  // Test functions
  async function testBscToBase() {
    console.log("\nTesting BSC -> Base transfer:");
    const bscOft = await ethers.getContractAt("AkashaOFT", BSC_OFT);
    
    // Estimate fees first
    const amount = ethers.utils.parseEther("1.0");
    const adapterInBytes32 = ethers.utils.hexZeroPad(BASE_ADAPTER, 32);
    const fees = await bscOft.estimateSendFee(BASE_CHAIN_ID, adapterInBytes32, amount, false, "0x");
    console.log(`Estimated fees: ${ethers.utils.formatEther(fees[0])} BNB`);

    // Send tokens
    const tx = await bscOft.sendFrom(
      deployer.address,
      BASE_CHAIN_ID,
      adapterInBytes32,
      amount,
      {
        value: fees[0],
        gasLimit: 300000
      }
    );
    console.log(`Transaction hash: ${tx.hash}`);
    await tx.wait();
  }

  async function testBaseToBsc() {
    console.log("\nTesting Base -> BSC transfer:");
    const baseAdapter = await ethers.getContractAt("AkashaOFTAdapter", BASE_ADAPTER);
    
    // Estimate fees
    const amount = ethers.utils.parseEther("1.0");
    const receiverInBytes32 = ethers.utils.hexZeroPad(BSC_OFT, 32);
    const fees = await baseAdapter.estimateSendFee(BSC_CHAIN_ID, receiverInBytes32, amount, false, "0x");
    console.log(`Estimated fees: ${ethers.utils.formatEther(fees[0])} ETH`);

    // Send tokens
    const tx = await baseAdapter.sendFrom(
      deployer.address,
      BSC_CHAIN_ID,
      receiverInBytes32,
      amount,
      {
        value: fees[0],
        gasLimit: 300000
      }
    );
    console.log(`Transaction hash: ${tx.hash}`);
    await tx.wait();
  }

  // Run tests
  const [deployer] = await ethers.getSigners();
  console.log("Testing with account:", deployer.address);

  await testBscToBase();
  await testBaseToBsc();
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  }); 