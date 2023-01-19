import { network, ethers } from "hardhat";
import * as fs from "fs";
import { developmentChains, proposalsFile, VOTING_PERIOD } from "../helper-hardhat-config";
import { moveblocks } from "../utils/move-blocks";

const index = 0;

async function main(proposalIndex: number) {
    const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
    const proposalId = proposals[network.config.chainId!][proposalIndex];
    //0 = Against, 1 = For, 2 = Abstain
    const voteWay = 1;
    const governor = await ethers.getContract("GovernorContract");
    const reason = "your reason";
    const voteTxResponse = await governor.castVoteWithReason(
        proposalId,
        voteWay,
        reason
    );
    await voteTxResponse.wait(1);
    if(developmentChains.includes(network.name)){
        await moveblocks(VOTING_PERIOD + 1);
    }
    console.log("voted!");
}

main(index)
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});