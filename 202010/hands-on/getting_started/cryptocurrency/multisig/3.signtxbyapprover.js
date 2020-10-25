require('dotenv').config({ path: '../../.env' });
fs = require('fs');

const HederaClient = require('../../hedera-client');

const { Client, CryptoTransferTransaction, AccountBalanceQuery, Ed25519PrivateKey, Transaction } = require("@hashgraph/sdk");

async function signTxByApprover() {
    const accountId = '0.0.86195';
    const approverPrivateKeyStr = '302e020100300506032b6570042204201358c83c3515a675a1441249e211f7db00ca5191bdce59ec1c49407fac62f3c8';

    const myClient =  HederaClient; //Client.forTestnet();
    // myClient.setOperator(process.env.ACCOUNT_ID, process.env.PRIVATE_KEY);
    myClient.setOperator(accountId, approverPrivateKeyStr);

   
    let balance = new AccountBalanceQuery()
        .setAccountId(accountId)
        .execute(myClient);
        
    console.log(`${accountId} balance = ${(await balance).value()}`);

    fs.readFile('signedtxbysumitter.base64', 'utf8', async function (err, data) {
        if (err) {
          return console.log(err);
        }

        const approverPrivateKey = await Ed25519PrivateKey.fromString(
            approverPrivateKeyStr
        );

        const tx = await Transaction.fromBytes(Buffer.from(data, 'base64'));
        tx.sign(approverPrivateKey);

        fs.writeFile('signedtxbysumitterbyapprover.base64', Buffer.from(tx.toBytes()).toString('base64'), function (err) {
            if (err) return console.log(err);
            console.log('Saved to signedtxbysumitterbyapprover.base64 file.');
        });
    });
}

signTxByApprover();