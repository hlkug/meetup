---

---

Table of Contents
=================

   * [Table of Contents](#table-of-contents)
   * [0. 참고](#0-참고)
   * [1. 준비사항](#1-준비사항)
      * [1.1 Account 생성](#11-account-생성)
      * [1.2 테스트 환경 구성](#12-테스트-환경-구성)
         * [1.2.1 Hedera SDK](#121-hedera-sdk)
         * [1.2.2 Microsoft Visual Studio Code(VS Code), Node.js 설치](#122-microsoft-visual-studio-codevs-code-nodejs-설치)
         * [1.2.3 실습 소스 다운로드](#123-실습-소스-다운로드)
         * [1.2.4 VS Code에서 소스 코드 열기](#124-vs-code에서-소스-코드-열기)
         * [1.2.5 패키지(라이브러리) 설치](#125-패키지라이브러리-설치)
         * [1.2.6 Account 정보 설정](#126-account-정보-설정)
   * [2. Cryptocurrency](#2-cryptocurrency)
      * [2.1 Balance 확인](#21-balance-확인)
      * [2.2 HBar(tinybar) 송금](#22-hbartinybar-송금)
      * [2.3 다중 서명(Multi-Signature)](#23-다중-서명multi-signature)
         * [Step 1. Submitter, Approver 키 생성 및 Account 생성](#step-1-submitter-approver-키-생성-및-account-생성)
         * [Step 2. Submitter가 서명한 트랜잭션 파일로 저장](#step-2-submitter가-서명한-트랜잭션-파일로-저장)
         * [Step 3. Approver가 서명한 트랜잭션 파일로 저장](#step-3-approver가-서명한-트랜잭션-파일로-저장)
         * [Step 4. Submitter,Approver가 서명한 트랜잭션을 Submitter가 실행](#step-4-submitterapprover가-서명한-트랜잭션을-submitter가-실행)
   * [3. File Service](#3-file-service)
      * [3.1 파일 생성 &amp; 읽기](#31-파일-생성--읽기)
      * [3.2 파일 생성 &amp; 삭제](#32-파일-생성--삭제)
   * [4. Smart Contract](#4-smart-contract)
      * [4.1 스마트 컨트랙트 배포 및 함수 실행](#41-스마트-컨트랙트-배포-및-함수-실행)
   * [5. Consensus Service](#5-consensus-service)
      * [5.1 토픽 생성 및 Submit/Subscribe](#51-토픽-생성-및-submitsubscribe)


[TOC]

# 0. 참고

* Coding With Cooper - https://www.youtube.com/playlist?list=PLcaTa5RR9SuA__8rzCKru8Y_F6iMJPEUD

![0](images/0.png)

# 1. 준비사항

## 1.1 Account 생성

Hedera 계정은 Private Key, Public Key, Account ID로 구성 되며 아래 사이트를 통해 발급 받을 수 있습니다.

* https://portal.hedera.com

![1](images/1.png)

회원 가입 후 실습을 위해 테스트넷(Testnet) Account를 발급 받습니다.

![2](images/2.png)



```json
{
    "operator": {
        "accountId": "0.0.1688",
        "publicKey": "302a300506032b65700321008c999110d6",
        "privateKey": "302e020100300506032b6570042204209be"
    },
    "network": {
        "0.testnet.hedera.com:50211": "0.0.3",
        "1.testnet.hedera.com:50211": "0.0.4",
        "2.testnet.hedera.com:50211": "0.0.5",
        "3.testnet.hedera.com:50211": "0.0.6"
    }
}
```

## 1.2 테스트 환경 구성

### 1.2.1 Hedera SDK

Hedera에서 공식적으로 Java/JavaScript/Go SDK를  커뮤니티차원에서 C/iOS/Python/Rust/.NET SDK를 지원하고 있습니다. https://docs.hedera.com/guides/docs/sdks

![3](images/3.png)

### 1.2.2 Microsoft Visual Studio Code(VS Code), Node.js 설치

**<u>본 실습에서는 Hedera JavaScript SDK기반으로 진행됩니다.</u>**

* Microsoft Visual Studio Code 설치 - https://code.visualstudio.com/download
* Node.js -https://nodejs.org

### 1.2.3 실습 소스 다운로드

```bash
$ git clone https://github.com/hlkug/meetup.git

$ cd meetup/202010/hands-on
$ ls 
```

### 1.2.4 VS Code에서 소스 코드 열기

1.2.3 에서 다운로드 받은 소스 폴더를 VS Code에서 오픈합니다.

* File -> Open : meetup/202010/hands-on/getting_started

![6](images/4.png)

### 1.2.5 패키지(라이브러리) 설치

VS Code에서 Terminal 창을 오픈한 후 실습에 필요한 패키지를 설치합니다.

```bash
# 초기화
$ npm init -y
Wrote to /Users/yunho.chung/Git/hlkug/meetup/202010/hands-on/getting_started/package.json:

{
  "name": "getting_started",
  "version": "1.0.0",
  "description": "",
  "main": "hedera-client.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}

# Hedera SDK 라이브러리 다운로드
$ npm install --save @hashgraph/sdk

# dotenv 라이브러리 다운로드
$ npm install --save dotenv
```

### 1.2.6 Account 정보 설정

.env 파일에 본인의 Account 정보를 설정합니다.

![5](images/5.png)

# 2. Cryptocurrency

![6](images/6.png)

## 2.1 Balance 확인

* 파일: cryptocurrency/getbalance.js

```javascript
const HederaClient = require('./hedera-client');
const { AccountBalanceQuery } = require('@hashgraph/sdk');

async function getBalance() {
    const balance = new AccountBalanceQuery()
        .setAccountId(process.env.ACCOUNT_ID)
        .execute(HederaClient);
        
    console.log(`${HederaClient._operatorAccount} balance = ${(await balance).value()}`);
}

getBalance();
```

* 실행

```bash
$ cd $SOURCE_HOME/cryptocurrency
$ node getbalance.js
process.env.ACCOUNT_ID:  0.0.1688
0.0.1688 balance = 10000
```

## 2.2 HBar(tinybar) 송금

<img src="images/7.png" alt="7" style="zoom:70%;" />

* 파일: cryptocurrency/transferhbar.js

```javascript
require('dotenv').config();
const HederaClient = require('./hedera-client');

const { Client, CryptoTransferTransaction } = require("@hashgraph/sdk");

async function transferHbar() {
    const myClient =  HederaClient; //Client.forTestnet();
    myClient.setOperator(process.env.ACCOUNT_ID, process.env.PRIVATE_KEY);

    const transactionId = await new CryptoTransferTransaction()
        .addSender(process.env.ACCOUNT_ID, 100)
        .addRecipient('0.0.3', 100)
        .execute(myClient);
    console.log('tx id:', transactionId);
    // const transactionReceipt = await transactionId.getReceipt(myClient);
    // console.log('reciept: ', transactionReceipt);

    const record = await transactionId.getRecord(myClient);
    console.log('reciept: ', record);
}

transferHbar();
```

* 실행

```bash
$ cd $SOURCE_HOME/cryptocurrency

# 송금전 Balance 확인
$ node getbalance.js 
process.env.ACCOUNT_ID:  0.0.1688
0.0.1688 balance = 9999.98474956

# HBar 송금(100 tinybar)
$ node transferhbar.js
process.env.ACCOUNT_ID:  0.0.1688
tx id: 0.0.1688@1602079806.560000000

reciept:  {
  "status": "SUCCESS"
}

record:  TransactionRecord {
  receipt: {
    "status": "SUCCESS"
  },
  transactionHash: Uint8Array(48) [
    179,  97, 249,  70, 134,  18, 141, 177, 223,
    117, 124, 101,   5, 137, 143, 179, 107, 169,
     98, 177, 234, 111, 240, 183, 117, 243, 104,
    137, 119, 102, 201, 114, 216, 216, 227,  87,
      4, 131, 197,  63, 127,  55,  78,  82, 129,
    228, 104,  15
  ],
  consensusTimestamp: Time { seconds: 1602079817, nanos: 34017000 },
  transactionId: 0.0.1688@1602079806.560000000,
  transactionMemo: '',
  transactionFee: 0.00254112,
  transfers: [
    { accountId: 0.0.3, amount: 0.00015597 },
    { accountId: 0.0.98, amount: 0.00238615 },
    { accountId: 0.0.1688, amount: -0.00254212 }
  ],
  [Symbol(callResult)]: null,
  [Symbol(callResultIsCreate)]: false
}

# 송금후 Balance 확인
$ node getbalance.js
process.env.ACCOUNT_ID:  0.0.1688
0.0.1688 balance = 9999.97966608
```

* 트랜잭션 확인

  https://testnet.dragonglass.me 에서 트랜잭션을 확인합니다.

  * https://testnet.dragonglass.me/hedera/accounts/{본인 Account ID}
  * 예> https://testnet.dragonglass.me/hedera/accounts/0.0.1688

![8](images/8.png)

* 트랜잭션 수수료

  ![9](images/9.png)

## 2.3 다중 서명(Multi-Signature)

Account는 다수개의 Key(Private/Public)를 가질 수 있으며 HBar를 송금하거나 트랜잭션을 발생 시킬 때 특정 키의 서명이 필요함을 설정할 수 있습니다.(Account 생성시..)

예> 직원이 트랜잰션을 생성한 후 관리자에게 보내 서명을 받고 서명 받은 트랜잭션 실행

* 참고 자료
  * Hedera Technical Insights: Hierarchical Multi-Signature support in Hedera
    * https://hedera.com/blog/hierarchical-multi-signature-support-in-hedera
  * Keys & Signatures on Hedera Hashgraph
    * https://medium.com/@sreejithkaimal/keys-signatures-on-hedera-hashgraph-e173814456d5

### Step 1. Submitter, Approver 키 생성 및 Account 생성

* 파일: cryptocurrency/multisig/1.createaccount.js

```javascript
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
}

createAccount();
```

* 실행

```bash
$ cd $SOURCE_HOME/cryptocurrency/multisig

# Submitter, Approver Key 생성
$ node 1.createaccount.js 
Submitter Private Key: 302e020100300506032b65700422042038e905d9e1f1b595a8a0a95ab92373e6d07b09a66f4388a2e2e7cd2d2d8b7e5c
Submitter Public Key: 302a300506032b657003210049a804b9b322c290baa016af7cb6cae0ab5cca180ff63397f2f2d6253db157d2

Approver Private Key: 302e020100300506032b6570042204201358c83c3515a675a1441249e211f7db00ca5191bdce59ec1c49407fac62f3c8
Approver Public Key: 302a300506032b65700321008d530186fbd058bf4eba839b52a5c2227aa6d96786647e4fa842e0888d4cc4e6

# 트랜잭션 발생시 Submitter, Approver 서명이 필수로 설정한 계정 생성
Accound ID: 0.0.86195
```

### Step 2. Submitter가 서명한 트랜잭션 파일로 저장

Hbar 송금과 관련된 트랜잭션을 생성한 후 Submitter Private Key로 서명한 후 파일로 저장합니다.

* 파일: cryptocurrency/multisig/2.createtxbysubmitter.js
  * <u>***Step 1.에서 생성한 Account ID와 Submitter Private Key 값을 사용합니다.***</u>

```javascript
require('dotenv').config({ path: '../../.env' });
fs = require('fs');

const HederaClient = require('../../hedera-client');

const { Client, CryptoTransferTransaction, AccountBalanceQuery, Ed25519PrivateKey } = require("@hashgraph/sdk");

async function ccreateTxBySubmitter() {
    const accountId = ''; # Step 1에서 생성한 Account ID
    const submitterPrivateKeyStr = ''; #Step 1에서 생성한 Submitter Private Key

    const myClient =  HederaClient; //Client.forTestnet();
    // myClient.setOperator(process.env.ACCOUNT_ID, process.env.PRIVATE_KEY);
    myClient.setOperator(accountId, submitterPrivateKeyStr);

    // 트랜잭션 생성
    const tx = await new CryptoTransferTransaction()
        .addSender(accountId, 5)
        .addRecipient('0.0.3', 5)
        .build(myClient);

    const submitterPrivateKey = await Ed25519PrivateKey.fromString(
        submitterPrivateKeyStr
    );

    // Submitter의 Private Key로 서명
    tx.sign(submitterPrivateKey);
    
    fs.writeFile('signedtxbysumitter.base64', Buffer.from(tx.toBytes()).toString('base64'), function (err) {
        if (err) return console.log(err);
        console.log('Saved to signedtxbysumitter.base64 file.');
    });

    // console.log(tx)

    
}

ccreateTxBySubmitter();
```

* 실행

```bash
$ cd $SOURCE_HOME/cryptocurrency/multisig

# Submitter가 서명한 트랜잭션을 파일로 저장
$ node 2.createtxbysubmitter.js 
Saved to signedtxbysumitter.base64 file.
```

### Step 3. Approver가 서명한 트랜잭션 파일로 저장

Step 3.에서 Submitter가 서명한 후 저장한 트랜잭션에 Approver의 Private Key로 서명한 후 파일로 저장합니다.

* 파일: cryptocurrency/multisig/3.signtxbyapprover.js
  * <u>***Step 1.에서 생성한 Account ID와 Approver Private Key 값을 사용합니다.***</u>

```javascript
require('dotenv').config({ path: '../../.env' });
fs = require('fs');

const HederaClient = require('../../hedera-client');

const { Client, CryptoTransferTransaction, AccountBalanceQuery, Ed25519PrivateKey, Transaction } = require("@hashgraph/sdk");

async function signTxByApprover() {
    const accountId = ''; # Step 1에서 생성한 Account ID
    const approverPrivateKeyStr = ''; #Step 1에서 생성한 Approver Private Key

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

        // Approver Private Key로 서명
        const tx = await Transaction.fromBytes(Buffer.from(data, 'base64'));
        tx.sign(approverPrivateKey);

        fs.writeFile('signedtxbysumitterbyapprover.base64', Buffer.from(tx.toBytes()).toString('base64'), function (err) {
            if (err) return console.log(err);
            console.log('Saved to signedtxbysumitterbyapprover.base64 file.');
        });
    });
}

signTxByApprover();
```

* 실행

```bash
$ cd $SOURCE_HOME/cryptocurrency/multisig

# Approver가 서명한 트랜잭션을 파일로 저장
$ node 3.signtxbyapprover.js 
0.0.86195 balance = 10
Saved to signedtxbysumitterbyapprover.base64 file.
```

### Step 4. Submitter,Approver가 서명한 트랜잭션을 Submitter가 실행

Step 2,3을 통해 Submitter, Approver 서명이 포함된 트랜잭션을 Submitter가 실행합니다.

* 파일: cryptocurrency/multisig/4.executetxbysubmmitter.js
  * <u>***Step 1.에서 생성한 Account ID와 Submitter Private Key 값을 사용합니다.***</u>

```javascript
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
```

* 실행

```bash
$ cd $SOURCE_HOME/cryptocurrency/multisig

# Hbar 송금 트랜잭션 실행
$ node 4.executetxbysubmmitter.js 
0.0.86195 balance = 10
tx id: 0.0.86195@1603636033.900000000

reciept:  {
  "status": "SUCCESS"
}
0.0.86195 balance = 9.99578438
```



# 3. File Service

![10](images/10.png)

## 3.1 파일 생성 & 읽기

* 파일: fileservice/create_read.js

```javascript
const { Client, FileCreateTransaction, FileContentsQuery, FileInfoQuery, FileDeleteTransaction, Ed25519PrivateKey, Hbar } = require("@hashgraph/sdk");
require('dotenv').config({ path: '../.env' });

async function main() {
  console.log('process.env.ACCOUNT_ID:', process.env.ACCOUNT_ID);

  const operatorAccount = process.env.ACCOUNT_ID;
  const operatorPrivateKey = Ed25519PrivateKey.fromString(process.env.PRIVATE_KEY);
  const operatorPublicKey = operatorPrivateKey.publicKey;

  if (operatorPrivateKey == null || operatorAccount == null) {
    throw new Error(
      "environment variables OPERATOR_KEY and OPERATOR_ID must be present"
    );
  }

  const client = Client.forTestnet()
  client.setOperator(operatorAccount, operatorPrivateKey);

  // 파일 생성
  const transactionId = await new FileCreateTransaction()
    .setContents("Hello, Hedera's file service!")
    .addKey(operatorPublicKey) // Defines the "admin" of this file
    .setMaxTransactionFee(new Hbar(15))
    .execute(client);

  const receipt = await transactionId.getReceipt(client);  
  const fileId = receipt.getFileId();
  console.log('tx id:', receipt);
  console.log("new file id = ", fileId);

  // 파일 읽기
  const fileContents = await new FileContentsQuery()
    .setFileId(fileId)
    .execute(client);

  console.log(`file contents: ${new TextDecoder().decode(fileContents)}`);

  // 파일 정보 조회
  const fileInfo = await new FileInfoQuery()
    .setFileId(fileId)
    .execute(client);

  console.log('fileInfo:', fileInfo);
}

main();
```

* 실행

```bash
$ cd $SOURCE_HOME/fileservice
$ node create_read.js 
process.env.ACCOUNT_ID: 0.0.1688
tx id: {
  "status": "SUCCESS",
  "fileId": "0.0.64778"
}
new file id =  0.0.64778

file contents: Hello, Hedera's file service!

fileInfo: {
  fileId: 0.0.64778,
  size: 29,
  expirationTime: 2021-01-06T22:14:16.000Z,
  isDeleted: false,
  keys: [
    302a300506032b65700321008c999110d6f068098ec344ecaaaaaba346a90a205ea7b15de6fdb6d82b7ddab8
  ]
}
```

## 3.2 파일 생성 & 삭제

* 파일: fileservice/create_delete.js

```javascript
const { Client, FileCreateTransaction, FileContentsQuery, FileInfoQuery, FileDeleteTransaction, Ed25519PrivateKey, Hbar } = require("@hashgraph/sdk");
require('dotenv').config({ path: '../.env' });

async function main() {
  console.log('process.env.ACCOUNT_ID:', process.env.ACCOUNT_ID);

  const operatorAccount = process.env.ACCOUNT_ID;
  const operatorPrivateKey = Ed25519PrivateKey.fromString(process.env.PRIVATE_KEY);
  const operatorPublicKey = operatorPrivateKey.publicKey;

  if (operatorPrivateKey == null || operatorAccount == null) {
    throw new Error(
      "environment variables OPERATOR_KEY and OPERATOR_ID must be present"
    );
  }

  const client = Client.forTestnet()
  client.setOperator(operatorAccount, operatorPrivateKey);

  // 파일 생성
  const transactionId = await new FileCreateTransaction()
    .setContents("Hello, Hedera's file service!")
    .addKey(operatorPublicKey) // Defines the "admin" of this file
    .setMaxTransactionFee(new Hbar(15))
    .execute(client);

  const receipt = await transactionId.getReceipt(client);  
  const fileId = receipt.getFileId();
  console.log('tx id:', receipt);
  console.log("new file id = ", fileId);

  // 파일 삭제
  const deleteFileTransactionId = await new FileDeleteTransaction()
  .setFileId(fileId) // Define which file to delete
  .setMaxTransactionFee(new Hbar(100))
  .execute(client); // Presumes the client is the file's admin key

  // After deletion, the receipt should NOT contain a file ID
  const deleteFileReceipt = await deleteFileTransactionId.getReceipt(client);
  console.log("deleted file receipt, won't contain a file ID ", JSON.stringify(deleteFileReceipt) + "\n");  
}

main();
```

* 실행

```bash
$ cd $SOURCE_HOME/fileservice
$ node create_delete.js 
process.env.ACCOUNT_ID: 0.0.1688
tx id: {
  "status": "SUCCESS",
  "fileId": "0.0.64779"
}
new file id =  0.0.64779
deleted file receipt, won't contain a file ID  {"status":"SUCCESS"}
```

* 트랜잭션 확인

  https://testnet.dragonglass.me 에서 트랜잭션을 확인합니다.

  * https://testnet.dragonglass.me/hedera/accounts/{본인 Account ID}
  * 예> https://testnet.dragonglass.me/hedera/accounts/0.0.1688

# 4. Smart Contract

![11](images/11.png)

## 4.1 스마트 컨트랙트 배포 및 함수 실행

* 제약 사항
  * Hedera smart contracts support Solidity versions up to v0.5.9.
  * Each smart contract has **<u>a maximum state size of 1MB</u>** which can store up to approximately **<u>16,000 key-value pairs</u>**.
* 파일: smartcontract/create_get_set.js

```javascript
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
}

main();
```

* 실행

```bash
$ cd $SOURCE_HOME/smartcontract
$ node create_get_set.js 
contract bytecode size: 2478 bytes
contract bytecode file: 0.0.64783
contract create gas used: 1260
contract create transaction fee: BigNumber { s: 1, e: 9, c: [ 1262941963 ] }
contract: 0.0.64784

call gas used: 897
message: hello from hedera

execute gas used: 6016

call gas used: 897
message: hello from hedera again!
```

* 트랜잭션 확인

  https://testnet.dragonglass.me 에서 트랜잭션을 확인합니다.

  * https://testnet.dragonglass.me/hedera/accounts/{본인 Account ID}
  * 예> https://testnet.dragonglass.me/hedera/accounts/0.0.1688

  ![12](images/12.png)

# 5. Consensus Service

![13](images/13.png)

![15](images/15.png)

![14](images/14.png)

## 5.1 토픽 생성 및 Submit/Subscribe

* 파일: consensusservice/submit_subscribe.js

```javascript
require('dotenv').config({ path: '../.env' });

const {
    Client, MirrorClient, MirrorConsensusTopicQuery,
    FileCreateTransaction, ContractCreateTransaction, Hbar, Ed25519PrivateKey,
    ContractFunctionParams, ContractCallQuery, ContractExecuteTransaction,
    ConsensusMessageSubmitTransaction,
    ConsensusTopicCreateTransaction
} = require("@hashgraph/sdk");
const HederaClient = require('../hedera-client');

async function main() {
    // const myClient = Client.forTestnet();
    const myClient = HederaClient;

    myClient.setOperator(process.env.ACCOUNT_ID, process.env.PRIVATE_KEY);

    const transactionId = await new ConsensusTopicCreateTransaction().execute(myClient);
    const transactionReceipt = await transactionId.getReceipt(myClient);
    const topicId = transactionReceipt.getConsensusTopicId();

    console.log('topid id = ', topicId);

    await sleep(5000); // Consensus에서 생성된 토픽을 미러노드에서 인지할 수 있게 delay
    // const myMirrorClient = new MirrorClient('hcs.testnet.mirrornode.hedera.com:5600');
    const myMirrorClient = new MirrorClient('api.testnet.kabuto.sh:50211');

    new MirrorConsensusTopicQuery()
    .setTopicId(topicId)
    .subscribe(
        myMirrorClient, 
        (message) => console.log('<<< Received message from Mirror Node:', message.toString()),
        (error) => console.log(`Error: ${error.toString()}`));

    for(let i = 1; i < 4; i++) {
        let hcsMessage = await new ConsensusMessageSubmitTransaction().setTopicId(topicId).setMessage(`Hello, HCS! From Message ${i}`).execute(myClient);
        let hcsMessageReceipt = await hcsMessage.getReceipt(myClient);

        console.log(`>>> Sent message ${i}: ${hcsMessageReceipt.toString()}`);
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

main();
```

* 실행

```bash
$ cd $SOURCE_HOME/consensusservice
$ node submit_subsccribe.js 
process.env.ACCOUNT_ID:  0.0.1688
topid id =  0.0.66074
>>> Sent message 1: {
  "status": "SUCCESS",
  "consensusTopicRunningHash": "145,180,159,133,26,126,45,234,255,143,136,89,122,202,186,66,154,64,215,26,95,60,13,90,8,94,167,131,249,47,34,244,57,200,175,15,106,178,67,43,175,49,138,194,102,36,255,38",
  "consensusTopicSequenceNumber": 1
}
<<< Received message from Mirror Node: Hello, HCS! From Message 1
>>> Sent message 2: {
  "status": "SUCCESS",
  "consensusTopicRunningHash": "107,32,234,35,80,59,99,230,84,44,64,204,189,34,2,36,13,169,117,203,27,236,37,36,34,44,154,187,254,9,29,212,83,245,177,39,14,247,105,170,159,69,153,13,201,32,87,179",
  "consensusTopicSequenceNumber": 2
}
<<< Received message from Mirror Node: Hello, HCS! From Message 2
>>> Sent message 3: {
  "status": "SUCCESS",
  "consensusTopicRunningHash": "253,240,50,138,90,128,164,147,253,190,48,61,8,19,139,189,22,18,160,83,91,17,188,22,83,18,44,176,42,121,5,242,77,159,212,190,140,104,148,130,220,234,231,83,185,144,218,19",
  "consensusTopicSequenceNumber": 3
}
<<< Received message from Mirror Node: Hello, HCS! From Message 3
```

* 트랜잭션 확인

  https://testnet.dragonglass.me 에서 트랜잭션을 확인합니다.

  * https://testnet.dragonglass.me/hedera/accounts/{본인 Account ID}

  * 예> https://testnet.dragonglass.me/hedera/accounts/0.0.1688

    ![16](images/16.png)

   https://explorer.kabuto.sh/testnet 에서 트랜잭션을 확인합니다.

  * https://explorer.kabuto.sh/testnet/id/{본인 Account ID}

  * 예> https://explorer.kabuto.sh/testnet/id/0.0.1688

    

![17](images/17.png)

![18](images/18.png)

![19](images/19.png)