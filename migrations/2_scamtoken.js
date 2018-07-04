var ScamToken = artifacts.require("./scamToken.sol");
var Weth9 = artifacts.require("canonical-weth/contracts/WETH9.sol");
var ScamICO = artifacts.require("./scamICO.sol");


module.exports = async function(deployer) {
  deployer.deploy(ScamToken).then(function() {
    return deployer.deploy(Weth9).then(function() {
      return deployer.deploy(ScamICO, Weth9.address, ScamToken.address, 1000).then(function() {
          return ScamToken.deployed().then(function(SCMToken) {
              SCMToken.setMinter(ScamICO.address);
          })
      })
    })
  })
};
