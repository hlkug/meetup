require('dotenv').config({ path: '../../.env' });
fs = require('fs');

const HederaClient = require('../../hedera-client');

const { Client, CryptoTransferTransaction, AccountBalanceQuery, Ed25519PrivateKey, Transaction } = require("@hashgraph/sdk");

async function executeTxBySubmitter() {
    const accountId = '0.0.86193';
    const submitterPrivateKeyStr = '302e020100300506032b65700422042001e94c14336c4f6d92000d23461f1885ae5b1c8b6944b394a703570bbf52d7c7';

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