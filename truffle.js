var HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic = "true sort disagree tail tunnel unfair beach dutch salad alcohol gossip praise";

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/DRr7EzSi3ijuMUDjsbBD"),
      network_id: 3,
      gas: 4500000,
      gasPrice: 10000000000,
    }
  }
};