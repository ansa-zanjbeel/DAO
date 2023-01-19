import { ethers, network } from "hardhat";
import { developmentChains, FUNC, MIN_DELAY, NEW_STORE_VALUE, PROPOSAL_DESCRIPTION } from "../helper-hardhat-config";
import { moveblocks } from "../utils/move-blocks";
import { movetime } from "../utils/move-time";

export async function queueAndExecute() {
    const args = [NEW_STORE_VALUE];
    const box = await ethers.getContract("Box");
    const encodedFunctionCall = box.interface.encodeFunctionData(FUNC, args);
    const descriptionHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION)
    );

    const governor = await ethers.getContract("GovernorContract");
    /* console.log("Queueing...");
     const queueTx = await governor.queue([box.address], [0], [encodedFunctionCall], descriptionHash);
 
     await queueTx.wait(1); */

    if (developmentChains.includes(network.name)) {
        await movetime(MIN_DELAY + 1);
        await moveblocks(1);
    }

    console.log("Executing...!");
   /* const executeTx = await governor.execute(
        [box.address],
        [0],
        [encodedFunctionCall],
        descriptionHash
    );

    await executeTx.wait(1) */

    const boxnewValue = await box.retrieve();
     console.log(`New Box Value: ${boxnewValue.toString()}`); 


}
queueAndExecute()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });