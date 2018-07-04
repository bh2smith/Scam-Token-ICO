const { assertRejects } = require('./utils.js')
const { wait } = require('@digix/tempo')(web3)

const ScamToken = artifacts.require('ScamToken');
const Weth9 = artifacts.require('WETH9');
const ScamICO = artifacts.require('ScamICO');

contract('ScamToken', accounts => {
    const [creator, a1, a2, a3, a4] = accounts;
    var scam_token;
    var scam_ico;
    var weth_token;

    before(async () => {
        scam_token = await ScamToken.deployed();
        weth_token = await Weth9.deployed();
        scam_ico  = await ScamICO.deployed();
    })

    it('No transfer of scam tokens until minted', async () => {
        await assertRejects(scam_token.transfer(creator, 5));

    })

    it('Send 5 WETH to account 2 and invest in scamICO', async () => {
        depositTx = await weth_token.deposit({ from: a2, value: 5e18 });
        approveTx = await weth_token.approve(scam_ico.address, 5e18, { from: a2 });
        // console.log((await weth_token.allowance.call(a2, scam_ico.address)).toNumber());
        // console.log((await weth_token.allowance.call(scam_ico.address, a2)).toNumber());
        investTx =  await scam_ico.invest(3e18, { from: a2 });

        await assertRejects(scam_ico.withdrawSCM({ from: a2 }));
        console.log("Waiting 3 seconds for the withdraw period to start")
        await wait(3);
        withdrawTx = await scam_ico.withdrawSCM({ from: a2 })
        console.log("Account 2 SCM balance: ", (await scam_token.balanceOf.call(a2)).toString());

    })

})
