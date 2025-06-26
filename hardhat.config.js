require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");

const { SEPOLIA_URL, SEPOLIA_ACCOUNT_PRIVATE_KEY, ETHERSCAN_API_KEY } =
    process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.28",
    networks: {
        sepolia: {
            url: SEPOLIA_URL,
            accounts: [String(SEPOLIA_ACCOUNT_PRIVATE_KEY)],
            chainId: 11155111,
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
};
