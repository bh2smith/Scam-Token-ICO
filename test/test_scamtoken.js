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

    it('Pure Ultimate Test Case', async () => {
        // Account2 exchanges 1000 ETH for WETH and approves the scam_ico.
        await weth_token.deposit({ from: a2, value: 1000 });
        await weth_token.approve(scam_ico.address, 1000, { from: a2 });

        // Account2 invests 500 and tries to withdrawSCM (ICO isn't over)
        await scam_ico.invest(500, { from: a2 });
        await assertRejects(scam_ico.withdrawSCM({ from: a2 }));

        // Account2 invests another 500 (and tried to withdraw)
        await scam_ico.invest(500, { from: a2 });
        await assertRejects(scam_ico.withdrawSCM({ from: a2 }));

        // Wait for SCM to be claimable (i.e. > 2 minutes) and withdraw SCM
        await wait(121);
        withdrawTx = await scam_ico.withdrawSCM({ from: a2 })

        // Creator takes the money and runs
        prev_bal = (await weth_token.balanceOf.call(creator)).toNumber();
        await scam_ico.withdrawFunds({ from: creator });
        new_bal = (await weth_token.balanceOf.call(creator)).toNumber();

        // Creator should have 1000 WETH after withdrawl
        assert.equal(new_bal - prev_bal, 1000);

        // Account2 transfers 500 SCM to creator
        await scam_token.approve(creator, 2500, {from: a2})

        assert.equal((await scam_token.allowance(a2, creator)).toNumber(), 2500);

        await scam_token.transferFrom(a2, creator, 2500)

        assert.equal((await scam_token.balanceOf.call(creator)).toNumber(), 2500);

        // creator transfer some scam to Account3
        await scam_token.transfer(a3, 1250);
        assert.equal((await scam_token.balanceOf.call(a3)).toNumber(), 1250);

        // Total Supply of scam token should be 10 times the WETH deposit
        var creator_weth = await weth_token.balanceOf.call(creator);
        var scam_supply = await scam_token.totalSupply()
        assert.equal(scam_supply.toNumber(), creator_weth.toNumber()*10);

        await assertRejects(scam_token.sendTransaction({value:100}))

    })

    it('Estimate gas costs', async () => {
        var gasPrice = web3.eth.gasPrice;

        ScamICO.deployed().then(function(instance) {

            // Use the keyword 'estimateGas' after the function name to get the gas estimation for this particular function
            return instance.withdrawSCM.estimateGas();

        }).then(function(result) {
            var gas = Number(result);
            console.log(gasPrice.toString())
            console.log("gas estimation = " + gas + " units");
            console.log("gas cost estimation = " + (gas * gasPrice) + " wei");
            console.log("gas cost estimation = " + ScamICO.web3.fromWei((gas * gasPrice), 'ether') + " ether");
        });
    })

})
