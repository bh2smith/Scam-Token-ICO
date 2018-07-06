pragma solidity ^0.4.24;

import "@gnosis.pm/util-contracts/contracts/StandardToken.sol";
import "@gnosis.pm/util-contracts/contracts/Math.sol";
import "./Owned.sol";


contract ScamToken is StandardToken, Owned {
    using Math for *;

    string public symbol;
    string public name;
    uint8 public decimals;
    uint public totalSupply;

    address public creator;
    address public minter;

    mapping(address => uint) public balances;
    mapping(address => mapping(address => uint)) public allowed;

    event Minted(address indexed to, uint256 amount);

    modifier onlyCreator() {
        // R1
        require(msg.sender == creator);
        _;
    }

    constructor() public {
        symbol = "SCM";
        name = "Scam";
        decimals = 18;
        totalSupply = 0;
        creator = msg.sender;
        minter = msg.sender;
    }

    // Do not accept ETH!
    function () public payable {
        revert();
    }

    /// @dev Set minter. Only the creator of this contract can call this.
    /// @param newMinter The new address authorized to mint this token
    function setMinter(address newMinter) public onlyCreator() {
        minter = newMinter;
    }

    function totalSupply() public constant returns (uint) {
        return totalSupply - balances[address(0)];
    }

    function balanceOf(address tokenOwner) public constant returns (uint balance) {
        return balances[tokenOwner];
    }

    function transfer(address to, uint tokens) public returns (bool success) {
        require(totalSupply >= tokens);
        balances[msg.sender] = balances[msg.sender].sub(tokens);
        balances[to] = balances[to].add(tokens);
        emit Transfer(msg.sender, to, tokens);
        return true;
    }

    function approve(address spender, uint tokens) public returns (bool success) {
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        return true;
    }

    function transferFrom(address from, address to, uint tokens) public returns (bool success) {
        balances[from] = balances[from].sub(tokens);
        allowed[from][msg.sender] = allowed[from][msg.sender].sub(tokens);
        balances[to] = balances[to].add(tokens);
        emit Transfer(from, to, tokens);
        return true;
    }

    function allowance(address tokenOwner, address spender) public constant returns (uint remaining) {
        return allowed[tokenOwner][spender];
    }

    /// @param to Address to which the minted token will be given
    /// @param amount (SCM to be minted)
    function mint(address to, uint amount)
        public
    {
        /* Minter must be ICO contract */
        require(minter != 0 && msg.sender == minter);
        balances[to] = balances[to].add(amount);
        totalSupply = totalSupply.add(amount);
        emit Minted(to, amount);
    }


}
