const hre = require("hardhat");

async function main() {
  const contractAddress = "0x3091b09a653526c736a01f416cb40d3f3957c8d5"; // Your deployed BSC contract
  const BSC_ENDPOINT = "0x1a44076050125825900e736c501f859c50fE728c";
  const OWNER = "0x44931cEbc640EB27F9ab3FEAc1E39e16e121C8F9";

  console.log("Verifying BSC OFT contract...");
  
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [
        "Akasha",           // name
        "AKASHA",          // symbol
        BSC_ENDPOINT,      // endpoint
        OWNER             // owner
      ],
    });
    console.log("Contract verified successfully");
  } catch (error) {
    console.error("Verification failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 