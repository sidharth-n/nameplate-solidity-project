const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules")

module.exports = buildModule("auctionModule", m => {
  const auction = m.contract("Auction")
  return auction
})
