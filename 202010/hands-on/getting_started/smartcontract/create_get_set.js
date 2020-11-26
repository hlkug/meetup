/**
* Solidity Support
Hedera smart contracts support Solidity versions up to v0.5.9.
 
* Smart Contract State Size
Each smart contract has a maximum state size of 1MB which can store up to approximately 16,000 key-value pairs.
 */
const { 
    Client, FileCreateTransaction, ContractCreateTransaction,
    ContractFunctionParams, ContractCallQuery, ContractExecuteTransaction,
    Ed25519PrivateKey,
    Hbar 
} = require("@hashgraph/sdk");
require('dotenv').config({ path: '../.env' });

async function main() {
    const operatorAccount = process.env.ACCOUNT_ID;
    const operatorPrivateKey = Ed25519PrivateKey.fromString(process.env.PRIVATE_KEY);

    // `Client.forMainnet()` is provided for connecting to Hedera mainnet
    const client = Client.forTestnet();

    // Defaults the operator account ID and key such that all generated transactions will be paid for
    // by this account and be signed by this key
    client.setOperator(operatorAccount, operatorPrivateKey);


    const smartContract = require("./stateful.json");
    const smartContractByteCode = smartContract.contracts[ "stateful.sol:StatefulContract" ].bin;

    console.log("contract bytecode size:", smartContractByteCode.length, "bytes");

    // 파일 생성(스마트 컨트랙트)
    const byteCodeFileId = (await (await new FileCreateTransaction()
        .setMaxTransactionFee(new Hbar(3))
        .addKey(operatorPrivateKey.publicKey)
        .setContents(smartContractByteCode)
        .execute(client))
        .getReceipt(client))
        .getFileId();

    console.log("contract bytecode file:", byteCodeFileId.toString());

    // 스마트 컨트랙트 생성(with File ID)
    const record = await (await new ContractCreateTransaction()
        .setMaxTransactionFee(new Hbar(100))
        // Failing to set this to an adequate amount
        // INSUFFICIENT_GAS
        .setGas(2000) // ~1260
        // Failing to set parameters when parameters are required
        // CONTRACT_REVERT_EXECUTED
        .setConstructorParams(new ContractFunctionParams()
            .addString("hello from hedera"))
        .setBytecodeFileId(byteCodeFileId)
        .execute(client))
        .getRecord(client);

    const newContractId = record.receipt.getContractId();

    console.log("contract create gas used:", record.getContractCreateResult().gasUsed);
    console.log("contract create transaction fee:", record.transactionFee.asTinybar());
    console.log("contract:", newContractId.toString());

    // getMessage() 함수 호출(Query...)
    let callResult = await new ContractCallQuery()
        .setContractId(newContractId)
        .setGas(1000) // ~897
        .setFunction("getMessage", null)
        .execute(client);

    console.log("\ncall gas used:", callResult.gasUsed);
    console.log("message:", callResult.getString(0));

    // setMessage() 함수 호출(Transaction...)
    const getRecord = await (await new ContractExecuteTransaction()
        .setContractId(newContractId)
        .setGas(7000) // ~6016
        .setFunction("setMessage", new ContractFunctionParams()
            .addString("hello from hedera again!"))
        .execute(client))
        // [getReceipt] or [getRecord] waits for consensus before continuing
        //      and will throw an exception
        //      on an error received during that process like INSUFFICENT_GAS
        .getRecord(client);

    console.log("\nexecute gas used:", getRecord.getContractExecuteResult().gasUsed);

    // getMessage() 함수 호출(Query...)
    callResult = await new ContractCallQuery()
        .setContractId(newContractId)
        .setGas(1000) // ~897
        .setFunction("getMessage", null)
        .execute(client);

    console.log("\ncall gas used:", callResult.gasUsed);
    console.log("message:", callResult.getString(0));

    client.close();

    process.exit(0);
}

main();