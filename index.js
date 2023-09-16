// https://docs.hedera.com/hedera/getting-started/environment-set-up

const {
  Client,
  PrivateKey,
  AccountCreateTransaction,
  AccountBalanceQuery,
  Hbar,
  TransferTransaction,
  TokenCreateTransaction,
  TokenInfoQuery,

} = require("@hashgraph/sdk");
require("dotenv").config();


function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function environmentSetup() {
  // Grab your Hedera testnet account ID and private key from your .env file
  const myAccountId = process.env.MY_ACCOUNT_ID;
  const myPrivateKey = process.env.MY_PRIVATE_KEY;

  // If we weren't able to grab it, we should throw a new error
  if (myAccountId === null || myPrivateKey === null) {
    throw new Error(
      "Environment variables myAccountId and myPrivateKey must be present"
    );
  }

  // Create your connection to the Hedera network
  const client = Client.forTestnet();

  //Set your account as the client's operator
  client.setOperator(myAccountId, myPrivateKey);

  // Set default max transaction fee & max query payment
  client.setDefaultMaxTransactionFee(new Hbar(100));
  client.setMaxQueryPayment(new Hbar(50));
  return client;
}

async function createAccount(client, initialBalance, logTag) {
    // Create new keys
    accountPrivateKey= PrivateKey.generateED25519();
    // Create a new account with 1,000 tinybar starting balance
    const newAccountTransactionResponse = await new AccountCreateTransaction()
      .setKey(accountPrivateKey.publicKey)
      .setInitialBalance(initialBalance)
      .execute(client);
    // Get the new account ID
    const getReceipt = await newAccountTransactionResponse.getReceipt(client);
    accountId = getReceipt.accountId;

    const logPrefix = logTag + "[" + Math.random() + "]: ";
    console.debug(logPrefix + "created account with ID " + accountId);

    // Verify the account balance
    const accountBalance = await new AccountBalanceQuery()
      .setAccountId(accountId)
      .execute(client);
    console.debug(logPrefix + "balance = " + accountBalance.hbars.toTinybars() + " tinybars.");
    return {"accountId": accountId , "privateKey": accountPrivateKey}
}

async function createAccounts(client, num, initialBalance, debugTag) {
  const accountPrivateKeys = Array(num);
  const accountIds = Array(num);
  const createAccountPromises = [];

  for (let i = 0; i < num; i++) {
    createAccountPromises.push(createAccount());
  }
  await Promise.all(createAccountPromises);
  return [accountPrivateKeys, accountIds];
}

async function main(client) {
  const numVoters = 5;
  const numCandidates = 2;

  const [voterPrivateKeys, voterIds] = await createAccounts(client, numVoters, Hbar.fromTinybars(1), "Voter");
  // TODO: freeze candidate accounts so that they cannot give their votes away
  const [candPrivateKeys, candIds] = await createAccounts(client, numCandidates, Hbar.fromTinybars(0), "Candidate");

  for (let i = 0; i < numVoters; i++) {
    const elect = randBetween(0, numCandidates);
    console.debug("Voter " + i + " chose candidate " + elect);

    // Create the transfer transaction
    const sendHbar_ = await new TransferTransaction()
      .addHbarTransfer(voterIds[i], Hbar.fromTinybars(-1))
      .addHbarTransfer(candIds[elect], Hbar.fromTinybars(1))
      .freezeWith(client)
      .sign(voterPrivateKeys[i]);
    const sendHbar = await sendHbar_.execute(client);

    // Verify the transaction reached consensus
    const transactionReceipt = await sendHbar.getReceipt(client);
    console.debug("  Transfer transaction: " + transactionReceipt.status.toString());

    // Check the new account's balance
    const voterBalance = await new AccountBalanceQuery()
      .setAccountId(voterIds[i])
      .execute(client);
    const candBalance = await new AccountBalanceQuery()
      .setAccountId(candIds[elect])
      .execute(client);
    console.debug("  New balance[voter]: " + voterBalance.hbars.toTinybars() + " tinybars.");
    console.debug("  New balance[cand]: " + candBalance.hbars.toTinybars() + " tinybars.");
  }
}

async function generateToken(client, treasuryID, treasuryKey){


  //main(client);
  //Create the transaction and freeze for manual signing
  const adminKey = PrivateKey.generateED25519();
  const transaction = await new TokenCreateTransaction()
       .setTokenName("CustomToken")
       .setTokenSymbol("F")
       .setTreasuryAccountId(treasuryID)
       .setAdminKey(adminKey)
       .setInitialSupply(5)
       .freezeWith(client);

  //Sign the transaction with the token adminKey and the token treasury account private key
  const signTx =  await (await transaction.sign(adminKey)).sign(treasuryKey);

  //Sign the transaction with the client operator private key and submit to a Hedera network
  const txResponse = await signTx.execute(client);

  //Get the receipt of the transaction
  const receipt = await txResponse.getReceipt(client);

  //Get the token ID from the receipt
  const tokenId = receipt.tokenId;

  console.debug("The new token ID is " + tokenId);

  return tokenId;

}

async function createTreasury(client){
  const privateKey = PrivateKey.generateED25519();
  // Create a new account with 1,000 tinybar starting balance
  const newAccountTransactionResponse = await new AccountCreateTransaction()
    .setKey(privateKey.publicKey)
    .execute(client);

  // Get the new account ID
  const getReceipt = await newAccountTransactionResponse.getReceipt(client);
  const accountId = getReceipt.accountId;
  return {'accountId': accountId, 'privateKey': privateKey};
}


async function getTokenInfo(client, tokenId){ // THIS IS NOT WORKING, DON'T ASK ME WHY
  //Create the query
  const query = new TokenInfoQuery()
      .setTokenId(tokenId);

  //Sign with the client operator private key, submit the query to the network and get the token supply
  const tokenSupply = (await query.execute(client)).totalSupply;

  console.debug("The total supply of this token is " +tokenSupply);

  //v2.0.7
}


async function transferToken(client, tokenId, senderID, senderPKey, target, amount){
  //Create the transfer transaction
  const transaction = await new TransferTransaction()
       .addTokenTransfer(tokenId, senderID, -1*amount)
       .addTokenTransfer(tokenId, target, amount)
       .freezeWith(client);

  //Sign with the sender account private key
  const signTx = await transaction.sign(senderPKey);

  //Sign with the client operator private key and submit to a Hedera network
  const txResponse = await signTx.execute(client);

  //Request the receipt of the transaction
  const receipt = await txResponse.getReceipt(client);

  //Obtain the transaction consensus status
  const transactionStatus = receipt.status;

  console.debug("The transaction consensus status " +transactionStatus.toString());

  //v2.0.5
}

async function realMain() {

const client = environmentSetup();

const treasury =await createTreasury(client)

const accounts = await createAccount(client, 0 , 'GetMeTheToken')

const tkn = await generateToken(client, treasury.accountId, treasury.privateKey)

transferToken(client, tkn, treasury.accountId,  treasury.privateKey, accounts.accountId, 1)
//getTokenInfo(client, tkn)


}
realMain()
