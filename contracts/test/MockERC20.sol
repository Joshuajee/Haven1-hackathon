// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockERC20 is ERC20 {

    constructor() ERC20("Mock ERC20", "ERC20") {
        _mint(msg.sender, type(uint).max);
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
