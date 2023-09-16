// https://docs.hedera.com/hedera/getting-started/environment-set-up

const {
  Client,
  PrivateKey,
  AccountCreateTransaction,
  AccountBalanceQuery,
  Hbar,
  TransferTransaction,
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
  if (myAccountId == null || myPrivateKey == null) {
    throw new Error(
      "Environment variables myAccountId and myPrivateKey must be present"
    );
  }

  // Create your connection to the Hedera network
  const client = Client.forTestnet();

  //Set your account as the client's operator
  client.setOperator(myAccountId, myPrivateKey);

  // Set default max transaction fee & max query payment
  client.setMaxTransactionFee(new Hbar(100));
  client.setMaxQueryPayment(new Hbar(50));
  return client;
}

async function createAccounts(client, num, initialBalance, logTag) {
  const accountPrivateKeys = new Array(num);
  const accountIds = new Array(num);
  for (let i = 0; i < num; i++) {
    // TODO: eliminate await to permit concurrent in-flight txns with `Promise.all`
    // Create new keys
    accountPrivateKeys[i] = PrivateKey.generateED25519();
    // Create a new account with 1,000 tinybar starting balance
    const newAccountTransactionResponse = await new AccountCreateTransaction()
      .setKey(accountPrivateKeys[i].publicKey)
      .setInitialBalance(initialBalance)
      .execute(client);
    // Get the new account ID
    const getReceipt = await newAccountTransactionResponse.getReceipt(client);
    accountIds[i] = getReceipt.accountId;

    const logPrefix = logTag + "[" + i + "]: ";
    console.log(logPrefix + "created account with ID " + accountIds[i]);

    // Verify the account balance
    const accountBalance = await new AccountBalanceQuery()
      .setAccountId(accountIds[i])
      .execute(client);
    console.log(logPrefix + "balance = " + accountBalance.hbars.toTinybars() + " tinybars.");
  }
  return [accountPrivateKeys, accountIds];
}

async function main(client) {
  const numVoters = 5;
  const numCandidates = 2;

  const [voterPrivateKeys, voterIds] = await createAccounts(client, numVoters, Hbar.fromTinybars(1), "Voter");
  const [candPrivateKeys, candIds] = await createAccounts(client, numCandidates, Hbar.fromTinybars(0), "Candidate");

  for (let i = 0; i < numVoters; i++) {
    const elect = randBetween(0, numCandidates);
    console.log("Voter " + i + " chose candidate " + elect);

    // Create the transfer transaction
    const sendHbar_ = await new TransferTransaction()
      .addHbarTransfer(voterIds[i], Hbar.fromTinybars(-1))
      .addHbarTransfer(candIds[elect], Hbar.fromTinybars(1))
      .freezeWith(client)
      .sign(voterPrivateKeys[i]);
    const sendHbar = await sendHbar_.execute(client);

    // Verify the transaction reached consensus
    const transactionReceipt = await sendHbar.getReceipt(client);
    console.log("  Transfer transaction: " + transactionReceipt.status.toString());

    // Check the new account's balance
    const voterBalance = await new AccountBalanceQuery()
      .setAccountId(voterIds[i])
      .execute(client);
    const candBalance = await new AccountBalanceQuery()
      .setAccountId(candIds[elect])
      .execute(client);
    console.log("  New balance[voter]: " + voterBalance.hbars.toTinybars() + " tinybars.");
    console.log("  New balance[cand]: " + candBalance.hbars.toTinybars() + " tinybars.");
  }
}

client = environmentSetup();
main(client);
