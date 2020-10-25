require('dotenv').config();
const { Client } = require('@hashgraph/sdk');

// console.log('process.env.ACCOUNT_ID: ', process.env.ACCOUNT_ID);

const HederaClient = new Client({
    network: { '0.testnet.hedera.com:50211': '0.0.3'},
    operator: {
        accountId: process.env.ACCOUNT_ID,
        privateKey: process.env.PRIVATE_KEY
    }
});

module.exports = HederaClient;