pragma solidity ^0.4.15;

import "zeppelin-solidity/contracts/token/MintableToken.sol";

contract HoneyToken is MintableToken {

    string public name;
    uint8 public decimals;
    string public symbol;

    function HoneyToken() {
        name = "Honey";
        decimals = 18;
        symbol = "HNY";
    }

}
