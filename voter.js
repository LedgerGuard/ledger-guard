const {
  Client,
  Hbar,
  TransferTransaction
} = require("@hashgraph/sdk");

class Voter{
    accountID = null
    privateKey = null
    client = null

    constructor(accountID, privateKey) {
        this.accountID = accountID
        this.privateKey = privateKey

        this.client = this.environmentSetup(accountID, privateKey)
    }

    environmentSetup(account_id, private_key){
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

    async vote(tokenId, target){
    //this.showTokenBalance(target, "(before xfer)")
    const amount = 1
    //Create the transfer transaction
    const transaction = await new TransferTransaction()
         .addTokenTransfer(tokenId, this.accountID, -1*amount)
         .addTokenTransfer(tokenId, target, amount)
         .freezeWith(this.client);

    //Sign with the sender account private key
    const signTx = await transaction.sign(this.privateKey);

    //Sign with the client operator private key and submit to a Hedera network
    const txResponse = await signTx.execute(this.client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(this.client);

    //Obtain the transaction consensus status
    const transactionStatus = receipt.status;

    console.debug("The transaction consensus status " +transactionStatus.toString());
  }
}
module.exports = { Voter };