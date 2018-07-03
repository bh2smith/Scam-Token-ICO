var ScamToken = artifacts.require("./scamToken.sol");

module.exports = function(deployer) {
  deployer.deploy(ScamToken);
};
