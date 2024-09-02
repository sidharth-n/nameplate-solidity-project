const hre = require("hardhat")

async function main() {
  console.log("Attempting to connect to Sonic testnet...")

  try {
    const provider = hre.ethers.provider

    const network = await provider.getNetwork()
    console.log("Successfully connected to : ", network.address)
    const accounts = await hre.ethers.getSigners()
    console.log("Using account:", accounts[0].address)
  } catch (e) {
    console.log("Error connecting", e)
  }
}

main()
