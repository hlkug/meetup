require('dotenv').config({ path: '../../.env' });
fs = require('fs');

const HederaClient = require('../../hedera-client');

const { Client, CryptoTransferTransaction, AccountBalanceQuery, Ed25519PrivateKey } = require("@hashgraph/sdk");

async function ccreateTxBySubmitter() {
    const accountId = '0.0.86193';
    const submitterPrivateKeyStr = '302e020100300506032b65700422042001e94c14336c4f6d92000d23461f1885ae5b1c8b6944b394a703570bbf52d7c7';

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
    });

    // console.log(tx)

    
}

ccreateTxBySubmitter();