const ScamToken = artifacts.require('ScamToken')

contract('ScamToken', accounts => {
  var scam_token;

  before(async () => {
    scam_token = await ScamToken.deployed();
  })

  it('Send 5 SCMs to Alex', async () => {
    scam_token.transfer(accounts[2], 5);
  })

})
