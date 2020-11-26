require('dotenv').config({ path: '../.env' });

const HederaClient = require('../hedera-client');
const { AccountBalanceQuery } = require('@hashgraph/sdk');

async function getBalance() {
    const balance = new AccountBalanceQuery()
        .setAccountId(process.env.ACCOUNT_ID)
        .execute(HederaClient);
        
    console.log(`${HederaClient._operatorAccount} balance = ${(await balance).value()}`);
    process.exit(0);
}

getBalance();