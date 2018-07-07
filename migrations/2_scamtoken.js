const ScamToken = artifacts.require("scamToken");
const Weth9 = artifacts.require("WETH9");
const ScamICO = artifacts.require("scamICO");

module.exports = async function(deployer) {
  deployer.deploy(ScamToken).then(function() {
    return deployer.deploy(Weth9).then(function() {
      return deployer.deploy(ScamICO, Weth9.address, ScamToken.address, 1000, 120).then(function() {
          return ScamToken.deployed().then(function(SCMToken) {
              SCMToken.setMinter(ScamICO.address);
          })
      })
    })
  })
};
