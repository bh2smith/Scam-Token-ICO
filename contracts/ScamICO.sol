pragma solidity ^0.4.24;

import "canonical-weth/contracts/WETH9.sol";
import "./ScamToken.sol";


contract ScamICO is Owned {
    using Math for *;

    ScamToken public tokenSCM;
    WETH9 public tokenWETH;

    uint public maxInvestment;
    bool public ended;
    uint public endTime;
    uint public waitAfterEndSeconds;
    uint public totalInvested;

    event GoalReached(string msg, uint endTime);
    event ScamWithdraw(uint amount);

    mapping(address => uint) public balanceSCM;

    constructor (
        WETH9 _tokenWETH,
        ScamToken _tokenSCM,
        uint  _investmentCap,
        uint _waitAfterEndSeconds
        ) public {
        owner = msg.sender;
        tokenSCM = _tokenSCM;
        tokenWETH = _tokenWETH;
        maxInvestment = _investmentCap;
        waitAfterEndSeconds = _waitAfterEndSeconds;
    }

    function invest(uint amount) public {
        require(ended == false && tokenWETH.transferFrom(msg.sender, this, amount));
        totalInvested = totalInvested.add(amount);
        if (totalInvested >= maxInvestment) {
            ended = true;
            endTime = now;
            emit GoalReached("Scam ICO finished at", endTime);
        }
        balanceSCM[msg.sender] = balanceSCM[msg.sender].add(amount.mul(10));
    }

    function withdrawFunds() public onlyOwner() {
        tokenWETH.transfer(msg.sender, tokenWETH.balanceOf(this));
        /* suicide(msg.sender); */
    }

    function withdrawSCM() public {
        require(ended && now > endTime + waitAfterEndSeconds);
        uint amountOwed = balanceSCM[msg.sender];
        balanceSCM[msg.sender] = 0;
        tokenSCM.mint(msg.sender, amountOwed);
        emit ScamWithdraw(amountOwed);
    }
}
