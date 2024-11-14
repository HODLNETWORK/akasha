const hre = require("hardhat");

async function main() {
  const contractAddress = "0xfED6a7d8C083c5403Ac785196900eb9a721f6E8a";
  const AKASHA_TOKEN = "0x54b659832f59c24ceC0E4A2Cd193377F1BCEfc3c";
  const ENDPOINT = "0x1a44076050125825900e736c501f859c50fE728c";
  const OWNER = "0x44931cEbc640EB27F9ab3FEAc1E39e16e121C8F9";

  console.log("Verifying contract...");
  
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [
        AKASHA_TOKEN,
        ENDPOINT,
        OWNER
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