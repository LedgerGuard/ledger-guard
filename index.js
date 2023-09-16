// https://docs.hedera.com/hedera/getting-started/environment-set-up

const {
  Client,
  PrivateKey,
  AccountCreateTransaction,
  AccountBalanceQuery,
  Hbar,
  TransferTransaction,
  TokenAssociateTransaction,
  TokenCreateTransaction,
  TokenInfoQuery,
} = require("@hashgraph/sdk");
//const NodeClient = require("@hashgraph/sdk/lib/client/NodeClient");
require("dotenv").config();

class VoteCampain{
  client = null
  constructor(account_id, private_key) {
    this.client = this.environmentSetup( account_id, private_key)
  }

  environmentSetup(account_id, private_key) {
      // Grab your Hedera testnet account ID and private key from your .env file
      const myAccountId = account_id;
      const myPrivateKey = private_key ;

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

  static randBetween(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  async createAccount(initialBalance, logTag) {
      // Create new keys
      let accountPrivateKey= PrivateKey.generateED25519();
      // Create a new account with 1,000 tinybar starting balance
      const newAccountTransactionResponse = await new AccountCreateTransaction()
        .setKey(accountPrivateKey.publicKey)
        .setInitialBalance(initialBalance)
        .execute(this.client);
      // Get the new account ID
      const getReceipt = await newAccountTransactionResponse.getReceipt(this.client);
      let accountId = getReceipt.accountId;

      const logPrefix = logTag + "[" + Math.random() + "]: ";
      console.debug(logPrefix + "created account with ID " + accountId);

      // Verify the account balance
      const accountBalance = await new AccountBalanceQuery()
        .setAccountId(accountId)
        .execute(this.client);
      console.debug(logPrefix + "balance = " + accountBalance.hbars.toTinybars() + " tinybars.");
      return {"accountId": accountId , "privateKey": accountPrivateKey}
  }

  async createAccounts(num, initialBalance, debugTag) {
    const accountPrivateKeys = Array(num);
    const accountIds = Array(num);
    const createAccountPromises = [];

    for (let i = 0; i < num; i++) {
      createAccountPromises.push(createAccount());
    }
    await Promise.all(createAccountPromises);
    return [accountPrivateKeys, accountIds];
  }

  async generateToken(treasuryID, treasuryKey, initalSupply){


    //main(client);
    //Create the transaction and freeze for manual signing
    const adminKey = PrivateKey.generateED25519();
    const transaction = await new TokenCreateTransaction()
         .setTokenName("CustomToken")
         .setTokenSymbol("F")
         .setTreasuryAccountId(treasuryID)
         .setAdminKey(adminKey)
         .setInitialSupply(initalSupply)
         .freezeWith(this.client);

    //Sign the transaction with the token adminKey and the token treasury account private key
    const signTx =  await (await transaction.sign(adminKey)).sign(treasuryKey);

    //Sign the transaction with the client operator private key and submit to a Hedera network
    const txResponse = await signTx.execute(this.client);

    //Get the receipt of the transaction
    const receipt = await txResponse.getReceipt(this.client);

    //Get the token ID from the receipt
    const tokenId = receipt.tokenId;

    console.debug("The new token ID is " + tokenId);

    return tokenId;

  }

  async createTreasury(){
    const privateKey = PrivateKey.generateED25519();
    // Create a new account with 1,000 tinybar starting balance
    const newAccountTransactionResponse = await new AccountCreateTransaction()
      .setKey(privateKey.publicKey)
      .execute(this.client);

    // Get the new account ID
    const getReceipt = await newAccountTransactionResponse.getReceipt(this.client);
    const accountId = getReceipt.accountId;
    return {'accountId': accountId, 'privateKey': privateKey};
  }


  async getTokenInfo(tokenId){ // THIS IS NOT WORKING, DON'T ASK ME WHY
    //Create the query
    const query = new TokenInfoQuery()
        .setTokenId(tokenId);

    //Sign with the client operator private key, submit the query to the network and get the token supply
    const tokenSupply = (await query.execute(this.client)).totalSupply;

    console.debug("The total supply of this token is " +tokenSupply);

    //v2.0.7
  }


  async transferToken(tokenId, senderID, senderPKey, target, amount){
    this.showTokenBalance(target, "(before xfer)")

    //Create the transfer transaction
    const transaction = await new TransferTransaction()
         .addTokenTransfer(tokenId, senderID, -1*amount)
         .addTokenTransfer(tokenId, target, amount)
         .freezeWith(this.client);

    //Sign with the sender account private key
    const signTx = await transaction.sign(senderPKey);

    //Sign with the client operator private key and submit to a Hedera network
    const txResponse = await signTx.execute(this.client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(this.client);

    //Obtain the transaction consensus status
    const transactionStatus = receipt.status;

    console.debug("The transaction consensus status " +transactionStatus.toString());
    this.showTokenBalance(target, "(after xfer)")

    //v2.0.5
  }

  async showTokenBalance(account, message) {
    const query = new AccountBalanceQuery()
    .setAccountId(account);
    const tokenBalance = await query.execute(this.client);
    console.debug("Token balance for account " + account + " " + message + ": " +tokenBalance.tokens.toString());
  }

  async associateToken(tokenId, target, signPKey) {
    // Explicitly associate recipient account for use with custom token
    let associateTx = await new TokenAssociateTransaction()
        .setAccountId(target)
        .setTokenIds([tokenId])
        .freezeWith(this.client)
        .sign(signPKey);
    let associateTxSubmit = await associateTx.execute(this.client);
    let associateRx = await associateTxSubmit.getReceipt(this.client);
    console.debug("Token Association: " + associateRx.status);
  }

  async testSpawn() {
    const numVoters = 5;
    const numCandidates = 2;

    const [voterPrivateKeys, voterIds] = await createAccounts(this.client, numVoters, Hbar.fromTinybars(1), "Voter");
    // TODO: freeze candidate accounts so that they cannot give their votes away
    const [candPrivateKeys, candIds] = await createAccounts(this.client, numCandidates, Hbar.fromTinybars(0), "Candidate");

    for (let i = 0; i < numVoters; i++) {
      const elect = randBetween(0, numCandidates);
      console.debug("Voter " + i + " chose candidate " + elect);

      // Create the transfer transaction
      const sendHbar_ = await new TransferTransaction()
        .addHbarTransfer(voterIds[i], Hbar.fromTinybars(-1))
        .addHbarTransfer(candIds[elect], Hbar.fromTinybars(1))
        .freezeWith(this.client)
        .sign(voterPrivateKeys[i]);
      const sendHbar = await sendHbar_.execute(this.client);

      // Verify the transaction reached consensus
      const transactionReceipt = await sendHbar.getReceipt(client);
      console.debug("  Transfer transaction: " + transactionReceipt.status.toString());

      // Check the new account's balance
      const voterBalance = await new AccountBalanceQuery()
        .setAccountId(voterIds[i])
        .execute(this.client);
      const candBalance = await new AccountBalanceQuery()
        .setAccountId(candIds[elect])
        .execute(this.client);
      console.debug("  New balance[voter]: " + voterBalance.hbars.toTinybars() + " tinybars.");
      console.debug("  New balance[cand]: " + candBalance.hbars.toTinybars() + " tinybars.");
    }
  }

}



async function realMain() {

const v  = new VoteCampain(process.env.MY_ACCOUNT_ID, process.env.MY_PRIVATE_KEY)

const treasury =await v.createTreasury()

const accounts = await v.createAccount(0 , 'GetMeTheToken')

const tkn = await v.generateToken(treasury.accountId, treasury.privateKey, 5)

await v.associateToken(tkn, accounts.accountId, accounts.privateKey);

v.transferToken(tkn, treasury.accountId,  treasury.privateKey, accounts.accountId, 1)
//getTokenInfo(client, tkn)


}
realMain()
