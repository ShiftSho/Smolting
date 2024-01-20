require("dotenv").config();

// Define contract addresses and ABI
const smoltingTokenAddress = "0x69e6D553a9E90aEEecB417c7Ad75E879e57738a3"; // Smolting token contract address
const bucketContractAddress = "0x873289a1aD6Cf024B927bd13bd183B264d274c68"; // Bucket contract address
const Smolting_ABI = require("./SmoltingABI.json"); // ABI for your Smolting token contract
const Bucket_ABI = require("./BucketABI.json"); // ABI for the Bucket contract

async function main() {
  // Fetch the signer
  const [deployer] = await ethers.getSigners();

  // Create contract instances
  const smoltingTokenContract = new ethers.Contract(
    smoltingTokenAddress,
    Smolting_ABI,
    deployer
  );

  const bucketContract = new ethers.Contract(
    bucketContractAddress,
    Bucket_ABI,
    deployer
  );

  // Define the amount to deposit
  const amountToDeposit = ethers.parseUnits("10", 18); // 10 tokens for example

  // Step 1: Approve the Bucket contract to transfer your tokens
  console.log("Approving Bucket contract to spend tokens...");
  const approveTx = await smoltingTokenContract.approve(
    bucketContractAddress,
    amountToDeposit
  );
  await approveTx.wait(); // Wait for the transaction to be mined

  // Step 2: Call the drop function on the Bucket contract
  console.log("Depositing tokens to Bucket contract...");
  const dropTx = await bucketContract.drop(
    smoltingTokenAddress,
    amountToDeposit
  );
  await dropTx.wait(); // Wait for the transaction to be mined

  console.log(
    `Deposited ${ethers.formatUnits(
      amountToDeposit,
      18
    )} Smolting tokens to the Bucket contract.`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
