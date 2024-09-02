require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    sonicTestNet: {
      url: "https://rpc.sonic.fantom.network/",
      chainId: 64165,
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: "auto",
    },
  },
}
