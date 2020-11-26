require('dotenv').config({ path: '../../.env' });
const HederaClient = require('../../hedera-client');

const { Client, CryptoTransferTransaction, Ed25519PrivateKey, ThresholdKey, AccountCreateTransaction } = require("@hashgraph/sdk");

async function createAccount() {
    const myClient =  HederaClient; //Client.forTestnet();
    myClient.setOperator(process.env.ACCOUNT_ID, process.env.PRIVATE_KEY);

    // Generate our key lists
    const privateKeyList = [];
    const publicKeyList = [];

    // Submitter 개인키,공개키 생성
    const submitterPrivateKey = await Ed25519PrivateKey.generate();
    const submitterPublicKey = submitterPrivateKey.publicKey;
    privateKeyList.push(submitterPrivateKey);
    publicKeyList.push(submitterPublicKey);
    console.log(`Submitter Private Key: ${submitterPrivateKey}`);
    console.log(`Submitter Public Key: ${submitterPublicKey}`);

    console.log('');

     // Approver 개인키,공개키 생성
     const approverPrivateKey = await Ed25519PrivateKey.generate();
     const approverPublicKey = approverPrivateKey.publicKey;
     privateKeyList.push(approverPrivateKey);
     publicKeyList.push(approverPublicKey);
     console.log(`Approver Private Key: ${approverPrivateKey}`);
     console.log(`Approver Public Key: ${approverPublicKey}`);

    // Submitter와 Approver의 서명이 있어야 트랜잭션을 발생시킬 수 있도록
    // Threshold Key목록에 Submitter, Approver 공개키 저장
    const thresholdKey = new ThresholdKey(2); // Define min # of sigs
    for (const element of publicKeyList) {
        thresholdKey.add(element);
    }

    // 새로운 Account 생성
    const accountCreateTransaction = await new AccountCreateTransaction()
        .setKey(thresholdKey)
        .setInitialBalance(1000000000) // 초기 발란스 100
        .execute(myClient);

    const receipt = await accountCreateTransaction.getReceipt(myClient);

    console.log('\nAccound ID:', receipt.getAccountId().toString());
    process.exit(0);
}

createAccount();