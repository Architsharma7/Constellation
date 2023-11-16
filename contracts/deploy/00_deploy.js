require("hardhat-deploy")
require("hardhat-deploy-ethers")

const { ethers } = require("hardhat")
const { Console } = require("console")

const private_key = network.config.accounts[0]
const wallet = new ethers.Wallet(private_key, ethers.provider)

module.exports = async({ deployments }) => {
    const { deploy } = deployments
    console.log("Wallet+ Ethereum Address:", wallet.address)
    const a = await deploy("", {
        from: wallet.address,
        args: [],
        log: true,
    });
    console.log(a.address)


}
