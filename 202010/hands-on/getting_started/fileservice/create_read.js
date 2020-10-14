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