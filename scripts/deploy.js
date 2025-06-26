const { ethers } = require("hardhat");

const main = async () => {
    const VotingFactory = await ethers.getContractFactory("Voting");

    console.log("Deploying voting contract...");

    const voting = await VotingFactory.deploy(
        ["Candidate1", "Candidate2", "Candidate3", "Candidate4"],
        99999
    );

    console.log("Voting contract deployed");
    console.log(await voting.getAddress());
};

// deploy script using
// npx hardhat run scripts/deploy.ts

main()
    .then(() => {
        process.exit(0);
    })
    .catch((err) => {
        console.log(err);
        process.exitCode = 1;
    });
