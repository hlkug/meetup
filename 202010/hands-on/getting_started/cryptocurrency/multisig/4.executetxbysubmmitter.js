require('dotenv').config({ path: '../../.env' });
fs = require('fs');

const HederaClient = require('../../hedera-client');

const { Client, CryptoTransferTransaction, AccountBalanceQuery, Ed25519PrivateKey, Transaction } = require("@hashgraph/sdk");

async function executeTxBySubmitter() {
    const accountId = '0.0.86195';
    const submitterPrivateKeyStr = '302e020100300506032b65700422042038e905d9e1f1b595a8a0a95ab92373e6d07b09a66f4388a2e2e7cd2d2d8b7e5c';

    const myClient =  HederaClient; //Client.forTestnet();
    // myClient.setOperator(process.env.ACCOUNT_ID, process.env.PRIVATE_KEY);
    myClient.setOperator(accountId, submitterPrivateKeyStr);

   
    let balance = new AccountBalanceQuery()
        .setAccountId(accountId)
        .execute(myClient);
        
    console.log(`${accountId} balance = ${(await balance).value()}`);

    fs.readFile('signedtxbysumitterbyapprover.base64', 'utf8', async function (err, data) {
        if (err) {
          return console.log(err);
        }
        
        const tx = await Transaction.fromBytes(Buffer.from(data, 'base64'));
        const transactionId = await tx.execute(myClient);

        console.log('tx id:', transactionId);
        const transactionReceipt = await transactionId.getReceipt(myClient);
        console.log('\nreciept: ', transactionReceipt);

        // const record = await transactionId.getRecord(myClient);
        // console.log('\nrecord: ', record);

        balance = new AccountBalanceQuery()
            .setAccountId(accountId)
            .execute(myClient);
            
        console.log(`${accountId} balance = ${(await balance).value()}`);      });

   
}

executeTxBySubmitter();