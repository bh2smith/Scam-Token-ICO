

# Gnosis; On-boarding Exercise

The following assignment is meant to introduce several concepts surrounding Ethereum blockchain development and is in no way intended to be deployed as a scam.

## Scam-Token-ICO

**GOAL**: Write an ICO contract to raise 1000 WETH (*Wrapped Ether*).

- Anyone can participate in the sale by transferring WETH to the ICO contract.
- The sale is over once 1000 WETH have been deposited (i.e. no more participation)
- Investors may withdraw their SCM tokens 2 minutes after the sale has ended.
- Scam Token's value is equivalent to 10 times their WETH investment.

### Step 1. Write contracts in solidity.

- ICO contract based on upper requirements.
- Create SCM token. (Decimals: 18, Name: Scam, Symbol: SCM).
- **Do not accept ETH** use the WETH token  at (https://github.com/gnosis/canonical-weth).

### Step 2. Use *truffle*, *ganache* and *web3.js* and WETH as an external dependency.


### Step 3. Write a simple react (or alternative) frontend. [Don't waste time on nice UI].

- Interface should;
    - Show users WETH balance.
    - Show user's SCM balance.
    - Show user's SCM balance to claim.
    - Signal status of ICO.

- Allow user to participate in the ICO by investing a user defined amount.
    The required approve and participate transactions should be signed immediately after each other. That is, Don't wait for the first transaction to be mined.

- Allow user to claim his SCM tokens.

### Step 4. Gas costs, code testing and (test-net) deployment

- Estimate gas costs for each transaction with (https://safe-relay.dev.gnosisdev.com/api/v1/gas-station/)
- Test coverage and reach 100% with automated truffle tests (https://github.com/sc-forks/solidity-coverage)
- Deploy contract on Rinkeby test-net using truffle deploy. Save artifacts in git repository.


## Expectations:

- Implementation time: 1-5 days.
- Share git repository with mentor.

## Questions

1. What are *gas*, *gas limit* and *gas price*?

2. What is a nonce?

    nonce(address) = Total number of transactions (in and out)

3. What is a transaction hash?

    transaction hash is encrypted (unique) identifier of a transaction (contains a mix of addresses, signatures, ETC...). Is basically an encoded version of the transaction.

4. How can you estimate gas costs and what is the issue with eth_estimateGas?

5. What is the difference between a smart contract and a private key controlled account?
