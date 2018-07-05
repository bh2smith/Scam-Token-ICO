pragma solidity ^0.4.24;

import "./WETH9.sol";
import "./ScamToken.sol";


contract ScamICO is Owned {
    using Math for *;

    ScamToken public tokenSCM;
    WETH9 public tokenWETH;

    uint public maxInvestment;

    // Should these be initiated in constructor?
    uint256 public totalInvested = 0;
    bool public ended = false;
    uint public endTime = 0;

    event  GoalReached(string msg, uint endtime);

    mapping(address => uint) public balanceSCM;

    constructor (WETH9 _tokenWETH, ScamToken _tokenSCM, uint  _investmentCap) public {
        owner = msg.sender;
        tokenSCM = _tokenSCM;
        tokenWETH = _tokenWETH;
        maxInvestment = _investmentCap;
    }

    function invest(uint amount) public {
        require(ended == false && tokenWETH.transferFrom(msg.sender, this, amount));
        totalInvested = totalInvested.add(amount);
        if (totalInvested >= maxInvestment) {
            ended = true;
            endTime = now;
            emit GoalReached("Scam ICO finished", endTime);
        }
        balanceSCM[msg.sender] = balanceSCM[msg.sender].add(amount.mul(10));
    }

    function withdrawFunds() public onlyOwner() {
        tokenWETH.transfer(msg.sender, tokenWETH.balanceOf(this));
    }

    function withdrawSCM()
        public
    {
        require(ended && now > endTime + 2 seconds);
        uint amountOwed = balanceSCM[msg.sender];
        balanceSCM[msg.sender] = 0;
        tokenSCM.mint(msg.sender, amountOwed);
    }
}
