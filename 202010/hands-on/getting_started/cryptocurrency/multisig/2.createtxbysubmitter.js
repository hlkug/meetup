require('dotenv').config({ path: '../../.env' });
fs = require('fs');

const HederaClient = require('../../hedera-client');

const { Client, CryptoTransferTransaction, AccountBalanceQuery, Ed25519PrivateKey } = require("@hashgraph/sdk");

async function createTxBySubmitter() {
    const accountId = '0.0.86195';
    const submitterPrivateKeyStr = '302e020100300506032b65700422042038e905d9e1f1b595a8a0a95ab92373e6d07b09a66f4388a2e2e7cd2d2d8b7e5c';

    const myClient =  HederaClient; //Client.forTestnet();
    // myClient.setOperator(process.env.ACCOUNT_ID, process.env.PRIVATE_KEY);
    myClient.setOperator(accountId, submitterPrivateKeyStr);

    const tx = await new CryptoTransferTransaction()
        .addSender(accountId, 5)
        .addRecipient('0.0.3', 5)
        .build(myClient);

    const submitterPrivateKey = await Ed25519PrivateKey.fromString(
        submitterPrivateKeyStr
    );

    // Submitter가 서명한다.
    tx.sign(submitterPrivateKey);
    
    fs.writeFile('signedtxbysumitter.base64', Buffer.from(tx.toBytes()).toString('base64'), function (err) {
        if (err) return console.log(err);
        console.log('Saved to signedtxbysumitter.base64 file.');
        process.exit(0);
    });

    // console.log(tx)

    
}

createTxBySubmitter();