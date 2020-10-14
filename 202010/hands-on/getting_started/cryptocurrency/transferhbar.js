require('dotenv').config({ path: '../.env' });
const HederaClient = require('../hedera-client');

const { Client, CryptoTransferTransaction } = require("@hashgraph/sdk");

async function transferHbar() {
    const myClient =  HederaClient; //Client.forTestnet();
    myClient.setOperator(process.env.ACCOUNT_ID, process.env.PRIVATE_KEY);

    const transactionId = await new CryptoTransferTransaction()
        .addSender(process.env.ACCOUNT_ID, 100)
        .addRecipient('0.0.3', 100)
        .execute(myClient);
    console.log('tx id:', transactionId);
    const transactionReceipt = await transactionId.getReceipt(myClient);
    console.log('\nreciept: ', transactionReceipt);

    const record = await transactionId.getRecord(myClient);
    console.log('\nrecord: ', record);
}

transferHbar();