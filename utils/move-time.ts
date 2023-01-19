import { network } from "hardhat";

export async function movetime(amount: number) {
    console.log("Moving Time...");
    await network.provider.send("evm_increaseTime", [amount]);
    console.log(`Moved forward ${amount} seconds`);
    
}