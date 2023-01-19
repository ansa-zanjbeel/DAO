import { error } from "console";
import { ethers, network } from "hardhat";
import { NEW_STORE_VALUE, proposalsFile, PROPOSAL_DESCRIPTION, VOTING_DELAY } from "../helper-hardhat-config";
import { FUNC } from "../helper-hardhat-config";
import { developmentChains } from "../helper-hardhat-config";
import { moveblocks } from "../utils/move-blocks";
import * as fs from "fs";

export async function propose(args: any[], functiontoCall: string, proposalDescription: string ) {
    const governor = await ethers.getContract("GovernorContract");
    const box = await ethers.getContract("Box");

    const encodedFunctionCall = box.interface.encodeFunctionData(
        functiontoCall,
        args
    );
    console.log(`Proposing ${functiontoCall} on ${box.address} with ${args}`);
    console.log(`Proposal Description: \n ${proposalDescription}`);
    const proposeTx = await governor.propose(
        [box.address],
        [0],
        [encodedFunctionCall],
        proposalDescription
    );

    const proposeReceipt = await proposeTx.wait(1);

    if(developmentChains.includes(network.name)){
        await moveblocks(VOTING_DELAY + 1);

    }

    const proposalId = proposeReceipt.events[0].args.proposalId;
    let proposals = JSON.parse(fs.readFileSync(proposalsFile,"utf8"));
    proposals[network.config.chainId!.toString()].push(proposalId.toString());
    fs.writeFileSync(proposalsFile, JSON.stringify(proposals));
}

propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
.then(()=> process.exit(0))
.catch((error) => {
    console.log(error);
    process.exit(1);
});